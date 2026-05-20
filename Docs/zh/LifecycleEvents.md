# 生命周期事件

## 订阅

Mod 需要游戏时机但不需要自己拥有 Harmony patch 时，使用生命周期事件。

```csharp
var subscription = RitsuLibFramework.SubscribeLifecycle<GameReadyEvent>(evt =>
{
    Logger.Info($"Game ready: {evt.Game.Name}");
});
```

临时 handler 用完后 dispose 返回的 subscription。

```csharp
RitsuLibFramework.SubscribeLifecycle<CombatStartingEvent>((evt, sub) =>
{
    PrepareForCombat(evt.RunState);
    sub.Dispose();
});
```

可重放事件默认会立即补发给后订阅者。只想接收未来事件时，传 `replayCurrentState: false`。

## 常用事件

| 时机 | 事件 |
| --- | --- |
| 框架启动 | `FrameworkInitializingEvent`、`FrameworkInitializedEvent` |
| 模型设置 | `ContentRegistrationClosedEvent`、`ModelRegistryInitializedEvent`、`ModelIdsInitializedEvent`、`ModelPreloadingCompletedEvent` |
| 游戏节点 | `GameTreeEnteredEvent`、`GameReadyEvent` |
| 档位与存档 | `ProfileIdInitializedEvent`、`ProfileSwitchingEvent`、`ProfileSwitchedEvent`、`RunSavingEvent`、`RunSavedEvent`、`ProgressSavingEvent`、`ProgressSavedEvent`、`ProfileDeletingEvent`、`ProfileDeletedEvent` |
| Run 流程 | `RunStartedEvent`、`RunLoadedEvent`、`RunEndedEvent`、`RoomEnteringEvent`、`RoomEnteredEvent`、`RoomExitedEvent`、`ActEnteringEvent`、`ActEnteredEvent` |
| 战斗 | `CombatStartingEvent`、`CombatEndedEvent`、`CombatVictoryEvent`、`SideTurnStartingEvent`、`SideTurnStartedEvent`、`CardPlayingEvent`、`CardPlayedEvent` |
| 卡牌 | `CardMovedBetweenPilesEvent`、`CardDrawnEvent`、`CardDiscardedEvent`、`CardExhaustedEvent`、`BeforeFlushEvent`、`CardsFlushedEvent` |
| 奖励与物品栏 | `GoldGainedEvent`、`GoldLostEvent`、`PotionProcuredEvent`、`PotionDiscardedEvent`、`RelicObtainedEvent`、`RelicRemovedEvent`、`RewardTakenEvent` |
| 解锁 | `EpochObtainedEvent`、`EpochRevealedEvent`、`UnlockIncrementedEvent` |

## 版本注意点

`CardRetainedEvent` 在较新 host API 上已过时。需要同时观察 retained 和 flushed cards 时，使用 `CardsFlushedEvent`。

影响事件可用性的游戏 API 差异见 [诊断与兼容](DiagnosticsAndCompatibility.md)。
