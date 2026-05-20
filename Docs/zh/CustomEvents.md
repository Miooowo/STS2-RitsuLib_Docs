# 自定义事件

## 事件模型

普通事件使用 `ModEventTemplate`，Ancient 事件使用 `ModAncientEventTemplate`。

```csharp
public sealed class MyEvent : ModEventTemplate
{
    public override EventAssetProfile AssetProfile => new()
    {
        LayoutScenePath = "res://MyMod/scenes/events/quiet_door.tscn",
        BackgroundScenePath = "res://MyMod/scenes/events/quiet_door_bg.tscn",
    };
}
```

按 Act 注册，或注册为共享事件。注解写法：

```csharp
[RegisterActEvent(typeof(MyAct))]
public sealed class MyEvent : ModEventTemplate
{
}

[RegisterSharedAncient]
public sealed class MyAncient : ModAncientEventTemplate
{
}
```

Content pack 写法：

```csharp
RitsuLibFramework.CreateContentPack("MyMod")
    .ActEvent<MyAct, MyEvent>()
    .SharedEvent<MySharedEvent>()
    .ActAncient<MyAct, MyAncient>()
    .Apply();
```

## 选项 Key

模板提供带命名空间的选项 key：

```csharp
protected override IReadOnlyList<EventOption> GenerateInitialOptions()
{
    return
    [
        new EventOption(this, OpenDoor, InitialOptionKey("OPEN"))
    ];
}
```

自定义页面使用 `ModOptionKey(pageName, optionName)`。发布后尽量保持 page 和 option 名称稳定，因为它们属于本地化契约。

## 遗物选项

授予遗物的选项可以使用模板辅助方法：

```csharp
yield return CreateModRelicOption<MyRelic>(
    onChosen: async () => await GoToPage("REWARD_TAKEN"));
```

在 Ancient 事件里，`CreateModRelicOption<T>()` 默认还会完成 ancient 流程。

## 给已有 Ancient 添加选项

如果只想给已有 ancient 追加选项，而不是替换事件类，使用 `AncientOption<TAncient>(rule)`。

```csharp
RitsuLibFramework.CreateContentPack("MyMod")
    .AncientOption<TheArchitect>(ModAncientOptionRule.Single(ancient =>
        new EventOption("MY_MOD_ARCHITECT_OPTION", async () => await DoSomething())))
    .Apply();
```

多个 Mod 可能添加相似选项时，使用 `ModAncientOptionRule` 的 `Condition`、`Priority` 和 `SkipDuplicateTextKeys`。

## Ancient 对话

`ModAncientEventTemplate` 默认从 `ancients` 本地化表读取对话。只有在对话结构无法用本地化数据表达时，才覆写 `DefineDialogues()`。

普通 Mod Ancient 对话 key 示例：

```json
{
  "MY_MOD_ANCIENT_MIRROR.talk.MY_MOD_CHARACTER_SEER.0-0.ancient": "你带来了一份未来。",
  "MY_MOD_ANCIENT_MIRROR.talk.MY_MOD_CHARACTER_SEER.0-1.char": "那我应该谨慎地使用它。"
}
```

建筑师对话写在 `THE_ARCHITECT.talk.<CHARACTER_ENTRY>.*` 下。
完整 key 规则见 [本地化与关键词](LocalizationAndKeywords.md)。
