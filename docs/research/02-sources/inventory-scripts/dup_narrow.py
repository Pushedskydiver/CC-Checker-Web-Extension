# Duplicated-incident clusters at a commit, in live AI-facing files (live.txt minus PROGRESS.md, as the self-audit's D-rows cite rule docs;
# PROGRESS.md reported separately). Unit = a "paragraph": a blank-line-separated block, split further at list items and table rows.
import re,subprocess,sys,collections
R='/Users/alexclapperton/Desktop/alex/colour-contrast-checker/CC-Checker-Web-Extension'; C=sys.argv[1] if len(sys.argv)>1 else 'ae49392'
CL={'D5 139-agent audit':(r'\b139\b','docs/REVIEW-PATTERNS.md'),
    'D6 case-sensitivity incident':(r'TS2307|01-Atoms|ignorecase','docs/REVIEW-PATTERNS.md'),
    'D7 version pair 1.6.1/1.6.2':(r'1\.6\.1.{0,40}1\.6\.2|1\.6\.2.{0,40}1\.6\.1','docs/GIT.md'),
    'D8a all_frames incident':(r'all_frames','docs/REVIEW-PATTERNS.md'),
    'D8b comparator incident':(r'localeCompare','docs/REVIEW-PATTERNS.md')}
def units(lines):
    out=[];cur=[];fence=False
    for l in lines:
        if l.startswith('```'): fence=not fence
        starts = (not fence) and (re.match(r'\s*([-*]|\d+\.)\s',l) or l.startswith('|') or l.startswith('#'))
        if l.strip()=='' or starts:
            if cur: out.append(cur); cur=[]
            if l.strip()=='': continue
        cur.append(l)
    if cur: out.append(cur)
    return out
files=[f for f in open('live.txt').read().split()]
for name,(rx,owner) in CL.items():
    hits=collections.defaultdict(list)
    for f in files:
        txt=subprocess.run(['git','-C',R,'show',f'{C}:{f}'],capture_output=True,text=True).stdout.splitlines(keepends=True)
        for u in units(txt):
            s=''.join(u)
            if re.search(rx,s.replace('\n',' ')): hits[f].append(len(s.encode()))
    allf={f:v for f,v in hits.items()}
    nonprog={f:v for f,v in allf.items() if f!='PROGRESS.md'}
    tot=sum(sum(v) for v in nonprog.values()); n=sum(len(v) for v in nonprog.values())
    own=sum(nonprog.get(owner,[]))
    pr=allf.get('PROGRESS.md',[])
    print(f"{name}: {n} paragraphs in {len(nonprog)} files (excl. PROGRESS.md), {tot} B; owner {owner} {own} B; outside owner {tot-own} B; PROGRESS.md {len(pr)} paras {sum(pr)} B")
    print('    ',{f.replace('docs/','').replace('.claude/agents/','agents/'):sum(v) for f,v in sorted(nonprog.items())})
