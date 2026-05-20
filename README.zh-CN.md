# STS2 RitsuLib — 文档

[Slay the Spire 2](https://github.com/BAKAOLC/STS2-RitsuLib) Mod 开发框架 [RitsuLib](https://github.com/BAKAOLC/STS2-RitsuLib) 的文档站点。本仓库**仅**包含文档工具链与源文件，不含 Mod 源码。

**在线站点：** [https://miooowo.github.io/STS2-RitsuLib_Docs/](https://miooowo.github.io/STS2-RitsuLib_Docs/)  
**本仓库：** [https://github.com/Miooowo/STS2-RitsuLib_Docs](https://github.com/Miooowo/STS2-RitsuLib_Docs)  
**上游 guide（Valaxy，参考）：** [BAKAOLC/STS2-RitsuLib `docs/pages/guide`](https://github.com/BAKAOLC/STS2-RitsuLib/tree/main/docs/pages/guide)

## 仓库结构

| 路径 | 说明 |
|------|------|
| [`Docs/en/`](Docs/en/) | 英文 Markdown 源文件（PascalCase 文件名） |
| [`Docs/zh/`](Docs/zh/) | 中文 Markdown 源文件 |
| [`Docs/README.md`](Docs/README.md) | 主题索引（表格） |
| [`Docs/UPDATING.md`](Docs/UPDATING.md) | 维护者：从上游同步的流程 |
| [`website/`](website/) | [Astro Starlight](https://starlight.astro.build/) 站点（`base: /STS2-RitsuLib_Docs`） |
| [`.github/workflows/deploy-docs.yml`](.github/workflows/deploy-docs.yml) | 构建并部署到 GitHub Pages |

本站使用 **Starlight**，不是上游 Valaxy 的 `docs/` 应用。请勿复制上游的 `docs/package.json`、`valaxy.config.ts` 等文件。

## 本地开发

```bash
cd website
npm ci
npm run dev
```

浏览器打开 [http://localhost:4321/STS2-RitsuLib_Docs/](http://localhost:4321/STS2-RitsuLib_Docs/)（中文在 `/`，英文在 `/en/`）。

生产构建：

```bash
cd website
npm run build
npm run preview
```

## 从上游同步

一次性准备：

```bash
git remote add upstream https://github.com/BAKAOLC/STS2-RitsuLib.git   # 若尚未添加
git fetch upstream main --depth 1
```

每次更新：

```bash
git fetch upstream main --depth 1
cd website
npm run update-docs   # import-upstream-guide + sync-docs
npm run build
```

详见 [`Docs/UPDATING.md`](Docs/UPDATING.md)（侧边栏检查、提交注意事项，以及**不要**整仓 merge `upstream/main`）。

## 部署

- 向本仓库 **`docs`** 分支推送且变更 `Docs/**` 或 `website/**` 时，会触发 **Deploy documentation** 工作流并发布到 GitHub Pages（环境：`github-pages`）。
- 若 `docs` 分支的 deploy 因环境保护被拒绝，请在仓库 **Settings → Environments → github-pages** 中允许 `docs` 分支，或改在默认分支上部署。

## 许可

文档内容遵循上游项目约定；框架代码与许可见 [BAKAOLC/STS2-RitsuLib](https://github.com/BAKAOLC/STS2-RitsuLib)。

**English:** [README.md](README.md)
