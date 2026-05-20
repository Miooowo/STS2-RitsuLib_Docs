# 持久化

## 注册数据

每个需要保存的概念定义为一个 class。放在 `BeginModDataRegistration` 里注册，这样整批完成后再初始化。

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

不要直接保存裸基础类型。使用 class 后，未来新增字段不需要更换存储槽。

## 选择作用域

| Scope | 适合保存 |
| --- | --- |
| `SaveScope.Global` | Mod 设置、账号级偏好、所有游戏档位共享的缓存。 |
| `SaveScope.Profile` | 进度、类似解锁的数据、和当前游戏档位绑定的内容。 |
| `SaveScope.InMemory` | 临时进程内数据：复用 store API，但不写盘。 |
| `SaveScope.RunSidecar` | 带显式 `StorageContext` 的单 run sidecar 数据；只在处理 run 级文件时使用。 |

`RunSidecar` 不能使用简单的 `Register<T>(key, fileName, scope, ...)` 重载。它需要带 `contextProvider` 的重载，或更高层的 run-sidecar 辅助接口。

## 读取与写入

```csharp
var store = RitsuLibFramework.GetDataStore("MyMod");

var settings = store.Get<MySettings>("settings");

store.Modify<MySettings>("settings", data =>
{
    data.Volume = 60;
});

store.Save("settings");
```

`Get<T>` 返回活动对象。`Modify<T>` 修改这个对象。保存默认是显式的，除非设置绑定等上层能力替你调用 `Save()`。

## 迁移格式

发布破坏性数据结构前，先准备迁移。

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

发布后保持 `fileName` 和 `key` 稳定。当 JSON 结构变化到旧文件不能直接反序列化时，提升 schema version。

## 附加状态

`AttachedState<TKey,TValue>` 用于挂在引用对象上的运行时状态。`SavedAttachedState<TKey,TValue>` 只适合本来就经过游戏 `SavedProperties` 序列化的模型对象。

```csharp
private static readonly SavedAttachedState<CardModel, int> BonusDamage =
    new("bonus_damage", () => 0);

BonusDamage[card] = 3;
```

普通 Mod 设置、进度和功能数据，优先使用 `ModDataStore`。
