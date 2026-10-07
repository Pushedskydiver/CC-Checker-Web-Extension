# Fold spans in main sessions: from a reviewer report landing to the next Agent dispatch / git push / gh pr / next report landing.
import json,glob,os,sys,collections
P=os.path.expanduser('~/.claude/projects/-Users-alexclapperton-Desktop-alex-colour-contrast-checker-CC-Checker-Web-Extension')
SESS={'451bf13c':14,'baadc845':15,'da7ca3eb':16,'8a9f262b':17,'458fbbbc':18,'f460fe14':19,'e336eae4':20,'b3a779e5':21,'78c45389':22,'1b2340c7':23,'08d27539':24,'92ebd181':25,'d2e18d80':26}
REV=('da-review','copilot-surrogate','spec-grill')
def ctx(u): return u.get('input_tokens',0)+u.get('cache_read_input_tokens',0)+u.get('cache_creation_input_tokens',0)
verbose=len(sys.argv)>1
tot=collections.defaultdict(lambda:[0,0,0,0])
for mf in sorted(glob.glob(P+'/*.jsonl'),key=lambda f:SESS.get(os.path.basename(f)[:8],0)):
    su=os.path.basename(mf)[:8]
    if su not in SESS: continue
    main=[json.loads(l) for l in open(mf)]
    metas={}
    for m in glob.glob(mf[:-6]+'/subagents/agent-*.meta.json'):
        metas[os.path.basename(m)[6:-10]]=json.load(open(m))
    ev=[] # (idx, kind, data)
    seen=set()
    for i,d in enumerate(main):
        t=d.get('type')
        if t=='assistant':
            m=d['message']
            if m.get('id') not in seen and 'usage' in m:
                seen.add(m.get('id')); ev.append((i,'turn',ctx(m['usage'])))
            for c in m.get('content',[]):
                if c.get('type')=='tool_use':
                    n=c['name'];inp=c['input']
                    if n in('Agent','Task'): ev.append((i,'dispatch',inp.get('subagent_type')))
                    elif n=='Bash' and any(k in inp.get('command','') for k in('git push','gh pr create','gh pr ready','gh pr merge')): ev.append((i,'push',inp['command'][:60]))
                    elif n in('Edit','Write','MultiEdit'):
                        b=len(inp.get('new_string',inp.get('content','')).encode()); ob=len(inp.get('old_string','').encode())
                        ev.append((i,'edit',(os.path.basename(inp.get('file_path','')),b,ob)))
        else:
            s=None
            if t=='user':
                c=d['message']['content']
                s=c if isinstance(c,str) else json.dumps(c,ensure_ascii=False)
            elif t=='attachment' and d['attachment'].get('type')=='queued_command':
                s=json.dumps(d['attachment'].get('prompt'),ensure_ascii=False)
            if s and 'Async agent launched' not in s:
                for aid,m in metas.items():
                    if aid in s or (m.get('toolUseId') and m['toolUseId'] in s and 'tool_result' in s):
                        ev.append((i,'land',m.get('agentType')+':'+(m.get('description') or '')[:30])); break
    ev.sort(key=lambda e:e[0])
    final=max(e[2] for e in ev if e[1]=='turn')
    spans=[]
    for k,e in enumerate(ev):
        if e[1]!='land' or not e[2].split(':')[0] in REV: continue
        turns=[];edits=[];end=None
        for e2 in ev[k+1:]:
            if e2[1]=='turn': turns.append(e2[2])
            if e2[1]=='edit': edits.append(e2[2])
            if e2[1] in('dispatch','push','land'): end=e2; break
        if edits and turns:
            # the ending turn is the last turn recorded (the one issuing the end event)
            g=turns[-1]-turns[0]
            spans.append((e[2],len(edits),sum(x[1] for x in edits),sum(x[2] for x in edits),turns[0],turns[-1],g,end[1] if end else 'EOF',sorted(set(x[0] for x in edits))))
    fg=sum(s[6] for s in spans)
    print(f"S{SESS[su]} {su} final_ctx={final} fold_spans={len(spans)} fold_growth={fg} share={fg/final:.1%}")
    tot['all'][0]+=fg; tot['all'][1]+=final
    if verbose:
        for s in spans: print('   ',s)
