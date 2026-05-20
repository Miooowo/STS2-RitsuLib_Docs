# 文档更新流程（本 Fork / Starlight 站点）

本站使用 [`website/`](../website/)（Astro Starlight）部署到 GitHub Pages，**不要**合并上游 [`BAKAOLC/STS2-RitsuLib`](https://github.com/BAKAOLC/STS2-RitsuLib) 仓库中的 `docs/` Valaxy 工程目录。

正文源文件维护在：

- 中文：`Docs/zh/*.md`
- 英文：`Docs/en/*.md`

上游 Valaxy 双语页位于：[docs/pages/guide](https://github.com/BAKAOLC/STS2-RitsuLib/tree/main/docs/pages/guide)。

## 一次性准备

```bash
git remote add upstream https://github.com/BAKAOLC/STS2-RitsuLib.git   # 若尚未添加
git fetch upstream main --depth 1
git checkout docs
```

## 每次同步上游 guide

```bash
git fetch upstream main --depth 1
cd website
npm run update-docs    # import-upstream-guide + sync-docs
npm run build
npm run preview        # 打开 http://127.0.0.1:4321/STS2-RitsuLib/
```

可选指定上游快照：

```bash
UPSTREAM_REF=upstream/main npm run import-upstream-guide
```

## 提交与推送

```bash
git add Docs/ website/
git commit -m "docs: sync guide from upstream main (<说明>)"
git push origin docs
```

合并到 `main` 后也会触发 [Deploy documentation](../.github/workflows/deploy-docs.yml)（路径含 `Docs/**`、`website/**`）。

## 上游新增页面时

1. `import-upstream-guide.mjs` 会通过 `git ls-tree` **自动发现** `docs/pages/guide/*.md`。
2. 若控制台出现 **sidebar 警告**，请在 [`website/astro.config.mjs`](../website/astro.config.mjs) 的 `sidebar` 中增加对应 `slug` 与 `translations.en`。
3. 建议在 [`Docs/README.md`](README.md) 索引表中补充条目。

## 禁止操作

- **不要**为更新文档而 `git merge upstream/main` 进 `docs`（会带入上游整仓与 Valaxy 站点，与当前方案冲突）。
- **不要**将上游 `docs/package.json`、`valaxy.config.ts` 等复制进本仓库。

## CI 说明

GitHub Actions 仅执行 `npm run sync-docs` 与构建；**不会**在 runner 上执行 `import-upstream-guide`。导入结果必须先提交 `Docs/` 再推送。
