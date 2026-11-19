"""Replace dark leading frames (satellite tiles not yet drawn) in clips/seg/<seg>.mp4 by holding the first good frame,
then rejoin the affected beats.   python3 tools/fix_dark_lead.py <seg ids...>"""
import json, os, subprocess, sys
import numpy as np
PROJ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CL = os.path.join(PROJ, 'clips')
man = json.load(open(os.path.join(PROJ, 'historymap', 'manifest.json')))
M = {m['seg']: m for m in man}
def means(p):
    raw = subprocess.run(['ffmpeg','-v','error','-i',p,'-vf','scale=64:36','-f','rawvideo','-pix_fmt','rgb24','-'],capture_output=True).stdout
    n = len(raw)//(64*36*3)
    a = np.frombuffer(raw[:n*64*36*3], np.uint8).reshape(n,36,64,3).astype(float)
    return [a[i,6:30].mean() for i in range(n)]
touched=set()
for s in sys.argv[1:]:
    p = os.path.join(CL,'seg',f'{s}.mp4'); v = means(p)
    k = 0
    while k < len(v) and v[k] < 30: k += 1
    if k == 0: continue
    print(s, 'dark lead', k, 'of', len(v), '(fully dark!)' if k == len(v) else '')
    if k >= len(v): continue
    tmp = p + '.tmp.mp4'
    subprocess.run(['ffmpeg','-v','error','-y','-i',p,'-vf',f'select=gte(n\\,{k}),setpts=N/30/TB,tpad=start_mode=clone:start={k}','-r','30','-frames:v',str(len(v)),'-c:v','libx264','-crf','17','-preset','veryfast','-pix_fmt','yuv420p','-an',tmp],check=True)
    os.replace(tmp, p); touched.add(M[s]['beat'])
for beat in touched:
    segs = [m for m in man if m['beat'] == beat]
    lst = os.path.join(CL,'seg',f'{beat}.txt')
    subprocess.run(['ffmpeg','-v','error','-y','-f','concat','-safe','0','-i',lst,'-c','copy',os.path.join(CL,f'{beat}.mp4')],check=True)
print('rejoined', sorted(touched))
