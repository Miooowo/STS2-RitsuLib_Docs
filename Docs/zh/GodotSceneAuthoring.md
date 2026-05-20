# Godot 场景编写

## 注册 C# 脚本

如果 Mod 的 `.tscn` 场景挂了 C# 脚本，在初始化入口调用一次：

```csharp
RitsuLibFramework.EnsureGodotScriptsRegistered(
    Assembly.GetExecutingAssembly(),
    Logger);
```

否则 Godot 可能能加载场景文件，但找不到挂在节点上的 C# 脚本类型。

## 通过 Profile 加载场景

内容视觉优先通过模型的 asset profile 指定，不要手动到处加载场景：

```csharp
public override EventAssetProfile AssetProfile => new()
{
    LayoutScenePath = "res://MyMod/scenes/events/my_event.tscn"
};
```

只有场景必须依赖运行时状态，或你明确不想维护 `.tscn` 文件时，才用代码创建场景。

## 场景路径检查

- 使用打包后真实存在的 `res://` 路径。
- 脚本类保持 `public`，并编进 Mod 程序集。
- 不要使用编辑器专用资源路径。
- 场景由模型 profile 使用时，尽早通过 content pack 注册该模型。
- 如果场景会实例化自定义节点，在任何模型或 UI 请求场景前注册脚本程序集。

## 何时使用 Factory

部分模板提供 `TryCreateLayoutPackedScene()`、`TryCreateCreatureVisuals()` 等 protected factory。静态路径不够用时再覆写：

```csharp
protected override PackedScene? TryCreateLayoutPackedScene()
{
    return BuildSceneForCurrentMode();
}
```

返回 `null` 表示继续走普通 asset profile 路径。
