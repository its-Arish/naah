#!/usr/bin/env python3
"""
script_to_beats.py <projectDir>

Turns a plain script (script.md) into a first draft of beats/00-draft.json.
It is a mechanical split. Claude (or you) then goes through the draft to pick shots, dates,
emphasis, gags and sound cues. The draft never overwrites hand-edited beats files.

script.md format (all optional except the narration):

    # Video title
    ## Act 1: Section title           -> a new section with a title card
    ## Cold Open {nocard}              -> a section with no title card
    Narration paragraphs. Blank line = new paragraph. *word* = emphasis.
    [On-screen: 1192 | Tarain]         -> the date tag for the following beats (first number = year)
    [HOST] ...paragraph...             -> narrator-on-stage beat (default for the first line of a section)
    [STORY] / [INSERT] ...             -> force a beat type for this paragraph
    [SKETCH]                           -> following lines "A: ..." / "B: ..." are dialogue bubbles
    [/SKETCH]
    [Note: ...] or (( ... ))           -> production notes, ignored

Paragraphs are split into beats of at most 14 words, breaking at sentence ends, then at commas.
"""
import json, os, re, sys

MAX_WORDS = 14

def split_sentences(text):
    parts = re.split(r'(?<=[.!?…])\s+(?=[A-Z0-9"\'*(])', text.strip())
    return [p for p in parts if p]

def chunk(sentence):
    words = sentence.split()
    if len(words) <= MAX_WORDS:
        return [sentence]
    # break at commas / semicolons / dashes nearest the middle, recursively
    out, cur = [], []
    for w in words:
        cur.append(w)
        if len(cur) >= MAX_WORDS * 0.55 and re.search(r'[,;:—–]$', w):
            out.append(' '.join(cur)); cur = []
        elif len(cur) >= MAX_WORDS:
            out.append(' '.join(cur)); cur = []
    if cur:
        if out and len(cur) < 4:
            out[-1] += ' ' + ' '.join(cur)
        else:
            out.append(' '.join(cur))
    return out

def slug(s, n=10):
    s = re.sub(r'[^a-z0-9]+', '', s.lower())
    return (s[:n] or 'x')

def main():
    P = sys.argv[1] if len(sys.argv) > 1 else '.'
    src = None
    for name in ('script.md', 'script.txt'):
        if os.path.exists(os.path.join(P, name)):
            src = os.path.join(P, name); break
    if not src:
        sys.exit('No script.md in ' + P)
    lines = open(src, encoding='utf-8').read().splitlines()

    title, sections = None, []
    sec = None
    date = None
    forced = None
    in_sketch = False
    para = []

    def new_section(t, card=True):
        nonlocal sec
        sec = {'title': t, 'beats': []}
        if not card:
            sec['card'] = False
        sections.append(sec)

    def add_beats(text, typ, first_only=False):
        if sec is None:
            new_section('Intro', card=False)
        k = 0
        for s in split_sentences(text):
            for c in chunk(s):
                if first_only and k > 0:
                    typ = 'STORY'
                k += 1
                n = len(sections)
                bid = f"s{n:02d}b{len(sec['beats'])+1:02d}"
                b = {'id': bid, 'shot': 'todo_' + slug(c), 'type': typ, 'text': c}
                if date is not None and typ != 'HOST':
                    b['date'] = date
                sec['beats'].append(b)

    def flush():
        nonlocal para, forced
        if not para:
            return
        text = ' '.join(para).strip()
        para = []
        if not text:
            return
        # default: the opening line of a section is the narrator on stage, the rest is STORY
        opener = forced is None and (sec is None or not sec['beats'])
        typ = forced or ('HOST' if opener else 'STORY')
        forced = None
        add_beats(text, typ, first_only=opener)

    for raw in lines:
        line = raw.strip()
        line = re.sub(r'\(\(.*?\)\)', '', line)
        if re.match(r'^\[(note|notes|visual|music|sfx)\b.*\]$', line, re.I):
            continue
        if line.startswith('# ') and not line.startswith('## '):
            flush(); title = line[2:].strip(); continue
        if line.startswith('## '):
            flush()
            t = line[3:].strip()
            card = '{nocard}' not in t
            new_section(t.replace('{nocard}', '').strip(), card)
            continue
        m = re.match(r'^\[on-?screen:\s*([^\]]*)\]$', line, re.I)
        if m:
            flush()
            y = re.search(r'(-?\d{1,4})\s*(BCE?|B\.C\.)?', m.group(1), re.I)
            date = (-int(y.group(1)) if y.group(2) else int(y.group(1))) if y else None
            continue
        if re.match(r'^\[sketch\]$', line, re.I):
            flush(); in_sketch = True; continue
        if re.match(r'^\[/sketch\]$', line, re.I):
            in_sketch = False; continue
        if in_sketch:
            m = re.match(r'^([AB])\s*:\s*(.+)$', line)
            if m:
                if sec is None:
                    new_section('Intro', card=False)
                bid = f"s{len(sections):02d}b{len(sec['beats'])+1:02d}"
                sec['beats'].append({'id': bid, 'shot': 'todo_sketch', 'type': 'SKETCH', 'speaker': m.group(1), 'text': m.group(2).strip()})
            elif not line:
                pass
            else:
                in_sketch = False
                para.append(line)
            continue
        m = re.match(r'^\[(HOST|STORY|INSERT)\]\s*(.*)$', line, re.I)
        if m:
            flush(); forced = m.group(1).upper(); line = m.group(2)
        if not line:
            flush(); continue
        para.append(line)
    flush()

    os.makedirs(os.path.join(P, 'beats'), exist_ok=True)
    out = os.path.join(P, 'beats', '00-draft.json')
    others = [f for f in os.listdir(os.path.join(P, 'beats')) if f.endswith('.json') and f != '00-draft.json']
    if others:
        out = os.path.join(P, 'build', 'draft-beats.json')
        os.makedirs(os.path.dirname(out), exist_ok=True)
        print('beats/ already has hand-edited files; writing the draft to build/draft-beats.json instead')
    with open(out, 'w', encoding='utf-8') as f:
        f.write('{\n  "title": ' + json.dumps(title or 'Untitled') + ',\n  "sections": [\n')
        for i, s in enumerate(sections):
            head = {k: v for k, v in s.items() if k != 'beats'}
            f.write('    ' + json.dumps(head, ensure_ascii=False)[:-1] + ', "beats": [\n')
            f.write(',\n'.join('      ' + json.dumps(b, ensure_ascii=False) for b in s['beats']))
            f.write('\n    ]}' + (',' if i < len(sections) - 1 else '') + '\n')
        f.write('  ]\n}\n')
    nb = sum(len(s['beats']) for s in sections)
    nw = sum(len(b['text'].split()) for s in sections for b in s['beats'])
    print(f'{len(sections)} sections, {nb} beats, {nw} words (~{nw/3.2/60:.1f} min of narration) -> {os.path.relpath(out, P)}')

if __name__ == '__main__':
    main()
