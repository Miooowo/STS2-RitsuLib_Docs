# 补丁系统

## 创建 Patcher

每个逻辑区域使用一个 patcher。必要 patcher 通过 `ApplyRequiredPatcher` 应用，这样关键失败时 Mod 可以关闭自己。

```csharp
var patcher = RitsuLibFramework.CreatePatcher("MyMod", "combat");
patcher.RegisterPatches<MyCombatPatch>();
RitsuLibFramework.ApplyRequiredPatcher(patcher, DisableMod);
```

某个可选功能即使失败也不应关闭整个 Mod 时，把它放进独立 patcher。

## 编写 Patch 类

实现 `IPatchMethod`，用强类型方式声明目标。

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

目标方法有重载时，使用 `new ModPatchTarget(type, methodName, parameterTypes)`。只有可选兼容目标才使用 `ignoreIfMissing: true`。

## 动态补丁

目标方法需要运行时发现时，使用 dynamic patch。

```csharp
patcher.RegisterDynamicPatch(new DynamicPatchInfo(
    id: "my_mod_dynamic_target",
    originalMethod: resolvedMethod,
    patchType: typeof(MyDynamicPatch),
    isCritical: false,
    description: "Optional runtime target"));

patcher.PatchAll();
```

普通游戏方法优先使用静态 `IPatchMethod` 类，更容易阅读和审查。

## 发布检查

- 每个 patch 都有稳定 `PatchId`。
- 可以安全跳过的兼容 patch 设置 `IsCritical = false`。
- 有重载的目标方法填写 `parameterTypes`。
- 脆弱 transpiler 使用 `HarmonyVerifiedIl` 或测试覆盖。
- 生命周期事件和注册器能覆盖的场景，优先使用它们。
