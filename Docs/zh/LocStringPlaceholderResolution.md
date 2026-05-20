# LocString 占位符

## 优先使用游戏管线

模型标题、描述、事件选项、hover tip 和大多数游戏 UI 文本应使用游戏原生 `LocString` 管线。RitsuLib 的 `I18N` 适合 Mod UI 和自定义文本；已经有原生本地化表的内容，应留在对应游戏表里。

```json
{
  "MY_MOD_CARD_MY_STRIKE.title": "精准打击",
  "MY_MOD_CARD_MY_STRIKE.description": "造成 {damage} 点伤害。"
}
```

来自 `DynamicVars` 的值，在描述中保留占位符名称，并从卡牌暴露对应变量。

## 占位符来源

常见占位符来源：

| 占位符类型 | 定义位置 |
| --- | --- |
| 卡牌数值 | 卡牌上的 `DynamicVarSet` |
| 关键词标题 / 描述 | `card_keywords` 或 `static_hover_tips` key |
| 事件选项文本 | 由 `InitialOptionKey(...)` / `ModOptionKey(...)` 生成的事件或 ancient 本地化 entry |
| 设置 UI 文本 | `ModSettingsText.I18N(...)`、`ModSettingsText.LocString(...)` 或 literal text |
| 自定义 formatter | `RitsuLibFramework.GetSmartFormatRegistry(modId)` 或 content pack 的 `.SmartFormatter<T>()` |

面向作者的 JSON 里，占位符名称尽量小写且语义清晰。不要把实现类名塞进用户文本。

## SmartFormat 扩展

占位符需要自定义格式化行为时，注册 SmartFormat 扩展。

```csharp
RitsuLibFramework.CreateContentPack("MyMod")
    .SmartFormatter<MyFormatter>()
    .SmartFormatSource<MySource>()
    .Apply();
```

可复用格式化规则适合走这条路。单张卡牌的数值直接用 dynamic variable 更简单，也更容易让其他作者理解。

## 检查清单

- 本地化 key 基于稳定公开 Entry。
- 用户可见文本里不要出现类名、方法名和 patch 名。
- Mod 设置文本提供 fallback。
- 同时发布英文和中文时，至少测试 `eng` 与 `zhs`。
- 关键词和 SmartFormat 扩展应在模型文本首次解析前注册。
