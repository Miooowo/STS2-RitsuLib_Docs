# 本地化与关键词

## 两套文本系统

游戏内容使用游戏本地化表。你自己的 UI 文本使用 `I18N`。

| 需求 | 使用 |
| --- | --- |
| 卡牌、遗物、药水、能力、角色、事件、Ancient、Epoch 文本 | 游戏 loc 表，例如 `cards`、`relics`、`events`、`ancients`、`epochs` |
| 关键词标题 / 描述 | 卡牌关键词用 `card_keywords`，通用 hover tip 用 `static_hover_tips` |
| 设置界面、调试面板、小型 Mod UI | 通过 `CreateModLocalization(...)` 创建 `I18N` |
| 某个游戏 API 要求 `LocString`，但文本来自你的 JSON | 注册 `I18N` 虚拟 loc table |

文件名使用游戏语言代码，例如 `eng.json`、`zhs.json`、`jpn.json`。

## Entry Key

对 RitsuLib 注册的池内容来说，公开 Entry 就是本地化 stem：

```text
MY_MOD_CARD_MY_STRIKE
```

它写入模型类型对应的本地化表：

| 模型 | 表 | 常用 key |
| --- | --- | --- |
| 卡牌 | `cards` | `{ENTRY}.title`、`{ENTRY}.description`、`{ENTRY}.selectionScreenPrompt` |
| 遗物 | `relics` | `{ENTRY}.title`、`{ENTRY}.description`、`{ENTRY}.flavor`、`{ENTRY}.selectionScreenPrompt` |
| 药水 | `potions` | `{ENTRY}.title`、`{ENTRY}.description`、`{ENTRY}.selectionScreenPrompt` |
| 能力 | `powers` | `{ENTRY}.title`、`{ENTRY}.description` |
| 角色 | `characters` | `{ENTRY}.title`、代词 key、卡牌修饰文本、解锁文本 |
| Act | `acts` | `{ENTRY}.title` |
| Encounter | `encounters` | `{ENTRY}.title`、`{ENTRY}.loss`、`{ENTRY}.customRewardDescription` |
| 事件 | `events` | `{ENTRY}.pages.<PAGE>.description`、`{ENTRY}.pages.<PAGE>.options.<OPTION>` |
| Ancient 事件 | `ancients` | 事件页面 key，加上 `talk` 对话 key |
| Epoch | `epochs` | `{ID}.title`、`{ID}.description`、`{ID}.unlockInfo`、`{ID}.unlockText` |
| 卡堆 / 顶栏按钮 / 通用 tooltip | `static_hover_tips` | `{ID}.title`、`{ID}.description`；卡堆还使用 `{ID}.empty` |

卡牌英文 `cards/eng.json`：

```json
{
  "MY_MOD_CARD_MY_STRIKE.title": "Measured Strike",
  "MY_MOD_CARD_MY_STRIKE.description": "Deal {Damage} damage."
}
```

中文使用同一组 key：

```json
{
  "MY_MOD_CARD_MY_STRIKE.title": "精准打击",
  "MY_MOD_CARD_MY_STRIKE.description": "造成 {Damage} 点伤害。"
}
```

## 事件 Key

`ModEventTemplate` 和 `ModAncientEventTemplate` 会用事件 Entry、页面名和选项名构造选项 key。

```csharp
protected string ModOptionKey(string pageName, string optionName);
protected string InitialOptionKey(string optionName);
protected LocString PageDescription(string pageName);
```

事件 Entry 为 `MY_MOD_EVENT_QUIET_DOOR` 时，约定如下：

```json
{
  "MY_MOD_EVENT_QUIET_DOOR.pages.INITIAL.description": "墙上有一扇安静的门。",
  "MY_MOD_EVENT_QUIET_DOOR.pages.INITIAL.options.OPEN": "[打开] 走进去。",
  "MY_MOD_EVENT_QUIET_DOOR.pages.DONE.description": "房间再次安静下来。"
}
```

发布后保持 page 和 option 名称稳定。它们属于本地化契约，也可能影响事件选择记录。

## Ancient / 先古之民对话

Ancient / 先古之民对话写在 `ancients` 表中。Key 格式为：

```text
<ANCIENT_ENTRY>.talk.<CHARACTER_ENTRY>.<DIALOGUE_INDEX>-<LINE_INDEX>.<speaker>
```

`speaker` 是 `ancient` 或 `char`。在行号后加 `r` 表示重复对话。同一段 dialogue 的所有行必须统一使用 `r`，或统一不使用。

一个 Mod Ancient 与 Mod 角色的对话示例：

```json
{
  "MY_MOD_ANCIENT_MIRROR.talk.MY_MOD_CHARACTER_SEER.0-0.ancient": "你带来了一份未来。",
  "MY_MOD_ANCIENT_MIRROR.talk.MY_MOD_CHARACTER_SEER.0-0.next": "继续",
  "MY_MOD_ANCIENT_MIRROR.talk.MY_MOD_CHARACTER_SEER.0-1.char": "那我应该谨慎地使用它。",

  "MY_MOD_ANCIENT_MIRROR.talk.ANY.0-0r.ancient": "又一次，镜中映出一张脸。",
  "MY_MOD_ANCIENT_MIRROR.talk.ANY.0-1r.char": "又一次，一个选择。"
}
```

`ModAncientEventTemplate` 会读取：

- `{ancient}.talk.firstVisitEver.*`：首次遭遇
- `{ancient}.talk.<CHARACTER_ENTRY>.*`：指定角色
- `{ancient}.talk.ANY.*`：不区分角色的回退对话

建筑师也使用同一个 `ancients` 表。给 Mod 角色添加建筑师对话时，写在 `THE_ARCHITECT.talk.<CHARACTER_ENTRY>.*` 下：

```json
{
  "THE_ARCHITECT.talk.MY_MOD_CHARACTER_SEER.0-0.char": "出口属于你，但代价由我承担。",
  "THE_ARCHITECT.talk.MY_MOD_CHARACTER_SEER.0-1.ancient": "那就精确地支付。",
  "THE_ARCHITECT.talk.MY_MOD_CHARACTER_SEER.0-attack": "Both"
}
```

建筑师对话可选的 `-attack` 值为 `None`、`Player`、`Architect` 或 `Both`。可选的 `-visit` key 可以覆写访问序号：

```json
{
  "THE_ARCHITECT.talk.MY_MOD_CHARACTER_SEER.1-visit": "3"
}
```

某一行需要指定 FMOD 事件时，在行 key 后加 `.sfx`：

```json
{
  "MY_MOD_ANCIENT_MIRROR.talk.ANY.0-0r.ancient.sfx": "event:/sfx/ui/enchant_simple"
}
```

## 关键词

优先使用 owned keyword id。注解写法：

```csharp
[RegisterOwnedCardKeyword(
    "bleeding",
    IconPath = "res://MyMod/images/keywords/bleeding.png")]
public sealed class MyKeywordRegistrations
{
}
```

Content pack 写法：

```csharp
RitsuLibFramework.CreateContentPack("MyMod")
    .CardKeywordOwnedByLocNamespace(
        localKeywordStem: "bleeding",
        iconPath: "res://MyMod/images/keywords/bleeding.png")
    .Apply();
```

两种写法都会生成：

```text
MY_MOD_KEYWORD_BLEEDING
```

卡牌关键词文本写入 `card_keywords`：

```json
{
  "MY_MOD_KEYWORD_BLEEDING.title": "流血",
  "MY_MOD_KEYWORD_BLEEDING.description": "回合结束时失去生命。"
}
```

在 `ModCardTemplate` 中使用关键词：

```csharp
protected override IEnumerable<string> RegisteredKeywordIds =>
[
    "MY_MOD_KEYWORD_BLEEDING"
];
```

运行时：

```csharp
card.AddModKeyword("MY_MOD_KEYWORD_BLEEDING");
if (card.HasModKeyword("MY_MOD_KEYWORD_BLEEDING"))
{
    // ...
}
```

遗物、药水和能力模板中的关键词列表只用于显示 hover tip。玩法行为需要写在模型自己的逻辑里。

## I18N

当你需要游戏模型表之外的简单 key-value JSON 文本时，创建 `I18N` 实例。

```csharp
var i18n = RitsuLibFramework.CreateModLocalization(
    modId: "MyMod",
    instanceName: "settings",
    pckFolders: ["res://MyMod/localization/settings"]);

var label = i18n.Get("settings.enabled", "启用");
```

示例 `zhs.json`：

```json
{
  "settings.enabled": "启用"
}
```

当某个 API 要求 `LocString` 时，可以把该实例注册为虚拟表：

```csharp
var loc = RitsuLibFramework.CreateModLocalization("MyMod", "ui");
RitsuLibFramework.RegisterI18NLocTableBridge("MyMod", loc);

var tableId = RitsuLibFramework.GetI18NLocTableId("MyMod");
var title = new LocString(tableId, "settings.enabled");
```

需要多个虚拟表时，在 `RegisterI18NLocTableBridge(...)` 和 `GetI18NLocTableId(...)` 里传入自定义 stem。
