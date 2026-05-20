# Card Dynamic Variables

## Add A Variable

Use `ModCardVars` when a card needs values in its description that can change at runtime.

```csharp
using MegaCrit.Sts2.Core.Localization.DynamicVars;
using STS2RitsuLib.Cards.DynamicVars;

public sealed class MyStrike : ModCardTemplate(1, CardType.Attack, CardRarity.Common, TargetType.SingleEnemy)
{
    public override DynamicVarSet DynamicVars => new()
    {
        ModCardVars.Int("damage", Damage),
        ModCardVars.Computed("block", 3, card => card?.Upgraded == true ? 5 : 3),
    };
}
```

Then use those variable names in `cards.json`, for example `Deal {damage} damage. Gain {block} block.`

Use a normal `IntVar` for values that already live on the card. Use `ComputedDynamicVar` when the display value depends on target, upgrade state, or preview mode.

## Add A Tooltip

Attach hover tips directly to a dynamic variable.

```csharp
ModCardVars.Int("heat", Heat)
    .WithSharedTooltip("MY_MOD_HEAT", "res://MyMod/images/ui/heat.png");
```

This reads `static_hover_tips` keys:

```json
{
  "MY_MOD_HEAT.title": "Heat",
  "MY_MOD_HEAT.description": "Some cards care about the current Heat value."
}
```

For custom layouts, pass a factory to `.WithTooltip(var => new HoverTip(...))`.

## Read Values Safely

Use extension helpers when a card or effect reads dynamic variables from another card:

```csharp
var amount = card.DynamicVars.GetIntOrDefault("damage");
var hasHeat = card.DynamicVars.HasPositiveValue("heat");
```

The helpers return defaults when the key is missing, which is usually better than assuming every card has your variable.

## Preview Logic

`ComputedDynamicVar` accepts a preview factory:

```csharp
ModCardVars.Computed(
    "damage",
    Damage,
    (card, target) => ResolveDamage(card, target),
    (card, mode, target, runGlobalHooks) => ResolvePreviewDamage(card, mode, target));
```

Use preview logic when card preview, target preview, or upgrade preview should show a value different from the current live card value.
