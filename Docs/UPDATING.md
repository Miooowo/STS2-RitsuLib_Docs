# Updating documentation

This fork publishes docs with [`website/`](../website/) (Astro Starlight) to GitHub Pages. **Do not** merge upstream [`BAKAOLC/STS2-RitsuLib`](https://github.com/BAKAOLC/STS2-RitsuLib)'s Valaxy `docs/` tree into this branch.

Sources:

- English: `Docs/en/*.md`
- Chinese: `Docs/zh/*.md`

Upstream bilingual pages: [docs/pages/guide](https://github.com/BAKAOLC/STS2-RitsuLib/tree/main/docs/pages/guide).

## One-time setup

```bash
git remote add upstream https://github.com/BAKAOLC/STS2-RitsuLib.git   # if needed
git fetch upstream main --depth 1
git checkout docs
```

## Each sync

```bash
git fetch upstream main --depth 1
cd website
npm run update-docs    # import-upstream-guide + sync-docs
npm run build
npm run preview        # http://127.0.0.1:4321/STS2-RitsuLib/
```

Optional pin:

```bash
UPSTREAM_REF=upstream/main npm run import-upstream-guide
```

## Commit and publish

```bash
git add Docs/ website/
git commit -m "docs: sync guide from upstream main (<summary>)"
git push origin docs
```

Merge into **`main`** (or apply the same paths on `main`) to trigger [Deploy documentation](../.github/workflows/deploy-docs.yml).

## New upstream pages

1. `import-upstream-guide.mjs` auto-discovers `docs/pages/guide/*.md` via `git ls-tree`.
2. If the script warns about **missing sidebar** entries, add `slug` and `translations.en` in [`website/astro.config.mjs`](../website/astro.config.mjs).
3. Update [`Docs/README.md`](README.md) index tables when useful.

## Do not

- `git merge upstream/main` on this branch to “refresh docs” (pulls the whole mod repo and Valaxy site).
- Copy upstream `docs/package.json`, `valaxy.config.ts`, lockfiles, etc.

## CI

GitHub Actions runs `npm run sync-docs` and `npm run build` only. Run `import-upstream-guide` locally and commit `Docs/` before pushing.
