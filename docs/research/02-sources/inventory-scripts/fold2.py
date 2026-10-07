# Coordinator fold spans: start = first main-thread assistant turn after the latest reviewer-report landing;
# end = the main-thread assistant turn that issues `git commit` with "Fold" in its message. Context = input+cache_read+cache_creation.
# Fold size = the matching commit at ae49392's history: lines +/- and bytes of '+' lines (git show --format= -U0).
import json,glob,os,re,subprocess,collections
REPO='/Users/alexclapperton/Desktop/alex/colour-contrast-checker/CC-Checker-Web-Extension'
P=os.path.expanduser('~/.claude/projects/-Users-alexclapperton-Desktop-alex-colour-contrast-checker-CC-Checker-Web-Extension')
SESS={'2359a1d8':6,'b993b5b2':7,'3704c181':8,'2817dc88':9,'36b23352':10,'d95d2d49':11,'d9ee3c46':12,'23cd60eb':13,'451bf13c':14,'baadc845':15,'da7ca3eb':16,'8a9f262b':17,'458fbbbc':18,'f460fe14':19,'e336eae4':20,'b3a779e5':21,'78c45389':22,'1b2340c7':23,'08d27539':24,'92ebd181':25,'d2e18d80':26}
REV=('da-review','copilot-surrogate','spec-grill','general-purpose')
def ctx(u): return u.get('input_tokens',0)+u.get('cache_read_input_tokens',0)+u.get('cache_creation_input_tokens',0)
log=subprocess.run(['git','-C',REPO,'log','ae49392','--format=%h\t%s'],capture_output=True,text=True).stdout.splitlines()
subj={}
for l in log:
    h,s=l.split('\t',1); subj.setdefault(re.sub(r' \(#\d+\)$','',s),h)
def size(h):
    out=subprocess.run(['git','-C',REPO,'show','--format=','--word-diff=porcelain','-U0',h],capture_output=True,text=True).stdout.splitlines()
    add=[l for l in out if l.startswith('+') and not l.startswith('+++')]; dele=[l for l in out if l.startswith('-') and not l.startswith('---')]
    return sum(len(l[1:].encode()) for l in add),sum(len(l[1:].encode()) for l in dele),len([l for l in out if l.startswith('@@')])
rows=[]
for mf in glob.glob(P+'/*.jsonl'):
    su=os.path.basename(mf)[:8]
    if su not in SESS: continue
    main=[json.loads(l) for l in open(mf)]
    metas={os.path.basename(m)[6:-10]:json.load(open(m)) for m in glob.glob(mf[:-6]+'/subagents/agent-*.meta.json')}
    ev=[];seen=set();landed=set()
    for i,d in enumerate(main):
        t=d.get('type')
        if t=='assistant':
            m=d['message']; c_=ctx(m.get('usage',{}))
            if m.get('id') not in seen and 'usage' in m: seen.add(m.get('id')); ev.append((i,'turn',c_))
            for c in m.get('content',[]):
                if c.get('type')=='tool_use' and c['name']=='Bash':
                    cmd=c['input'].get('command','')
                    if 'git commit' in cmd:
                        mm=re.search(r'git commit[^\n]*?(?:-[a-z]*m\s+"|<<\'?EOF\'?\n)([^\n]+)',cmd)
                        s=mm.group(1).replace("\\'","'").rstrip('"').strip() if mm else ''
                        if re.search(r'📝 Fold',s): ev.append((i,'foldcommit',(s,c_)))
        else:
            s=None
            if t=='user':
                c=d['message']['content']; s=c if isinstance(c,str) else json.dumps(c,ensure_ascii=False)
            elif t=='attachment' and d['attachment'].get('type')=='queued_command':
                s=json.dumps(d['attachment'].get('prompt'),ensure_ascii=False)
            if s and 'Async agent launched' not in s:
                for aid,m in metas.items():
                    if aid in landed: continue
                    if aid in s or (m.get('toolUseId') and m['toolUseId'] in s):
                        landed.add(aid); ev.append((i,'land',m.get('agentType'))); break
    ev.sort(key=lambda e:(e[0],e[1]!='turn'))
    final=max(e[2] for e in ev if e[1]=='turn')
    lastland=None
    for k,e in enumerate(ev):
        if e[1]=='land' and e[2] in REV: lastland=k
        if e[1]=='foldcommit' and lastland is not None:
            start=next((x[2] for x in ev[lastland+1:] if x[1]=='turn'),None)
            endc=next((x[2] for x in ev[k+1:] if x[1]=='turn'),e[2][1])
            s=e[2][0]; h=subj.get(s)
            sz=size(h) if h else (None,None,None)
            rows.append((SESS[su],s[:70],h,start,endc,endc-start,sz,final))
            lastland=None
rows.sort()
per=collections.defaultdict(lambda:[0,0])
for r in rows:
    print(f"S{r[0]} | {r[2]} | {r[1]} | start {r[3]} end {r[4]} growth {r[5]} | +{r[6][0]}/-{r[6][1]} B words, {r[6][2]} hunks")
    per[r[0]][0]+=r[5]; per[r[0]][1]=r[7]
print()
for s,(g,f) in sorted(per.items()): print(f"S{s} fold growth {g} of final {f} = {g/f:.1%}")
json.dump(rows,open('folds.json','w'))
