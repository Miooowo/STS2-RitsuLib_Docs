# Mod 设置

## 注册页面

设置页面应在持久化数据注册之后，从 Mod 初始化入口注册。

```csharp
RitsuLibFramework.RegisterModSettings("MyMod", page => page
    .WithTitle(ModSettingsText.Literal("My Mod"))
    .WithModDisplayName(ModSettingsText.Literal("My Mod"))
    .AddSection("general", section => section
        .WithTitle(ModSettingsText.Literal("通用"))
        .AddToggle(
            "enabled",
            ModSettingsText.Literal("启用"),
            new ModSettingsValueBinding<MySettings, bool>(
                "MyMod",
                "settings",
                SaveScope.Global,
                s => s.Enabled,
                (s, value) => s.Enabled = value))
        .AddIntSlider(
            "volume",
            ModSettingsText.Literal("音量"),
            new ModSettingsValueBinding<MySettings, int>(
                "MyMod",
                "settings",
                SaveScope.Global,
                s => s.Volume,
                (s, value) => s.Volume = value),
            minValue: 0,
            maxValue: 100)));
```

固定文本使用 `ModSettingsText.Literal(...)`。需要本地化时，使用 `ModSettingsText.I18N(...)` 或 `ModSettingsText.LocString(...)`。

## 控件

| 控件 | Builder 方法 |
| --- | --- |
| 开关 | `AddToggle` |
| 整数滑条 | `AddIntSlider` |
| 浮点滑条 | `AddSlider` |
| 选项 / enum | `AddChoice`、`AddEnumChoice` |
| 颜色 | `AddColor` |
| 单行文本 | `AddString` |
| 多行文本 | `AddMultilineString` |
| 按键绑定 | `AddKeyBinding`、`AddMultiKeyBinding` |
| 按钮 | `AddButton` |
| 可编辑列表 | `AddList` |
| 只读内容 | `AddHeader`、`AddParagraph`、`AddInfoCard`、`AddImage`、`AddRuntimeHotkeySummary` |
| 嵌套页面 | `AddSubpage` |
| 自定义 Godot 控件 | `AddCustom` |

每个交互控件都应有稳定 entry id。发布后改 id 会破坏剪贴板和 UI 元数据预期。

## 绑定

保存在 `ModDataStore` 中的字段使用 `ModSettingsValueBinding<TModel,TValue>`。临时 UI 使用 `InMemoryModSettingsValueBinding<TValue>`。

当控件编辑较大对象的一部分时，用 `ProjectedModSettingsValueBinding<TSource,TValue>` 包装父绑定。

```csharp
var settingsBinding = new ModSettingsValueBinding<MySettings, MySettings>(
    "MyMod", "settings", SaveScope.Global, s => s, (_, value) => value);

var volumeBinding = new ProjectedModSettingsValueBinding<MySettings, int>(
    settingsBinding,
    "volume",
    s => s.Volume,
    (s, value) => { s.Volume = value; return s; });
```

## 可见性与宿主界面

只在特定界面有意义的设置，可以限制可见性或只读状态：

```csharp
page
    .WithVisibleOnHostSurfaces(ModSettingsHostSurface.MainMenu | ModSettingsHostSurface.RunPause)
    .WithReadOnlyOnHostSurfaces(ModSettingsHostSurface.CombatPause);
```

运行时条件使用 `WithVisibleWhen` 和 `WithEnabledWhen`。
