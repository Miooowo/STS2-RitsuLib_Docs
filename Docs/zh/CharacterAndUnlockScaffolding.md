# 角色与解锁脚手架

## 角色模板

当角色拥有自己的卡池、遗物池和药水池时，使用 `ModCharacterTemplate<TCardPool, TRelicPool, TPotionPool>`。

```csharp
public sealed class MyCharacter
    : ModCharacterTemplate<MyCardPool, MyRelicPool, MyPotionPool>
{
    public override CharacterAssetProfile AssetProfile => new()
    {
        Ui = new() { CharacterSelectIconPath = "res://MyMod/images/character/icon.png" }
    };

    public override bool RequiresEpochAndTimeline => true;
}
```

角色名称和代词写在 `characters.json`。角色和初始内容可以用注解注册：

```csharp
[RegisterCharacter]
public sealed class MyCharacter
    : ModCharacterTemplate<MyCardPool, MyRelicPool, MyPotionPool>
{
}

[RegisterCard(typeof(MyCardPool))]
[RegisterCharacterStarterCard(typeof(MyCharacter), 4, Order = 10)]
public sealed class MyStrike : ModCardTemplate(1, CardType.Attack, CardRarity.Common, TargetType.SingleEnemy)
{
}

[RegisterRelic(typeof(MyRelicPool))]
[RegisterCharacterStarterRelic(typeof(MyCharacter), Order = 0)]
public sealed class MyStarterRelic : ModRelicTemplate
{
}
```

如果初始内容列表集中写更容易审查，也可以使用 content pack：

```csharp
RitsuLibFramework.CreateContentPack("MyMod")
    .Character<MyCharacter>(c => c
        .AddStartingRelic<MyStarterRelic>(1, order: 0)
        .AddStartingCard<MyStrike>(4, order: 10)
        .AddStartingCard<MyDefend>(4, order: 20))
    .Card<MyCardPool, MyStrike>()
    .Card<MyCardPool, MyDefend>()
    .Relic<MyRelicPool, MyStarterRelic>()
    .Apply();
```

优先使用 additive starter registration，不要在新项目里覆写旧的 `StartingDeckTypes`、`StartingRelicTypes` 或 `StartingPotionTypes`。

`Order` 控制每类初始内容列表中的排序。值越小越靠前；相同 order 按注册插入顺序排列。`count` 会在同一个排序位置添加多份副本，适合四张打击、四张防御这类初始牌。初始遗物和初始药水也使用同一规则。

## 可见性与原版进度

当角色不应完全按原版角色处理时，覆写这些属性：

| 属性 | 用途 |
| --- | --- |
| `RequiresEpochAndTimeline` | 不参与原版 epoch / timeline 假设的角色设为 `false`。 |
| `HideFromVanillaCharacterSelect` | 从原版角色选择列表隐藏。 |
| `AllowInVanillaRandomCharacterSelect` | 控制是否能被随机角色选中。 |
| `HideInCardLibraryCompendium` | 隐藏图鉴里的角色卡池筛选。 |
| `CardLibraryCompendiumPlacementRules` | 控制角色卡池筛选的排序或相邻位置。 |

如果角色应从普通 UI 游玩，保留 `RequiresEpochAndTimeline = true`，并注册正确的 story / epoch。

## 解锁规则

用 epoch 模型表示内容门槛，然后通过 content pack 注册规则。

```csharp
public sealed class MyFirstEpoch : ModEpochTemplate
{
    public override string Id => "MY_MOD_FIRST_EPOCH";
}

RitsuLibFramework.CreateContentPack("MyMod")
    .Epoch<MyFirstEpoch>()
    .RequireEpoch<MyRareCard, MyFirstEpoch>()
    .UnlockEpochAfterWinAs<MyCharacter, MyFirstEpoch>()
    .Apply();
```

常用规则：

| 规则 | 含义 |
| --- | --- |
| `.RequireEpoch<TModel, TEpoch>()` | 获得 epoch 前隐藏模型。 |
| `.UnlockEpochAfterRunAs<TCharacter, TEpoch>()` | 使用该角色完成任意 run 后授予。 |
| `.UnlockEpochAfterWinAs<TCharacter, TEpoch>()` | 获胜后授予。 |
| `.UnlockEpochAfterAscensionWin<TCharacter, TEpoch>(level)` | 达到指定进阶等级并获胜后授予。 |
| `.UnlockEpochAfterRunCount<TEpoch>(count, requireVictory)` | 按全局 run 次数授予。 |
| `.UnlockEpochAfterEliteVictories<TCharacter, TEpoch>(count)` | 按精英胜利计数授予。 |
| `.UnlockEpochAfterBossVictories<TCharacter, TEpoch>(count)` | 按 Boss 胜利计数授予。 |

## 相关页面

- [时间线与解锁](TimelineAndUnlocks.md)
- [资源配置与回退](AssetProfilesAndFallbacks.md)
- [生物视觉与动画](CreatureVisualsAndAnimation.md)
