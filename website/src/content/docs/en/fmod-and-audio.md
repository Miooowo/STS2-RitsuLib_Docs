---
title: "FMOD And Audio"
---

## Play Audio

Use `GameAudioService.Shared` for new code. It accepts event paths, GUIDs, loose sound files, streaming music files, and snapshots through `AudioSource`.

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

For quick compatibility with existing path-based calls, `GameFmod.Studio` and `Sts2SfxAlignedFmod` remain available.

## Loops And Music

Keep the returned handle when you need to stop or adjust playback later.

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

Use `PlayMusic(...)` for music handles and `FollowAdaptiveMusic(...)` for room / combat / victory plans.

## Banks And GUID Mappings

Load banks before using their events:

```csharp
FmodStudioDeferredBankRegistration.RegisterBank("res://MyMod/audio/MyMod.bank");
FmodStudioDeferredBankRegistration.RegisterStudioGuidMappings("res://MyMod/audio/guid_map.json");
```

If a bank is optional, use the lower-level `FmodStudioServer.TryLoadBank(...)` and handle failure gracefully.

## Lifecycle And Routing

| Option | Use |
| --- | --- |
| `Scope` | Stops audio automatically with room, combat, run, or manual lifetime. |
| `ScopeToken` | Groups handles under a manual scope. |
| `Routing.Channel` | Allows one active handle per channel, optionally replacing the old one. |
| `Routing.Tag` | Groups several handles for `StopTag(...)`. |
| `CooldownMs` | Prevents rapid repeated playback. |
| `UseVanillaRouting` | Lets one-shot and music event paths route through vanilla where applicable. |

Use routing for UI and looping ambience. Avoid global stop calls unless the mod owns all audio in that group.

