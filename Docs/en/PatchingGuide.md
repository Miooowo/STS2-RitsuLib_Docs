# Patching

## Create A Patcher

Use one patcher per logical area. Apply required patchers through `ApplyRequiredPatcher` so the mod can disable itself on critical failure.

```csharp
var patcher = RitsuLibFramework.CreatePatcher("MyMod", "combat");
patcher.RegisterPatches<MyCombatPatch>();
RitsuLibFramework.ApplyRequiredPatcher(patcher, DisableMod);
```

Use separate patchers when one optional feature can fail without disabling the whole mod.

## Write Patch Classes

Implement `IPatchMethod` for strongly typed target declarations.

```csharp
public sealed class MyCombatPatch : IPatchMethod
{
    public static string PatchId => "my_mod_combat_patch";
    public static string Description => "Adjust combat start behavior";
    public static bool IsCritical => true;

    public static ModPatchTarget[] GetTargets() =>
    [
        new(typeof(CombatRoom), "OnEnter"),
    ];

    public static void Postfix(CombatRoom __instance)
    {
        // Harmony postfix body.
    }
}
```

Use `new ModPatchTarget(type, methodName, parameterTypes)` when overloads need disambiguation. Use `ignoreIfMissing: true` only for optional compatibility targets.

## Dynamic Patches

Use dynamic patches when the target method is discovered at runtime.

```csharp
patcher.RegisterDynamicPatch(new DynamicPatchInfo(
    id: "my_mod_dynamic_target",
    originalMethod: resolvedMethod,
    patchType: typeof(MyDynamicPatch),
    isCritical: false,
    description: "Optional runtime target"));

patcher.PatchAll();
```

For ordinary game methods, static `IPatchMethod` classes are easier to read and review.

## Release Checklist

- Give every patch a stable `PatchId`.
- Set `IsCritical = false` for compatibility patches that can safely be skipped.
- Add `parameterTypes` for overloaded targets.
- Use `HarmonyVerifiedIl` or tests for fragile transpilers.
- Prefer lifecycle events and registries when they cover the use case.
