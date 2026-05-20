# 内容编写

## 选择注册风格

RitsuLib 提供两种常规注册风格，它们是平级入口：

| 风格 | 适用场景 |
| --- | --- |
| CLR 注解 | Mod 自己拥有的内容类。注册点贴近模型类。 |
| Content pack | 生成内容、条件注册、占位内容，或希望在初始化入口集中审查的一批注册。 |

注解注册需要先注册 Mod 程序集：

```csharp
ModTypeDiscoveryHub.RegisterModAssembly("MyMod", Assembly.GetExecutingAssembly());
```

如果注解类位于游戏无法映射到你的 manifest id 的辅助程序集，可以给类加 `[RitsuLibOwnedBy("MyMod")]`，或为该程序集调用
`ModTypeDiscoveryHub.RegisterModAssembly(...)`。

## 注解式注册

把注解放在具体模型类型上。抽象类会被跳过。

```csharp
[RegisterCard(typeof(MyCardPool))]
public sealed class MyStrike
    : ModCardTemplate(1, CardType.Attack, CardRarity.Common, TargetType.SingleEnemy)
{
}

[RegisterRelic(typeof(MyRelicPool))]
public sealed class MyStarterRelic : ModRelicTemplate
{
}

[RegisterCharacter]
public sealed class MyCharacter
    : ModCharacterTemplate<MyCardPool, MyRelicPool, MyPotionPool>
{
}
```

带池的模型注解支持稳定 Entry 覆写：

```csharp
[RegisterCard(typeof(MyCardPool), StableEntryStem = "my_strike")]
public sealed class RenamedStrike : ModCardTemplate(1, CardType.Attack, CardRarity.Common, TargetType.SingleEnemy)
{
}
```

`FullPublicEntry` 只用于兼容已经发布过的完整 Entry。不要同时设置 `StableEntryStem` 和 `FullPublicEntry`。

常用内容注解：

| 注解 | 注册内容 |
| --- | --- |
| `RegisterCard(typeof(pool))` | 卡牌进入卡池 |
| `RegisterRelic(typeof(pool))` | 遗物进入遗物池 |
| `RegisterPotion(typeof(pool))` | 药水进入药水池 |
| `RegisterCharacter` | 角色模型 |
| `RegisterPower`, `RegisterOrb` | 战斗模型 |
| `RegisterAct`, `RegisterMonster`, `RegisterGlobalEncounter` | Act、怪物、全局遭遇 |
| `RegisterActEncounter(typeof(act))` | 指定 Act 的遭遇 |
| `RegisterSharedEvent`, `RegisterActEvent(typeof(act))` | 事件 |
| `RegisterSharedAncient`, `RegisterActAncient(typeof(act))` | Ancient 事件 |
| `RegisterAchievement`, `RegisterEnchantment`, `RegisterAffliction` | 元数据或卡牌状态模型 |
| `RegisterGoodModifier`, `RegisterBadModifier` | Daily modifier |
| `RegisterSharedCardPool`, `RegisterSharedRelicPool`, `RegisterSharedPotionPool` | 共享池 |

所有自动注册注解都有 `Order`。同一注册阶段内，值越小越早执行。对于初始卡牌、初始遗物和初始药水，同一个 `Order` 也会写入 starter 条目；最终 starter 列表按
`Order` 排序，再按注册顺序排列。

Starter 示例：

```csharp
[RegisterCard(typeof(MyCardPool))]
[RegisterCharacterStarterCard(typeof(MyCharacter), 4, Order = 10)]
public sealed class MyStrike : ModCardTemplate(1, CardType.Attack, CardRarity.Common, TargetType.SingleEnemy)
{
}
```

抽象基类上的注册注解只有设置 `Inherit = true` 才会传给具体派生类。抽象基类本身不会被注册；每个具体派生类会获得继承来的注册，除非它声明了等价的直接注解。

```csharp
[RegisterCard(typeof(MyCardPool), Inherit = true)]
public abstract class MySkillCardBase
    : ModCardTemplate(1, CardType.Skill, CardRarity.Common, TargetType.Self)
{
}

public sealed class MyBlock : MySkillCardBase
{
}
```

不要在继承型基类注解上设置 `StableEntryStem` 或 `FullPublicEntry`，除非你真的希望每个派生类型共享同一个公开 Entry。这几乎总是错误的。稳定 Entry 覆写应写在具体类上。

## Content Pack

当集中批次比散落注解更易读时，使用 content pack。

```csharp
RitsuLibFramework.CreateContentPack("MyMod")
    .Card<MyCardPool, MyStrike>()
    .Relic<MyRelicPool, MyStarterRelic>()
    .Potion<MyPotionPool, MyPotion>()
    .Power<MyPower>()
    .ActEvent<MyAct, MyEvent>()
    .CardKeywordOwnedByLocNamespace("bleeding")
    .Apply();
```

重要 pack 方法：

| 区域 | 方法 |
| --- | --- |
| 池内容 | `.Card<TPool,TCard>()`、`.Relic<TPool,TRelic>()`、`.Potion<TPool,TPotion>()` |
| 稳定 Entry | 接收 `ModelPublicEntryOptions.FromStem(...)` 或 `FromFullPublicEntry(...)` 的重载 |
| 占位内容 | `.PlaceholderCard<TPool>(stem)`、`.PlaceholderRelic<TPool>(stem)`、`.PlaceholderPotion<TPool>(stem)` |
| 角色 | `.Character<T>()`、`.Character<T>(entry => ...)`、`.CharacterStarterCard<TCharacter,TCard>()`、初始遗物 / 药水辅助方法 |
| 世界内容 | `.Act<T>()`、`.Monster<T>()`、`.ActEncounter<TAct,TEncounter>()`、`.SharedEvent<T>()`、`.ActEvent<TAct,TEvent>()` |
| Ancient | `.SharedAncient<T>()`、`.ActAncient<TAct,TAncient>()`、`.AncientOption<TAncient>(rule)` |
| 关键词与 ID | `.CardKeywordOwnedByLocNamespace(...)`、`.KeywordOwned(...)`、`.CardTagOwned(...)` |
| UI | `.CardPileOwned(...)`、`.TopBarButtonOwned(...)` |
| 时间线与解锁 | `.Story<T>()`、`.Epoch<T>()`、`.StoryEpoch<TStory,TEpoch>()`、`.RequireEpoch<TModel,TEpoch>()`、解锁辅助方法 |
| 批量输入 | `.ContentManifest(...)`、`.KeywordManifest(...)`、`.PackManifest(...)`、`.Manifest(...)` |
| 自定义逻辑 | `.Custom(ctx => ...)` |

不要让同一个模型同时由注解和 content pack 注册，除非你明确接受重复注册被跳过。每类内容最好有一个清晰的来源。

## 模型模板

模板是可选基类，用来提供 RitsuLib 约定和钩子：

| 模型 | 模板 |
| --- | --- |
| 卡牌 | `ModCardTemplate` |
| 遗物 | `ModRelicTemplate` |
| 药水 | `ModPotionTemplate` |
| 能力 | `ModPowerTemplate` |
| 角色 | `ModCharacterTemplate<TCardPool, TRelicPool, TPotionPool>` |
| 事件 | `ModEventTemplate` |
| Ancient 事件 | `ModAncientEventTemplate` |
| Encounter / Monster / Act | `ModEncounterTemplate`、`ModMonsterTemplate`、`ModActTemplate` |
| Story / Epoch | `ModStoryTemplate`、`ModEpochTemplate` |

大多数显示文本仍然应写在本地化 JSON 里。游戏基类已经从 `LocString` 表读取文本时，不要在模型上编造不存在的 `Title` 或 `Description` 覆写。

## Entry ID

RitsuLib 自有的池内容会得到固定公开 Entry：

```text
<MODID>_<CATEGORY>_<TYPENAME>
```

`MyMod` 下的卡牌 `MyStrike` 会变成：

```text
MY_MOD_CARD_MY_STRIKE
```

Entry 会用于存档、模型 ID、本地化 key、资源默认路径、解锁规则和跨 Mod 引用。发布后应视为稳定 ID。

类型改名但已发布 Entry 必须保持不变时，使用 `StableEntryStem` / `ModelPublicEntryOptions.FromStem(...)`：

```csharp
[RegisterCard(typeof(MyCardPool), StableEntryStem = "my_strike")]
public sealed class RenamedStrike : ModCardTemplate(1, CardType.Attack, CardRarity.Common, TargetType.SingleEnemy)
{
}
```

避免使用 `TESTCARD` 这类全大写 CLR 类型名。游戏原版 Entry 解析会在某些情形下错误拆分这种名称；当前 0.105.x 行为里，`TESTCARD` 可能变成
`T_ES_TC_AR_D`。请写 `TestCard`；名称中有缩写时，也优先写 `UrlParser` 而不是 `URLParser`。
