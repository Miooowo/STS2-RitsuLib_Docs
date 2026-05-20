# Runtime UI And Shell Theme

## Settings Shell Theme

RitsuLib settings pages use shell theme tokens for colors, typography, spacing, and component defaults. Most mods should rely on the active theme. Add a custom theme only when your settings UI needs a coherent visual identity across several custom controls.

Theme JSON files belong in your mod resources and are registered through the shell theme APIs. Keep token names semantic: describe the role, not the color.

## Toasts

Use toast messages for short runtime feedback that should not interrupt play.

```csharp
RitsuToastService.ShowInfo("Settings saved.", "My Mod");
RitsuToastService.ShowWarning("Optional bank failed to load.", "My Mod");
RitsuToastService.ShowError("Required setup failed.", "My Mod");
```

For custom placement, image, duration, or click behavior, build a `RitsuToastRequest`.

## Runtime Hotkeys

Register hotkeys when the action must be available outside a settings page.

```csharp
var handle = RuntimeHotkeyService.Register(
    "Ctrl+Shift+M",
    callback: ToggleMyOverlay,
    id: "my_mod.toggle_overlay",
    title: "Toggle overlay");
```

Expose hotkeys in settings with `AddKeyBinding`, `AddMultiKeyBinding`, or `AddRuntimeHotkeySummary`.

## Top-Bar Buttons

Register top-bar buttons through the content pack:

```csharp
RitsuLibFramework.CreateContentPack("MyMod")
    .TopBarButtonOwned("my_panel", new ModTopBarButtonSpec(
        IconPath: "res://MyMod/images/ui/my_panel.png",
        Handler: new MyTopBarButtonHandler()))
    .Apply();
```

Owned button ids use `MY_MOD_TOPBARBUTTON_MY_PANEL` and read hover text from `static_hover_tips`.

## Card Piles

Custom piles are useful for extra hand-like or discard-like collections.

```csharp
RitsuLibFramework.CreateContentPack("MyMod")
    .CardPileOwned("archive", new ModCardPileSpec
    {
        DisplayName = "Archive"
    })
    .Apply();
```

Use stable local stems. Pile ids are part of UI text, save-like state, and player expectations.
