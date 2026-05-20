# Persistence

## Register Data

Register each saved concept as a class. Do it inside `BeginModDataRegistration` so initialization happens after the batch is complete.

```csharp
public sealed class MySettings
{
    public bool Enabled { get; set; } = true;
    public int Volume { get; set; } = 80;
}

using (RitsuLibFramework.BeginModDataRegistration("MyMod"))
{
    var store = RitsuLibFramework.GetDataStore("MyMod");
    store.Register(
        key: "settings",
        fileName: "settings.json",
        scope: SaveScope.Global,
        defaultFactory: () => new MySettings(),
        autoCreateIfMissing: true);
}
```

Use classes rather than primitive values so you can add fields later without changing the storage slot.

## Choose A Scope

| Scope | Use for |
| --- | --- |
| `SaveScope.Global` | Mod settings, account-wide preferences, caches shared by all game profiles. |
| `SaveScope.Profile` | Progression, unlock-like data, and anything tied to the current game profile. |
| `SaveScope.InMemory` | Temporary process-local data that should use the same store API but never writes to disk. |
| `SaveScope.RunSidecar` | Per-run sidecar data with an explicit `StorageContext`; use only when you are working with run-scoped files. |

`RunSidecar` cannot use the simple `Register<T>(key, fileName, scope, ...)` overload. It needs the overload with `contextProvider`, or higher-level run-sidecar helpers.

## Read And Write

```csharp
var store = RitsuLibFramework.GetDataStore("MyMod");

var settings = store.Get<MySettings>("settings");

store.Modify<MySettings>("settings", data =>
{
    data.Volume = 60;
});

store.Save("settings");
```

`Get<T>` returns the live object. `Modify<T>` mutates that object. Saving is explicit unless another layer, such as a settings binding, calls `Save()` for you.

## Migrate Formats

Add migrations before publishing a breaking data shape.

```csharp
store.Register<MySettings>(
    "settings",
    "settings.json",
    SaveScope.Global,
    defaultFactory: () => new MySettings(),
    migrationConfig: new ModDataMigrationConfig(
        currentDataVersion: 2,
        minimumSupportedDataVersion: 1),
    migrations:
    [
        new SettingsV1ToV2Migration(),
    ]);
```

Keep `fileName` and `key` stable after release. Change the schema version when the JSON shape changes in a way old files cannot deserialize directly.

## Attached State

Use `AttachedState<TKey,TValue>` for runtime-only state attached to reference objects. Use `SavedAttachedState<TKey,TValue>` only for model objects that already pass through the game's `SavedProperties` serialization.

```csharp
private static readonly SavedAttachedState<CardModel, int> BonusDamage =
    new("bonus_damage", () => 0);

BonusDamage[card] = 3;
```

For normal mod settings, progression, and feature data, prefer `ModDataStore`.
