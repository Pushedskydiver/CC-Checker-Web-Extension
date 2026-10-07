# Extract one row per top-level subagent sidechain (subagents/agent-*.jsonl, not workflows/), all main sessions but the live 12ef5373.
import json,glob,os,re,sys
P=os.path.expanduser('~/.claude/projects/-Users-alexclapperton-Desktop-alex-colour-contrast-checker-CC-Checker-Web-Extension')
SESS={'2d76863c':'1-4','7c8da1ea':'5','2359a1d8':'6','b993b5b2':'7','3704c181':'8','2817dc88':'9','36b23352':'10','d95d2d49':'11','d9ee3c46':'12','23cd60eb':'13','451bf13c':'14','baadc845':'15','da7ca3eb':'16','8a9f262b':'17','458fbbbc':'18','f460fe14':'19','e336eae4':'20','b3a779e5':'21','78c45389':'22','1b2340c7':'23','08d27539':'24','92ebd181':'25','d2e18d80':'26'}
def ctx(u): return u.get('input_tokens',0)+u.get('cache_read_input_tokens',0)+u.get('cache_creation_input_tokens',0)
out=[]
for mf in sorted(glob.glob(P+'/*.jsonl')):
    su=os.path.basename(mf)[:8]
    if su=='12ef5373': continue
    main=[json.loads(l) for l in open(mf)]
    # main-thread assistant turns, deduped by message id: (index, ctx)
    turns=[];seen=set()
    for i,d in enumerate(main):
        if d.get('type')=='assistant' and 'usage' in d.get('message',{}):
            mid=d['message'].get('id')
            if mid in seen: continue
            seen.add(mid); turns.append((i,ctx(d['message']['usage'])))
    for sf in sorted(glob.glob(mf[:-6]+'/subagents/agent-*.jsonl')):
        aid=os.path.basename(sf)[6:-6]
        meta=json.load(open(sf[:-6]+'.meta.json')) if os.path.exists(sf[:-6]+'.meta.json') else {}
        side=[json.loads(l) for l in open(sf)]
        ids=[];first=None;last=None;texts=[];handback=None
        for d in side:
            if d.get('type')!='assistant': continue
            m=d['message']; mid=m.get('id')
            if mid not in ids:
                ids.append(mid)
                if first is None: first=ctx(m.get('usage',{}))
                last=ctx(m.get('usage',{}))
            for c in m.get('content',[]):
                if c.get('type')=='text': texts.append((mid,c['text']))
                if c.get('type')=='tool_use' and c['name']=='SubagentHandback': handback=c['input'].get('message','')
        if handback is not None: reply=handback; how='handback'
        else:
            lastmid=ids[-1] if ids else None
            reply='\n'.join(t for m_,t in texts if m_==lastmid); how='lasttext'
        # where the report landed in main context: user records / queued_command attachments naming this agent id (not the launch notice)
        landed=0;land_idx=None
        tuid=meta.get('toolUseId')
        for i,d in enumerate(main):
            s=None
            if d.get('type')=='user':
                c=d['message']['content']
                if isinstance(c,str): s=c
                else:
                    for x in c:
                        if x.get('type')=='tool_result' and x.get('tool_use_id')==tuid:
                            t=json.dumps(x.get('content'),ensure_ascii=False)
                            if 'Async agent launched' in t: continue
                            s=t
                        elif x.get('type')=='text' and aid in x.get('text',''): s=x['text']
            elif d.get('type')=='attachment' and d['attachment'].get('type')=='queued_command':
                s=d['attachment'].get('prompt'); s=s if isinstance(s,str) else json.dumps(s,ensure_ascii=False)
            if s and (aid in s or (tuid and tuid in s) or (d.get('type')=='user' and not isinstance(d['message']['content'],str))):
                if aid in s or tuid in s or True:
                    if s and (aid in s or tuid in s or 'tool_result' in json.dumps(d['message']['content'] if d.get('type')=='user' else '')):
                        pass
                if (aid in s) or (tuid and tuid in s) or (d.get('type')=='user' and isinstance(d['message']['content'],list) and any(x.get('tool_use_id')==tuid for x in d['message']['content'] if isinstance(x,dict))):
                    b=len(s.encode()); landed+=b
                    if land_idx is None or b>2000: land_idx=i if land_idx is None else land_idx
        before=after=after2=None
        if land_idx is not None:
            pb=[c for i,c in turns if i<land_idx]; pa=[c for i,c in turns if i>land_idx]
            before=pb[-1] if pb else None; after=pa[0] if pa else None; after2=pa[1] if len(pa)>1 else None
        out.append(dict(sess=SESS.get(su,su),su=su,aid=aid,type=meta.get('agentType'),desc=meta.get('description'),model=meta.get('model'),
            turns=len(ids),first_ctx=first,last_ctx=last,reply_b=len(reply.encode()),how=how,landed_b=landed,ctx_before=before,ctx_after=after,ctx_after2=after2))
json.dump(out,open(sys.argv[1],'w'),indent=0)
print(len(out))
