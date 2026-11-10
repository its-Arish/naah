import re, sys
src, dst = sys.argv[1], sys.argv[2]
CUT_A, CUT_B = 441.0, 456.3
DROP = set(range(148, 155))
FIX = {
 9: "Today, that not-island has one of the five biggest economies on Earth.",
 16: "A hundred! In one state.",
 18: "On the coast, the Chumash built plank canoes and paddled out to the islands.",
 21: "Hold on to those fires. California is going to need them.",
 22: "And the gold? It was lying right there in the riverbeds.",
 25: "1542. A captain named Cabrillo sails up the coast for Spain.",
 31: "In between, the English sea captain Francis Drake stopped by in 1579.",
 32: "He fixed his ship, claimed the whole place for his queen, and left.",
 39: "from San Diego to Sonoma, linked by one road. El Camino Real, the Royal Road.",
 45: "Native families were brought in to work and to pray.",
 49: "Rush number one was for souls and for empire.",
 66: "And the California grizzly? Extinct.",
 70: "Nine days earlier, on a river in the California hills,",
 81: "Because a shopkeeper named Sam Brannan heard the news,",
 84: "Then, the story goes, he ran through the streets of San Francisco,",
 86: "Gold! Gold from the American River!",
 100: "Around 150,000 Native people lived in California when the gold was found.",
 106: "A genocide.",
 108: "And the men who started it all?",
 117: "Remember the shopkeeper.",
 130: "Starting to see a pattern?",
 139: "And the thanks?",
 172: "They rebuilt it in under 10 years.",
 175: "So the city's water chief, William Mulholland, built an aqueduct.",
 180: "Mulholland gave a speech. Five words.",
 183: "Owens Lake dried into a bowl of dust.",
 184: "And a small group of insiders, who had quietly bought the empty land where the water would arrive?",
 185: "They got very, very rich.",
 191: "New rush. Same rule.",
 192: "And the next crowd arrived with nothing left to lose.",
 207: "Planes in the south, ships in the north.",
 213: "on the West Coast and into camps behind barbed wire.",
 227: "People called it the Valley of Heart's Delight.",
 230: "In 1956, one of the inventors of the transistor moved to the valley,",
 231: "to be near his mother. He hired eight brilliant young engineers.",
 243: "So the first word ever sent online was... lo.",
 245: "Two friends named Steve, and another garage.",
 248: "Two students, and another garage.",
 260: "Remember the small, careful fires from the very beginning?",
 265: "So. The question I promised you at the start.",
 269: "Sam Brannan, the shopkeeper with the shovels? He became California's first millionaire.",
 271: "The railroad? Four shopkeepers.",
 272: "The water? The men who bought the land first.",
 280: "And in today's rush? One of the most valuable companies on Earth is not digging for AI gold at all.",
}
def t2s(t):
    h, m, r = t.split(':'); s, ms = r.split(',')
    return int(h)*3600 + int(m)*60 + int(s) + int(ms)/1000
def s2t(x):
    ms = round(x*1000); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"
blocks = re.split(r'\n\s*\n', open(src, encoding='utf-8-sig').read().strip())
out, n, used = [], 0, set()
for b in blocks:
    lines = b.strip().splitlines()
    idx = int(lines[0]); a, z = [t2s(x.strip()) for x in lines[1].split('-->')]
    text = ' '.join(lines[2:])
    if idx in DROP: continue
    if idx in FIX: text = FIX[idx]; used.add(idx)
    if a >= CUT_B - 0.5: a -= CUT_B - CUT_A; z -= CUT_B - CUT_A
    n += 1
    out.append(f"{n}\n{s2t(a)} --> {s2t(z)}\n{text}\n")
open(dst, 'w', encoding='utf-8').write('\n'.join(out))
print("cues in:", len(blocks), "out:", n, "fixed:", len(used), "unused fixes:", sorted(set(FIX)-used))
