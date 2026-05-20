# FMOD 与音频

## 播放音频

新代码优先使用 `GameAudioService.Shared`。它通过 `AudioSource` 接收事件路径、GUID、散装音效文件、流式音乐文件和 snapshot。

```csharp
using STS2RitsuLib.Audio;

GameAudioService.Shared.PlayOneShot(
    AudioSource.Event("event:/MyMod/ui/click"),
    new AudioPlaybackOptions
    {
        Volume = 0.8f,
        Parameters = FmodParameterMap.Set(("intensity", 1f)),
        Scope = AudioLifecycleScope.Room,
    });
```

已有 path-based 调用可以继续使用 `GameFmod.Studio` 和 `Sts2SfxAlignedFmod`。

## 循环与音乐

之后需要停止或调整播放时，保留返回的 handle。

```csharp
var loop = GameAudioService.Shared.PlayLoop(
    AudioSource.Event("event:/MyMod/ambience/engine"),
    new AudioPlaybackOptions
    {
        Routing = new AudioRoutingOptions(Channel: "my_mod_ambience"),
        Scope = AudioLifecycleScope.Run,
    });

loop?.TrySetParameter("danger", 0.5f);
loop?.TryStop();
```

音乐使用 `PlayMusic(...)`，房间 / 战斗 / 胜利切换使用 `FollowAdaptiveMusic(...)`。

## Bank 与 GUID 映射

使用事件前先加载 bank：

```csharp
FmodStudioDeferredBankRegistration.RegisterBank("res://MyMod/audio/MyMod.bank");
FmodStudioDeferredBankRegistration.RegisterStudioGuidMappings("res://MyMod/audio/guid_map.json");
```

可选 bank 使用更底层的 `FmodStudioServer.TryLoadBank(...)`，并处理加载失败。

## 生命周期与路由

| 选项 | 用途 |
| --- | --- |
| `Scope` | 随房间、战斗、run 或手动生命周期自动停止音频。 |
| `ScopeToken` | 把多个 handle 放进手动 scope。 |
| `Routing.Channel` | 每个 channel 只保留一个活动 handle，可选择替换旧 handle。 |
| `Routing.Tag` | 给多个 handle 分组，之后用 `StopTag(...)` 停止。 |
| `CooldownMs` | 避免高频重复播放。 |
| `UseVanillaRouting` | 适用时让 one-shot 和 music event path 走原版路由。 |

UI 和循环环境音适合使用 routing。除非该组音频都由你的 Mod 拥有，否则不要随意做全局停止。
