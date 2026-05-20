# STS2 RitsuLib — Documentation

**简体中文说明请阅：** [README.zh-CN.md](README.zh-CN.md)

English documentation site for the [STS2 RitsuLib](https://github.com/BAKAOLC/STS2-RitsuLib) modding framework (Slay the Spire 2). This repository contains **only** the docs toolchain and sources—no mod source code.

**Live site:** [https://miooowo.github.io/STS2-RitsuLib_Docs/](https://miooowo.github.io/STS2-RitsuLib_Docs/)  
**This repository:** [https://github.com/Miooowo/STS2-RitsuLib_Docs](https://github.com/Miooowo/STS2-RitsuLib_Docs)  
**Upstream guide (Valaxy, reference):** [BAKAOLC/STS2-RitsuLib `docs/pages/guide`](https://github.com/BAKAOLC/STS2-RitsuLib/tree/main/docs/pages/guide)

## Repository layout

| Path | Purpose |
|------|---------|
| [`Docs/en/`](Docs/en/) | English Markdown sources (PascalCase filenames) |
| [`Docs/zh/`](Docs/zh/) | Chinese Markdown sources |
| [`Docs/README.md`](Docs/README.md) | Topic index (tables) |
| [`Docs/UPDATING.md`](Docs/UPDATING.md) | Maintainer workflow: sync from upstream |
| [`website/`](website/) | [Astro Starlight](https://starlight.astro.build/) site (`base: /STS2-RitsuLib_Docs`) |
| [`.github/workflows/deploy-docs.yml`](.github/workflows/deploy-docs.yml) | Build & deploy to GitHub Pages |

We use **Starlight**, not the upstream Valaxy `docs/` app. Do not copy upstream `docs/package.json`, `valaxy.config.ts`, etc.

## Local development

```bash
cd website
npm ci
npm run dev
```

Open [http://localhost:4321/STS2-RitsuLib_Docs/](http://localhost:4321/STS2-RitsuLib_Docs/) (Chinese at `/`, English at `/en/`).

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

- Pushes to the **`docs`** branch that touch `Docs/**` or `website/**` run **Deploy documentation** and publish to GitHub Pages (`github-pages` environment).
- If deploy is blocked for the `docs` branch, allow that branch under **Settings → Environments → github-pages**, or deploy from your default branch.

## License

Documentation follows the parent project. Framework code and licensing: [BAKAOLC/STS2-RitsuLib](https://github.com/BAKAOLC/STS2-RitsuLib).
