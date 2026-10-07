import json,glob,os,re,collections
P=os.path.expanduser('~/.claude/projects/-Users-alexclapperton-Desktop-alex-colour-contrast-checker-CC-Checker-Web-Extension')
rows=[]
for f in sorted(glob.glob(P+'/*.jsonl')):
    u=os.path.basename(f)[:-6]
    if u.startswith('12ef5373'): continue
    ts=[];prs=set();created=[];agents=collections.Counter();first=None;sessmentions=collections.Counter()
    for l in open(f):
        d=json.loads(l)
        t=d.get('timestamp')
        if t: ts.append(t)
        if d.get('type')=='pr-link': prs.add(d['prNumber'])
        if d.get('type')=='assistant' and not d.get('isSidechain'):
            for c in d['message'].get('content',[]):
                if c.get('type')=='tool_use':
                    i=c.get('input',{})
                    if c['name'] in('Agent','Task'):
                        agents[i.get('subagent_type','general-purpose')]+=1
                    if c['name']=='Bash' and 'gh pr create' in i.get('command',''):
                        m=re.search(r'--title\s+["\']([^"\']+)',i['command'])
                        created.append(m.group(1) if m else i['command'][:80])
    rows.append((min(ts),max(ts),u,sorted(prs),created,dict(agents)))
for r in sorted(rows):
    print(r[0][:16],r[1][:16],r[2][:8],'PRs',r[3]);print('   created:',r[4]);print('   agents:',r[5])
