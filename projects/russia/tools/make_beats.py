"""Builds beats/NN-*.json from beats/00-draft.json (kept as tools/draft.json) + the direction table below.
Skipped-in-recording beats are merged into a neighbour so captions follow the script."""
import json, os, re
H = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
draft = json.load(open(os.path.join(H, 'tools', 'draft.json')))
SECS = draft['sections'] if isinstance(draft, dict) else draft
MERGE_PREV = {'s02b29', 's03b06', 's07b26'}
MERGE_NEXT = {'s07b15', 's07b16'}
DROP = {'s11b14', 's01b13', 's01b14'}  # s11b14 not read; s01b13/14 cut (the new hook says it)
INS = json.load(open(os.path.join(H, 'tools', 'inserts.json'))) if os.path.exists(os.path.join(H, 'tools', 'inserts.json')) else []
D = json.load(open(os.path.join(H, 'tools', 'direction.json')))
for si, sec in enumerate(SECS):
    beats, carry = [], ''
    for b in sec['beats']:
        if b['id'] in DROP: continue
        if b['id'] in MERGE_NEXT: carry += b['text'] + ' '; continue
        if b['id'] in MERGE_PREV: beats[-1]['text'] += ' ' + b['text']; continue
        if carry: b['text'] = carry + b['text']; carry = ''
        beats.append(b)
    for ins in INS:
        ids = [x['id'] for x in beats]
        key = ins.get('after') or ins.get('before')
        if key in ids:
            k = ids.index(key) + (1 if 'after' in ins else 0)
            new = [{kk: v for kk, v in nb.items()} for nb in ins['beats']]
            for nb in new: nb['_ins'] = True
            beats[k:k] = new
    for b in beats:
        if b.pop('_ins', False):
            em = b.pop('em', [])
            text = b['text']
            if em:
                toks = text.split(' ')
                for w in em:
                    key = re.sub(r'[^\w]', '', w).lower()
                    for i, t in enumerate(toks):
                        m = re.match(r'^([^\w$]*)(.+?)([.,;:!?"…]*)$', t)
                        if m and re.sub(r'[^\w]', '', m.group(2)).lower() == key and '*' not in t:
                            toks[i] = m.group(1) + '*' + m.group(2) + '*' + m.group(3); break
                text = ' '.join(toks)
            b['text'] = text
            continue
        d = D.get(b['id'])
        b.pop('shot', None)
        if d:
            text = b['text']
            b.update(d)
            if 'em' in d:  # emphasise words (punctuation stays outside the asterisks)
                toks = text.split(' ')
                for w in d['em']:
                    key = re.sub(r'[^\w]', '', w).lower()
                    for i, t in enumerate(toks):
                        m = re.match(r'^([^\w$]*)(.+?)([.,;:!?"]*)$', t)
                        if m and re.sub(r'[^\w]', '', m.group(2)).lower() == key and '*' not in t:
                            toks[i] = m.group(1) + '*' + m.group(2) + '*' + m.group(3); break
                text = ' '.join(toks)
                b.pop('em', None)
            b['text'] = text
        b.setdefault('shot', 'todo_' + sec.get('title', 'x').split(':')[0].replace(' ', '').lower())
    out = {'title': sec.get('title'), 'sections': [{**{k: v for k, v in sec.items() if k != 'beats'}, 'beats': beats}]}
    json.dump(out, open(os.path.join(H, 'beats', f'{si:02d}-sec.json'), 'w'), indent=1, ensure_ascii=False)
# captions = script text exactly (the creator's instruction), timing from the voice
caps = {'_note': 'Captions follow the script (creator instruction); timing comes from the recording.'}
for f in sorted(os.listdir(os.path.join(H, 'beats'))):
    if f.endswith('-sec.json'):
        for s in json.load(open(os.path.join(H, 'beats', f)))['sections']:
            for b in s['beats']: caps[b['id']] = b['text']
json.dump(caps, open(os.path.join(H, 'vo_captions.json'), 'w'), indent=1, ensure_ascii=False)
print('ok', sum(1 for k in caps if k != '_note'), 'beats')
