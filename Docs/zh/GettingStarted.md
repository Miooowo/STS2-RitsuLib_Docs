# 快速入门

## 安装

在 Mod 项目里引用包：

```xml
<PackageReference Include="STS2.RitsuLib" />
```

在 `mod_manifest.json` 声明运行时依赖。游戏 API 0.105.x 及之后使用对象写法：

```json
{
  "dependencies": [
    { "id": "STS2-RitsuLib" }
  ]
}
```

旧游戏 API 分支使用旧的字符串写法；旧版 manifest 解析器可能无法解析 dependency 对象，甚至直接报错：

```json
{
  "dependencies": [
    "STS2-RitsuLib"
  ]
}
```

如果项目没有使用 Central Package Management，请通过包管理器或 IDE 选择当前包版本。只有在 Mod 面向旧版《杀戮尖塔 2》API 分支时，才使用
`STS2.RitsuLib.Compat.<api-version>`。

## 初始化

在 Mod 初始化入口注册当前程序集，RitsuLib 才能发现 CLR 注解注册。

```csharp
using System.Reflection;
using MegaCrit.Sts2.Core.Logging;
using MegaCrit.Sts2.Core.Modding;
using STS2RitsuLib;
using STS2RitsuLib.Interop;
using STS2RitsuLib.Patching.Core;

[ModInitializer(nameof(Initialize))]
public static class MyModEntry
{
    public const string ModId = "MyMod";
    public static Logger Logger { get; private set; } = null!;

    public static void Initialize()
    {
        var assembly = Assembly.GetExecutingAssembly();

        Logger = RitsuLibFramework.CreateLogger(ModId);
        ModTypeDiscoveryHub.RegisterModAssembly(ModId, assembly);
        RitsuLibFramework.EnsureGodotScriptsRegistered(assembly, Logger);

        var patcher = RitsuLibFramework.CreatePatcher(ModId, "main");
        patcher.RegisterPatches<MyModPatches>();
        RitsuLibFramework.ApplyRequiredPatcher(patcher, DisableMod);
    }

    private static void DisableMod()
    {
        // 必要补丁无法应用时，在这里关闭你自己的 Mod。
    }
}
```

只有 Mod 里有挂在 `.tscn` 场景上的 C# 脚本时，才需要 `EnsureGodotScriptsRegistered(...)`。纯模型或纯补丁 Mod 可以省略。

## 注册内容

大多数内容可以把注册注解写在模型类上。注册点会贴近真正的内容定义，更容易维护。

```csharp
using Godot;
using MegaCrit.Sts2.Core.Entities.Cards;
using MegaCrit.Sts2.Core.Models;
using STS2RitsuLib.Interop.AutoRegistration;
using STS2RitsuLib.Scaffolding.Content;

public sealed class MyCardPool : TypeListCardPoolModel
{
    public override string Title => "My Cards";
    public override string EnergyColorName => "orange";
    public override string CardFrameMaterialPath => "card_frame_orange";
    public override Color DeckEntryCardColor => new("d58b2f");
    public override bool IsColorless => false;
}

[RegisterCard(typeof(MyCardPool))]
public sealed class MyStrike
    : ModCardTemplate(1, CardType.Attack, CardRarity.Common, TargetType.SingleEnemy)
{
    public override void Use(ICombatContext ctx, ICreatureState user, ICreatureState? target)
    {
        ctx.DealDamage(user, target, Damage);
    }
}
```

显示文本写在对应本地化表里：

```json
{
  "MY_MOD_CARD_MY_STRIKE.title": "精准打击",
  "MY_MOD_CARD_MY_STRIKE.description": "造成 {Damage} 点伤害。"
}
```

如果一批注册集中写更容易审查，也可以使用 content pack：

```csharp
RitsuLibFramework.CreateContentPack("MyMod")
    .Card<MyCardPool, MyStrike>()
    .Relic<MyRelicPool, MyStarterRelic>()
    .Apply();
```

## 继续阅读

- 注册 API：[内容编写](ContentAuthoringToolkit.md)
- 本地化键：[本地化与关键词](LocalizationAndKeywords.md)
- 角色：[角色与解锁脚手架](CharacterAndUnlockScaffolding.md)
- 存档：[持久化](PersistenceGuide.md)
- 设置：[Mod 设置](ModSettings.md)
