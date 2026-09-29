@AGENTS.md

## Subagents

`.claude/agents/*.md` holds each agent's brief. Its frontmatter (`model`, `effort`) is the authority; this
roster is a copy and goes stale first.

- **`da-review`** (`fable`, `high`): devil's-advocate review of code and config changes.
- **`copilot-surrogate`** (`fable`, `high`): factual-claim reviewer for prose; reads each touched file at HEAD in full.
- **`spec-grill`** (`fable`, `high`): adversarial grill of specs and plans, in discovery and verification rounds.
- **`implementer`** (`sonnet`, `high`): builds one planned item on a branch the coordinator has cut; never pushes.

## Session handoff

- **Hand off on the sooner of:** context at 150k (soft: finish the unit in hand) or 250k (hard), a finished unit or merged PR past 130k, or
  the 5-hour window at 85%. The other triggers, the `get_usage` checkpoints and the handoff prompt are
  in `docs/SESSION-HANDOFF.md`. Always-loaded because its trigger is "context is filling", which no
  trigger phrase can reach.
