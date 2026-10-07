# Row B: per main session, PRs opened (gh pr create titles), archive/handoff ones, and copilot-surrogate dispatches (main-thread Agent tool_use with subagent_type copilot-surrogate).
import json,glob,os,re
P=os.path.expanduser('~/.claude/projects/-Users-alexclapperton-Desktop-alex-colour-contrast-checker-CC-Checker-Web-Extension')
SESS={'2d76863c':'1-4','7c8da1ea':'5','2359a1d8':'6','b993b5b2':'7','3704c181':'8','2817dc88':'9','36b23352':'10','d95d2d49':'11','d9ee3c46':'12','23cd60eb':'13','451bf13c':'14','baadc845':'15','da7ca3eb':'16','8a9f262b':'17','458fbbbc':'18','f460fe14':'19','e336eae4':'20','b3a779e5':'21','78c45389':'22','1b2340c7':'23','08d27539':'24','92ebd181':'25','d2e18d80':'26'}
order=list(SESS)
tot=[0,0,0,0,0]
print('| Session | transcript | PRs opened | archive PRs | handoff PRs | copilot-surrogate dispatches | of which on archive/handoff |')
print('|---|---|---|---|---|---|---|')
for su in order:
    f=glob.glob(P+'/'+su+'*.jsonl')[0]
    titles=[];cs=0;csah=0
    for l in open(f):
        d=json.loads(l)
        if d.get('type')!='assistant': continue
        for c in d['message'].get('content',[]):
            if c.get('type')!='tool_use': continue
            i=c['input']
            if c['name']=='Bash' and 'gh pr create' in i.get('command',''):
                m=re.search(r'--title\s+"((?:[^"\\]|\\.)*)"',i['command']) or re.search(r"--title\s+'([^']*)'",i['command'])
                titles.append(m.group(1) if m else '?')
            if c['name'] in('Agent','Task') and i.get('subagent_type')=='copilot-surrogate':
                cs+=1
                if re.search(r'archive|handoff|close|both folds|hand-off',i.get('description',''),re.I): csah+=1
                print('   ',SESS[su],i.get('description'))
    ar=sum(1 for t in titles if re.search(r'Archive Session',t))
    ho=sum(1 for t in titles if re.search(r'Close Session|Close out Session|Hand off the|hand off to|resume at|Session \d+ handoff',t))
    print(f"| {SESS[su]} | {su} | {len(titles)} | {ar} | {ho} | {cs} | {csah} |")
    if SESS[su] not in('1-4',) and int(SESS[su])>=14:
        for k,v in enumerate((len(titles),ar,ho,cs,csah)): tot[k]+=v
print('S14-26 totals (opened, archive, handoff, surrogate, surrogate-on-archive/handoff):',tot)
