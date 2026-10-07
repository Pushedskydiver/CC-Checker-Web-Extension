import json,sys,glob,os
P=os.path.expanduser('~/.claude/projects/-Users-alexclapperton-Desktop-alex-colour-contrast-checker-CC-Checker-Web-Extension')
mf=glob.glob(P+'/'+sys.argv[1]+'*.jsonl')[0]
def ctx(u): return u.get('input_tokens',0)+u.get('cache_read_input_tokens',0)+u.get('cache_creation_input_tokens',0)
metas={os.path.basename(m)[6:-10]:json.load(open(m)) for m in glob.glob(mf[:-6]+'/subagents/agent-*.meta.json')}
seen=set();landed=set();n=0
for i,d in enumerate(open(mf)):
    d=json.loads(d);t=d.get('type')
    if t=='assistant':
        m=d['message']
        if m.get('id') not in seen and 'usage' in m:
            seen.add(m.get('id')); n+=1; line=f"{i} T{n} ctx={ctx(m['usage'])} out={m['usage'].get('output_tokens')}"
        else: line=f"{i}    (same msg)"
        tools=[(c['name'],(c['input'].get('description') or c['input'].get('command','') or c['input'].get('file_path',''))[:70].replace('\n',' ')) for c in m.get('content',[]) if c.get('type')=='tool_use']
        print(line,tools if tools else '')
    elif t in('user','attachment'):
        s=json.dumps(d.get('message',d.get('attachment')),ensure_ascii=False)
        for aid,mm in metas.items():
            if aid in s and aid not in landed and 'Async agent launched' not in s:
                landed.add(aid); print(f"{i} LAND {mm['agentType']} {mm.get('description')} {len(s)}B")
