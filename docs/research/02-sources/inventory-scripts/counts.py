# Test-count mentions at ae49392 in live AI-facing files: a number 11/18/20/21/22/25/28/36 within 30 chars of Vitest/unit/Playwright/e2e/test(s)/case(s), either order.
import re,subprocess
R='/Users/alexclapperton/Desktop/alex/colour-contrast-checker/CC-Checker-Web-Extension'
N=r'\b(11|18|20|21|22|25|28|36)\b'
W=r'(Vitest|vitest|unit|Playwright|playwright|e2e|tests?\b|cases?\b|passed)'
pat=re.compile(N+r'[^\n]{0,30}?'+W+'|'+W+r'[^\n]{0,12}?'+N)
tot_lines=0;tot_b=0;files=set();rows=[]
for f in open('live.txt').read().split():
    txt=subprocess.run(['git','-C',R,'show','ae49392:'+f],capture_output=True,text=True).stdout.splitlines()
    for i,l in enumerate(txt,1):
        if pat.search(l):
            rows.append((f,i,l)); tot_lines+=1; tot_b+=len(l.encode())+1; files.add(f)
for f,i,l in rows: print(f'{f}:{i}: {l[:150]}')
print('TOTAL lines',tot_lines,'files',len(files),'bytes of those lines',tot_b)
