# 术语

## 核心术语

| 术语 | 含义 |
| --- | --- |
| Mod id | Mod 清单中的 id，例如 `MyMod`。RitsuLib 用它生成稳定 ID。 |
| Model | 游戏里的 `AbstractModel` 子类：卡牌、遗物、药水、角色、事件、Act、能力、Orb 等。 |
| Pool | 游戏池模型，例如 `CardPoolModel`、`RelicPoolModel`、`PotionPoolModel`。卡牌、遗物、药水需要注册到池。 |
| Content pack | 由 `RitsuLibFramework.CreateContentPack(modId)` 创建的链式注册批次。推荐优先使用。 |
| Registry | 每个 Mod 独立的注册器，例如 `ModContentRegistry`、`ModKeywordRegistry`、`ModUnlockRegistry`。只有 builder 不合适时才直接使用。 |
| Public entry | RitsuLib 为自有模型生成的稳定 `ModelId.Entry`。大多数模型本地化 key 也以它为 stem。 |
| Owned id | 带 Mod 归属的 ID，例如 `MY_MOD_KEYWORD_BURNING`。优先使用 owned id，避免扁平全局 id 冲突。 |
| Lifecycle event | 通过 `RitsuLibFramework.SubscribeLifecycle<TEvent>(...)` 发布的强类型事件。 |
| Replayable event | 已经发生后仍会立即补发给新订阅者的生命周期事件。 |
| Scope | 持久化位置：`Global`、`Profile`、`RunSidecar` 或 `InMemory`。 |

## 命名规则

RitsuLib 会把公开 stem 规范化为全大写下划线格式。非字母数字分隔符合并成 `_`，驼峰名称会被拆开。

| 输入 | 规范化后 |
| --- | --- |
| `MyMod` | `MY_MOD` |
| `com.example.my-mod` | `COM_EXAMPLE_MY_MOD` |
| `StarterRelic` | `STARTER_RELIC` |

CLR 模型类型名请使用可读 PascalCase。避免 `TESTCARD` 这类全大写名称：未走 RitsuLib 固定 Entry 覆写的原版路径可能会把它拆成
`T_ES_TC_AR_D`。请写 `TestCard`；名称中有缩写时，也优先写 `UrlParser` 而不是 `URLParser`。

默认模型 Entry：

```text
<MODID>_<CATEGORY>_<TYPENAME>
```

关键词、卡牌标签、卡堆和顶栏按钮的 owned id 使用同一规则，中间段固定为 `KEYWORD`、`CARDTAG`、`CARDPILE` 或 `TOPBARBUTTON`。
