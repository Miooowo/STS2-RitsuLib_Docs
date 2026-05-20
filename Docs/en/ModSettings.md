# Mod Settings

## Register A Page

Register settings pages from your mod initializer after the backing data is registered.

```csharp
RitsuLibFramework.RegisterModSettings("MyMod", page => page
    .WithTitle(ModSettingsText.Literal("My Mod"))
    .WithModDisplayName(ModSettingsText.Literal("My Mod"))
    .AddSection("general", section => section
        .WithTitle(ModSettingsText.Literal("General"))
        .AddToggle(
            "enabled",
            ModSettingsText.Literal("Enabled"),
            new ModSettingsValueBinding<MySettings, bool>(
                "MyMod",
                "settings",
                SaveScope.Global,
                s => s.Enabled,
                (s, value) => s.Enabled = value))
        .AddIntSlider(
            "volume",
            ModSettingsText.Literal("Volume"),
            new ModSettingsValueBinding<MySettings, int>(
                "MyMod",
                "settings",
                SaveScope.Global,
                s => s.Volume,
                (s, value) => s.Volume = value),
            minValue: 0,
            maxValue: 100)));
```

Use `ModSettingsText.Literal(...)` for fixed text. Use `ModSettingsText.I18N(...)` or `ModSettingsText.LocString(...)` when the UI should localize.

## Controls

| Control | Builder method |
| --- | --- |
| Toggle | `AddToggle` |
| Integer slider | `AddIntSlider` |
| Floating slider | `AddSlider` |
| Choice / enum | `AddChoice`, `AddEnumChoice` |
| Color | `AddColor` |
| Single-line text | `AddString` |
| Multiline text | `AddMultilineString` |
| Key binding | `AddKeyBinding`, `AddMultiKeyBinding` |
| Button | `AddButton` |
| Editable list | `AddList` |
| Read-only content | `AddHeader`, `AddParagraph`, `AddInfoCard`, `AddImage`, `AddRuntimeHotkeySummary` |
| Nested page | `AddSubpage` |
| Custom Godot control | `AddCustom` |

Every interactive control should have a stable entry id. Changing ids after release breaks clipboard and saved UI metadata expectations.

## Bindings

Use `ModSettingsValueBinding<TModel,TValue>` for fields stored in `ModDataStore`. For temporary UI, use `InMemoryModSettingsValueBinding<TValue>`.

When a control edits part of a larger value, wrap the parent binding with `ProjectedModSettingsValueBinding<TSource,TValue>`.

```csharp
var settingsBinding = new ModSettingsValueBinding<MySettings, MySettings>(
    "MyMod", "settings", SaveScope.Global, s => s, (_, value) => value);

var volumeBinding = new ProjectedModSettingsValueBinding<MySettings, int>(
    settingsBinding,
    "volume",
    s => s.Volume,
    (s, value) => { s.Volume = value; return s; });
```

## Visibility And Host Surfaces

Use visibility and read-only gates for settings that only make sense in certain places:

```csharp
page
    .WithVisibleOnHostSurfaces(ModSettingsHostSurface.MainMenu | ModSettingsHostSurface.RunPause)
    .WithReadOnlyOnHostSurfaces(ModSettingsHostSurface.CombatPause);
```

Use `WithVisibleWhen` and `WithEnabledWhen` for runtime conditions.
