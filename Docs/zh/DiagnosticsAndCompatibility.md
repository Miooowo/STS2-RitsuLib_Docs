# 诊断与兼容

## 把警告当作发布信号

RitsuLib 会尽量为常见作者错误记录一次清楚的警告：

| 警告区域 | 通常表示 |
| --- | --- |
| 内容注册 | 模型注册太晚、重复注册，或 ID 冲突。 |
| 资源路径 | Profile 指向了不存在的资源。 |
| 本地化 | 游戏表或 I18N 来源缺 key。 |
| 解锁 | 规则引用了无法解析的 epoch 或角色。 |
| 补丁 | 必要目标方法缺失，或 patch 类没有 Harmony 方法。 |
| 音频 | Bank、事件路径、GUID 映射、bus 或散装音频文件无法解析。 |

角色资源警告、必要 patch 失败、模型 ID 冲突都应视为发布阻断问题。

## Debug 兼容模式

RitsuLib 自带的 debug compatibility mode 默认关闭。开启后，RitsuLib 设置页会显示用于开发和兼容测试的回退开关。

它适合调查缺失本地化、无效解锁 epoch、建筑师缺少对话等问题。不要把 debug 回退当作 Mod 的正常发布路径。

## 游戏源码注意点

查看反编译或引用版游戏源码时，注意这些规则：

- 源码版本必须匹配你使用的包分支（`STS2.RitsuLib` 或 `STS2.RitsuLib.Compat.<api-version>`）。
- 写 `ModPatchTarget` 前确认目标方法重载；只要有歧义就填写 `parameterTypes`。
- 部分生命周期 hook 会随 host API 变化。RitsuLib 已经提供桥接事件时，优先使用例如 `CardsFlushedEvent` 这样的事件。
- 行为依赖私有字段或编译器生成状态机时，把它隔离成小兼容 helper，并添加诊断。

## 发布检查清单

- 使用目标游戏 API 分支构建。
- 测试新 run 和读取旧 run。
- 如果使用 `SaveScope.Profile`，测试切换档位。
- 验证随 Mod 发布的语言。
- 从主菜单和暂停菜单打开所有设置页。
- 内容注册后和第一次战斗后检查 RitsuLib 警告日志。
- 可选兼容 patch 需要测试目标功能不存在的情况。
