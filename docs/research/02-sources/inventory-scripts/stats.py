import json,statistics as st,collections,sys
R=json.load(open('agents.json'))
def bad(r):
    return r['reply_b']<=62 or r['aid'].startswith(('ac2ebedb','ae828e6d'))
def snum(s): return 4 if s=='1-4' else int(s)
pairs=collections.Counter((r['su'],r['ctx_before'],r['ctx_after']) for r in R if not bad(r))
def kind(r):
    t=r['type']
    if t=='general-purpose' and 'Verify' in (r['desc'] or ''): return 'verifier(general-purpose)'
    return t
def summ(xs):
    xs=sorted(xs); return f"n={len(xs)} min={xs[0]} median={st.median(xs)} max={xs[-1]}" if xs else 'n=0'
mode=sys.argv[1]
G=collections.defaultdict(list)
for r in R:
    if bad(r): continue
    era='S19-26 (capped)' if snum(r['sess'])>=19 else 'S1-18 (uncapped)'
    k=kind(r)
    if mode=='reply' and k in('da-review','copilot-surrogate','spec-grill','verifier(general-purpose)'):
        G[(k,era,'reply_b')].append(r['reply_b']); G[(k,era,'landed_b')].append(r['landed_b'])
        G[('ALL reviewers',era,'reply_b')].append(r['reply_b'])
        if r['ctx_before'] and r['ctx_after'] and pairs[(r['su'],r['ctx_before'],r['ctx_after'])]==1:
            G[(k,era,'delta_tokens')].append(r['ctx_after']-r['ctx_before'])
    if mode=='turns':
        G[(k,'all','turns')].append(r['turns'])
        G[(k,era,'turns')].append(r['turns'])
        if r['first_ctx']: G[(k,'all','first_ctx')].append(r['first_ctx'])
        if snum(r['sess'])>=19 and r['first_ctx']: G[(k,'S19-26','first_ctx')].append(r['first_ctx'])
for k in sorted(G): print(k, summ(G[k]))
print('excluded:',[(r['sess'],r['aid'][:8],r['reply_b']) for r in R if bad(r)])
