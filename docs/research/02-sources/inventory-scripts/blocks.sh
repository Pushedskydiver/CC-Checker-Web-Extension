# usage: blocks.sh <commit>; byte counts of PROGRESS.md blocks at that commit (line ranges found by heading).
R=/Users/alexclapperton/Desktop/alex/colour-contrast-checker/CC-Checker-Web-Extension
git -C $R show "$1":PROGRESS.md > /tmp/claude-501-P.$$ 2>/dev/null || exit 1
F=/tmp/claude-501-P.$$
nw=$(grep -n '^## Next workstreams' $F | cut -d: -f1)
s1=$(grep -n '^## Session [0-9]' $F | head -1 | cut -d: -f1)
s2=$(grep -n '^## Session [0-9]' $F | sed -n 2p | cut -d: -f1)
ld=$(grep -n '^## Next session loading instructions' $F | cut -d: -f1)
ar=$(grep -n '^## Session archive' $F | cut -d: -f1)
up1=$(grep -n '^Updated ' $F | head -1 | cut -d: -f1)
upend=$(awk -v s=$up1 'NR>s && /^1\. \*\*/{print NR; exit}' $F)
tot=$(wc -l < $F)
b(){ sed -n "$1,$2p" $F | wc -c | tr -d ' '; }
echo "commit $1: whole $(wc -c < $F | tr -d ' ') B"
echo "next-workstreams block L$nw-$((s1-1)): $(b $nw $((s1-1))) B"
echo "  Updated stack L$up1-$((upend-1)): $(b $up1 $((upend-1))) B ($(grep -c '^Updated ' $F) paragraphs)"
echo "newest entry L$s1-$((s2-1)): $(b $s1 $((s2-1))) B ($(sed -n ${s1}p $F | cut -c1-40))"
echo "entries band L$s1-$((ld-1)): $(b $s1 $((ld-1))) B ($(grep -c '^## Session [0-9]' $F) entries)"
echo "loading block L$ld-$((ar-1)): $(b $ld $((ar-1))) B"
echo "archive pointer L$ar-$tot: $(b $ar $tot) B"
rm -f $F
