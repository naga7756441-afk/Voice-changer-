# VoiceChanger

Real-time voice changer for Windows.

- 15 voice presets: Demon, Robot, Chipmunk, Alien, Radio, Ghost and more
- Voice editor: pitch, tone (bass/mid/treble), filters, noise gate, distortion, robot, tremolo, echo, reverb
- Save your own voices
- Test: hear yourself, A/B compare, record 5 seconds (original and with effect)
- Output to a virtual microphone (VB-Audio Virtual Cable) for Discord, games and OBS
- Global hotkeys that work in games
- Runs in the system tray

## Hotkeys
| Keys | Action |
|---|---|
| Ctrl+Shift+B | A/B: effect on/off |
| Ctrl+Shift+M | hear yourself |
| Ctrl+Shift+V | mute output |
| Ctrl+Shift+1…9 | voice presets |

## Discord / games
1. Install VB-Audio Virtual Cable: https://vb-audio.com/Cable/
2. In VoiceChanger, turn on "Send voice" and select **CABLE Input**.
3. In Discord, set the input device to **CABLE Output**.

## Build
**On GitHub:** Actions → Build Windows .exe → Run workflow, then download `VoiceChanger-Windows` from Artifacts.
To put the .exe in Releases, create a tag such as `v1.0.1`.

**Locally (requires Node.js):**
```
npm install
npm start        # run
npm run dist     # build .exe into dist/
```

VoiceChanger by W1CKIX
https://github.com/naga7756441-afk/Voice-changer-/releases/tag/v1.0.1 
Download 👆
