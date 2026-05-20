# 框架组织方式

## 选择入口

大多数 Mod 只需要五个入口。

| 需求 | 使用 |
| --- | --- |
| 注册模型、关键词、Epoch、卡堆和顶栏按钮 | `RitsuLibFramework.CreateContentPack(modId)` |
| Patch 游戏方法 | `RitsuLibFramework.CreatePatcher(modId, patcherName)` |
| 响应游戏时机 | `RitsuLibFramework.SubscribeLifecycle<TEvent>(...)` |
| 存储 JSON 数据 | `RitsuLibFramework.BeginModDataRegistration(modId)` 与 `GetDataStore(modId)` |
| 添加设置界面 | `RitsuLibFramework.RegisterModSettings(modId, configure)` |

只有在需要条件注册、数组清单式注册，或要把集成代码复用到多个 Mod 时，才直接使用底层注册器。

## 用户 API 层级

RitsuLib 的公开 API 按 Mod 作者正在做的事情划分：

- `Scaffolding.Content` 提供游戏内容模板和 builder 方法。
- `Content`、`Keywords`、`CardTags`、`CardPiles`、`Timeline`、`Unlocks`、`TopBar` 保存注册器。
- `Data` 和 `Utils.Persistence` 处理 Mod 数据。
- `Settings.ModSettings` 与 `Settings.ModSettingsUi` 构建玩家可见的设置页面。
- `Patching` 封装 Harmony 注册和诊断。
- `Audio`、`RuntimeInput`、`Ui` 提供运行时辅助能力。

## 推荐阅读顺序

1. [快速入门](GettingStarted.md)
2. [内容编写](ContentAuthoringToolkit.md)
3. 选择一个正在使用的专题：角色、设置、持久化、音频或补丁
4. 发布前阅读 [诊断与兼容](DiagnosticsAndCompatibility.md)
