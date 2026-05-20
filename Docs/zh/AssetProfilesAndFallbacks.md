# 资源配置与回退

## 优先使用 Profile

模板暴露 `AssetProfile` 时，把路径写在 profile 里，不要直接 patch UI 节点。

```csharp
public sealed class MyCard : ModCardTemplate(1, CardType.Attack, CardRarity.Common, TargetType.SingleEnemy)
{
    public override CardAssetProfile AssetProfile => new()
    {
        PortraitPath = "res://MyMod/images/cards/my_card.png",
        EnergyIconPath = "res://MyMod/images/ui/energy_orange.png",
        FrameMaterialPath = "res://MyMod/materials/card_frame_orange.tres",
    };
}
```

RitsuLib 只读取非空字段。没有填写的字段会保留游戏原值或模板回退值。

## 支持的 Profile

| 内容 | Profile |
| --- | --- |
| 卡牌 | `CardAssetProfile` |
| 遗物 | `RelicAssetProfile` |
| 能力 | `PowerAssetProfile` |
| Orb | `OrbAssetProfile` |
| 药水 | `PotionAssetProfile` |
| Affliction | `AfflictionAssetProfile` |
| Enchantment | `EnchantmentAssetProfile` |
| Act | `ActAssetProfile` |
| Monster | `MonsterAssetProfile` |
| Encounter | `EncounterAssetProfile` |
| 事件 / Ancient 事件布局 | `EventAssetProfile` |
| Ancient 地图 / 历史记录表现 | `AncientEventPresentationAssetProfile` |
| Rest site 选项 | `RestSiteOptionAssetProfile` |
| Epoch 头像 | `EpochAssetProfile` |
| 角色 | `CharacterAssetProfile` |

只有在明确要借用原版路径约定时才使用 `ContentAssetProfiles.*(...)`。Mod 自己的美术资源直接写 `res://MyMod/...` 更容易检查。

## 角色 Profile

角色资源按用途分组：

```csharp
public override CharacterAssetProfile AssetProfile => new()
{
    Scenes = new()
    {
        VisualsPath = "res://MyMod/scenes/characters/my_character_visuals.tscn",
        EnergyCounterPath = "res://MyMod/scenes/ui/my_energy_counter.tscn",
    },
    Ui = new()
    {
        CharacterSelectIconPath = "res://MyMod/images/character/select_icon.png",
        MapMarkerPath = "res://MyMod/images/character/map_marker.png",
    },
    Audio = new()
    {
        AttackSfx = "event:/MyMod/character_attack",
    },
};
```

`PlaceholderCharacterId` 可让不完整 profile 从原版角色借缺失字段。它适合开发期搭建，发布前应替换重要可见资源。

## 缺失路径

发布前检查资源路径。路径缺失时，RitsuLib 会记录警告，并在存在回退值时继续使用回退。角色视觉资源不像卡牌或遗物那样总有安全原版回退，因此角色路径警告应视为发布阻断问题。
