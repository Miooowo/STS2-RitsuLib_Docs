# 运行时 UI 与 Shell 主题

## 设置 Shell 主题

RitsuLib 设置页面使用 shell theme token 控制颜色、字体、间距和控件默认样式。大多数 Mod 直接使用当前主题即可。只有当你的设置 UI 有多个自定义控件，并且需要统一视觉身份时，才添加自定义主题。

主题 JSON 放在 Mod 资源中，并通过 shell theme API 注册。Token 名称应表达用途，不要只描述颜色。

## Toast

短运行时反馈可以使用 toast，不打断玩家操作。

```csharp
RitsuToastService.ShowInfo("设置已保存。", "My Mod");
RitsuToastService.ShowWarning("可选 bank 加载失败。", "My Mod");
RitsuToastService.ShowError("必要初始化失败。", "My Mod");
```

需要自定义位置、图片、持续时间或点击行为时，构建 `RitsuToastRequest`。

## 运行时快捷键

当操作需要在设置页面之外可用时，注册运行时快捷键。

```csharp
var handle = RuntimeHotkeyService.Register(
    "Ctrl+Shift+M",
    callback: ToggleMyOverlay,
    id: "my_mod.toggle_overlay",
    title: "Toggle overlay");
```

在设置页面中展示或编辑快捷键时，使用 `AddKeyBinding`、`AddMultiKeyBinding` 或 `AddRuntimeHotkeySummary`。

## 顶栏按钮

通过 content pack 注册顶栏按钮：

```csharp
RitsuLibFramework.CreateContentPack("MyMod")
    .TopBarButtonOwned("my_panel", new ModTopBarButtonSpec(
        IconPath: "res://MyMod/images/ui/my_panel.png",
        Handler: new MyTopBarButtonHandler()))
    .Apply();
```

Owned button id 会是 `MY_MOD_TOPBARBUTTON_MY_PANEL`，hover 文本从 `static_hover_tips` 读取。

## 自定义卡堆

自定义卡堆适合额外的手牌区、弃牌区或类似集合。

```csharp
RitsuLibFramework.CreateContentPack("MyMod")
    .CardPileOwned("archive", new ModCardPileSpec
    {
        DisplayName = "Archive"
    })
    .Apply();
```

使用稳定 local stem。卡堆 ID 会影响 UI 文本、类似保存的状态和玩家预期。
