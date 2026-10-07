# usage: sec.py <commit> <file> "<heading prefix>" [--intro]; bytes from that heading to the next heading of the same or higher level
# (--intro: stop at the next heading of any level). Fenced code is skipped when finding headings.
import sys,subprocess
c,f,h=sys.argv[1:4]; intro='--intro' in sys.argv
L=subprocess.run(['git','-C','/Users/alexclapperton/Desktop/alex/colour-contrast-checker/CC-Checker-Web-Extension','show',f'{c}:{f}'],capture_output=True,text=True).stdout.splitlines(keepends=True)
fence=False;heads=[]
for i,l in enumerate(L):
    if l.startswith('```'): fence=not fence
    if not fence and l.startswith('#'): heads.append((i,len(l)-len(l.lstrip('#')),l.lstrip('#').strip()))
s=[x for x in heads if x[2].startswith(h)]
if not s: print('NOTFOUND',h); sys.exit(1)
i,lv,_=s[0]
e=next((j for j,l2,_ in heads if j>i and (l2<=lv or intro)),len(L))
print(sum(len(x.encode()) for x in L[i:e]), f'{f} L{i+1}-{e}', h)
