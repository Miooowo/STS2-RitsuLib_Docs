# STS2 RitsuLib — Documentation

English documentation site for the [STS2 RitsuLib](https://github.com/BAKAOLC/STS2-RitsuLib) modding framework (Slay the Spire 2). This branch contains **only** the docs toolchain and sources—no mod source code.

**Live site:** [https://miooowo.github.io/STS2-RitsuLib/](https://miooowo.github.io/STS2-RitsuLib/)  
**Upstream guide (Valaxy, reference):** [BAKAOLC/STS2-RitsuLib `docs/pages/guide`](https://github.com/BAKAOLC/STS2-RitsuLib/tree/main/docs/pages/guide)

## Repository layout

| Path | Purpose |
|------|---------|
| [`Docs/en/`](Docs/en/) | English Markdown sources (PascalCase filenames) |
| [`Docs/zh/`](Docs/zh/) | Chinese Markdown sources |
| [`Docs/README.md`](Docs/README.md) | Topic index (tables) |
| [`Docs/UPDATING.md`](Docs/UPDATING.md) | Maintainer workflow: sync from upstream |
| [`website/`](website/) | [Astro Starlight](https://starlight.astro.build/) site (`base: /STS2-RitsuLib`) |
| [`.github/workflows/deploy-docs.yml`](.github/workflows/deploy-docs.yml) | Build & deploy to GitHub Pages |

We use **Starlight**, not the upstream Valaxy `docs/` app. Do not copy upstream `docs/package.json`, `valaxy.config.ts`, etc.

## Local development

```bash
cd website
npm ci
npm run dev
```

Open [http://localhost:4321/STS2-RitsuLib/](http://localhost:4321/STS2-RitsuLib/) (Chinese at `/`, English at `/en/`).

Production build:

```bash
cd website
npm run build
npm run preview
```

## Sync from upstream

One-time:

```bash
git remote add upstream https://github.com/BAKAOLC/STS2-RitsuLib.git   # if needed
git fetch upstream main --depth 1
```

Each update:

```bash
git fetch upstream main --depth 1
cd website
npm run update-docs   # import-upstream-guide + sync-docs
npm run build
```

See [`Docs/UPDATING.md`](Docs/UPDATING.md) for sidebar checks, commits, and what **not** to do (e.g. merging all of `upstream/main` into this branch).

## Deployment

- Pushes to **`main`** that touch `Docs/**` or `website/**` run **Deploy documentation** and publish via GitHub Pages (environment: `github-pages`).
- The **`docs`** branch is the documentation-only line; merge or cherry-pick doc changes into **`main`** to update the public site.

## License

Documentation follows the parent project. Framework code and licensing: [BAKAOLC/STS2-RitsuLib](https://github.com/BAKAOLC/STS2-RitsuLib).
