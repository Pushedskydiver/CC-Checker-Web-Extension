# For the first N main-thread turns: each turn's ctx, the tool calls it made, and the bytes of the tool results (and attachments) that came back before the next turn.
import json,sys,glob,os
P=os.path.expanduser('~/.claude/projects/-Users-alexclapperton-Desktop-alex-colour-contrast-checker-CC-Checker-Web-Extension')
f=glob.glob(P+'/'+sys.argv[1]+'*.jsonl')[0]; N=int(sys.argv[2])
def ctx(u): return u.get('input_tokens',0)+u.get('cache_read_input_tokens',0)+u.get('cache_creation_input_tokens',0)
seen=set();turns=[];cur=None
for l in open(f):
    d=json.loads(l);t=d.get('type')
    if t=='assistant':
        m=d['message']
        if m.get('id') not in seen and 'usage' in m:
            seen.add(m.get('id')); cur={'ctx':ctx(m['usage']),'out':m['usage'].get('output_tokens'),'tools':[],'res':0,'att':0}; turns.append(cur)
        for c in m.get('content',[]):
            if c.get('type')=='tool_use': cur['tools'].append((c['name'],(c['input'].get('file_path') or c['input'].get('command') or '')[:90].replace('\n',' ')))
    elif t=='user' and cur is not None:
        c=d['message']['content']
        if isinstance(c,list):
            for x in c:
                if x.get('type')=='tool_result':
                    cc=x.get('content'); s=cc if isinstance(cc,str) else ''.join(y.get('text','') for y in cc if isinstance(y,dict))
                    cur['res']+=len(s.encode())
        else: cur['res']+=len(c.encode())
    elif t=='attachment' and cur is not None:
        cur['att']+=len(json.dumps(d['attachment'],ensure_ascii=False).encode())
for i,tn in enumerate(turns[:N]):
    nxt=turns[i+1]['ctx'] if i+1<len(turns) else None
    d=(nxt-tn['ctx']) if nxt else None
    print(f"T{i+1} ctx={tn['ctx']} next_delta={d} out={tn['out']} result_bytes={tn['res']} attach_bytes={tn['att']} B/tok={(tn['res']/(d-tn['out'])) if d and tn['res'] and d>tn['out'] else '-'}",tn['tools'])
