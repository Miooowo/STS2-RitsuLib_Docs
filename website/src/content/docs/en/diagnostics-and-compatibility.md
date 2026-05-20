---
title: "Diagnostics And Compatibility"
---

## Use Warnings As Release Signals

RitsuLib tries to log one clear warning for common authoring problems:

| Warning area | Usually means |
| --- | --- |
| Content registration | A model was registered too late, twice, or with a conflicting id. |
| Asset paths | A profile points at a missing resource. |
| Localization | A key is missing from a game table or I18N source. |
| Unlocks | A rule references an epoch or character that cannot resolve. |
| Patching | A required target method is missing or a patch class has no Harmony method. |
| Audio | A bank, event path, GUID mapping, bus, or loose audio file could not be resolved. |

Treat character asset warnings, required patch failures, and model-id conflicts as release blockers.

## Debug Compatibility Mode

RitsuLib's own debug compatibility mode is off by default. When enabled in the RitsuLib settings page, it exposes fallback toggles for development and compatibility testing.

Use it to investigate missing localization, invalid unlock epochs, and missing Architect dialogue. Do not rely on debug fallbacks as the normal release path for your mod.

## Game Source Notes

When checking decompiled or reference game source, keep these rules in mind:

- Match the game API branch used by your package (`STS2.RitsuLib` or `STS2.RitsuLib.Compat.<api-version>`).
- Confirm method overloads before writing a `ModPatchTarget`; use `parameterTypes` when there is any ambiguity.
- Some lifecycle hooks differ by host API. Prefer RitsuLib events such as `CardsFlushedEvent` when they already bridge those differences.
- If a behavior depends on a private field or compiler-generated state machine, isolate it behind a small compatibility helper and add diagnostics.

## Release Checklist

- Build against the intended game API branch.
- Start a new run and load an existing run.
- Switch profiles if the mod uses `SaveScope.Profile`.
- Verify both installed languages you ship.
- Open all settings pages from main menu and pause menu.
- Check logs for RitsuLib warnings after content registration and after first combat.
- Test optional compatibility patches with their target feature absent.

