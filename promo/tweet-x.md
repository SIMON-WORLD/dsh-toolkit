# X/Twitter 英文推文

## 主推（1/4 帖，可加图）

> DeepSeek Harness hit 140k★ in 4 days, but out of the box it's a bare apartment 🏚️
> No @file refs, no vision for text-only models, zero cost visibility, CJK path truncation on Windows.
>
> I mined all 2,764 official discussions → 173 real pain points, and open-sourced the fixable ones:
>
> 🔧 github.com/SIMON-WORLD/dsh-toolkit
>
> #DeepSeekHarness #AI #opensource #devtools

## 补充推 1（特性展示）

> What's inside:
> • dsh-doctor — one-command env check (Node/koffi/port/CJK path/sandbox), the `dsh doctor` everyone asked for (46-comment thread)
> • dsh-at-file — @-reference workspace files
> • dsh-cost-dashboard — token/cost meter (peak-valley pricing awareness)
> • dsh-vision-bridge — image→VLM→text for text-only models
>
> All MIT. 16/16 tests. Verified installable in a real DSH env (dsh web boots with plugin loaded).

## 补充推 2（可信度）

> Not vaporware: every plugin passes
> ✅ 16/16 unit tests (against compiled lib, not mocked src)
> ✅ Real install verification in isolated DSH_HOME (dsh web → :3080 listening with plugin active)
> ✅ CI green + verify-format.mjs in CI
> ✅ PR to awesome-dsh-plugin (#1403) — CI passed
>
> Even reproduced a known npm landmine: dsh-tools@0.0.1-rc.1 pulls unpublished dsh-type-meta (official #410/#2763).

## 补充推 3（贡献邀请）

> DSH says: no external PRs yet, but plugins/docs/patch-backed bug reports are welcome. This repo is all three:
> • docs/ has the full 173-pain-point list + 20 buildable directions
> • CONTRIBUTING.md makes it easy to add tools
>
> Star it, fork it, or just read the pain list — the ecosystem only gets better with people who care. ⭐
