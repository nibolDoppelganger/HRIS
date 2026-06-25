# Clean State Checklist

Before ending each session, ensure the following are true:

- [ ] Standard startup still works (`cd simdp-frontend ; npm run dev`)
- [ ] Standard verification still runs (`cd simdp-frontend ; npm run build ; npm run preview`)
- [ ] Progress log (`claude-progress.md`) is updated
- [ ] Feature list (`feature_list.json`) reflects actual state (no false `passing` entries)
- [ ] No half-finished work left unrecorded
- [ ] Next session can continue without manual fixes (handoff state is clear in `session-handoff.md`)
