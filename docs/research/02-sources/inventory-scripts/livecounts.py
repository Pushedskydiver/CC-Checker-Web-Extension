# Bytes at ae49392 of the 30 live test-count lines (classified by hand from counts.py output; records and historical "18 tests" lines excluded).
import subprocess
R='/Users/alexclapperton/Desktop/alex/colour-contrast-checker/CC-Checker-Web-Extension'
L={'AGENTS.md':[19,20,125],'README.md':[93,94,95],'docs/ARCHITECTURE.md':[325],'docs/CONVENTIONS.md':[343,344,345],'docs/DA-REVIEW.md':[20],
   'docs/DEVELOPMENT.md':[47,49,64,435],'docs/GLOSSARY.md':[79,127],'docs/SELF-REVIEW.md':[24,218,219],'docs/TESTING.md':[3,10,11,12,395,396,397,453],
   '.claude/agents/implementer.md':[80],'PROGRESS.md':[667]}
n=b=0
for f,ls in L.items():
    t=subprocess.run(['git','-C',R,'show','ae49392:'+f],capture_output=True,text=True).stdout.splitlines()
    fb=sum(len(t[i-1].encode())+1 for i in ls); n+=len(ls); b+=fb
    print(f,ls,fb)
print('lines',n,'files',len(L),'bytes',b)
