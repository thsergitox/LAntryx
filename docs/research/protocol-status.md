# Protocol evidence and validation boundary

Static investigation used REA 6.7.0 with Ghidra 12.1.4 against the owner's installed MK825 Windows application. Original binaries were not modified or executed during analysis. No hardware writes were made.

## Observations

| Operation | Static observation |
|---|---|
| Live RGB frames | Feature report 8; 382 bytes including ID; header `08 0A 7A 01`, then 378 bytes |
| Effect-color table | Feature report 6; 1032 bytes; header `06 08 C8 ...` |
| Profile configuration | Feature report 6; 1032 bytes; header `06 03 C6 ...` |
| Brightness/speed | The serializer packs SpeedHW in the high nibble, LightHW in the low nibble; installed mappings contain levels 1–5 |
| Report-5 problem | One OEM profile-read path builds 7 API-buffer bytes while the real descriptor declares 6; causal relation to EPROTO is not yet demonstrated |

The live-frame route is named `SendMusicData` by the program. It is distinct from effect selection and must not be treated as proof of persistent static lighting. A separate `SetKeyMatrix` path was identified and excluded from lighting scope.

## What remains unknown

- A successful physical color-change sequence and required initialization.
- The physical LED-slot mapping and independently observed channel order.
- Behavior after app exit, reconnect or power cycle.
- Whether supported off/brightness/effect operations match the proposed UI.
- The exact cause of Wine's EPROTO errors and actual wire length.

## Evidence handling

The full local report, original REA JSON responses and snapshot remain outside this repository in the owner's private research directory. Do not upload those automatically: they contain decompiled vendor implementation and local paths.

Public interoperability documentation should describe only the necessary protocol facts with provenance and validation level. No OEM executable, DLL, firmware, extracted logo or unreviewed USB capture belongs in the project.

## Reference sources

- REA: https://github.com/morluto/rea
- Linux hidraw API: https://docs.kernel.org/hid/hidraw.html
- Linux USB error meanings: https://cdn.kernel.org/doc/html/latest/driver-api/usb/error-codes.html
- Wine 11.20 HID transport: https://github.com/wine-mirror/wine/blob/wine-11.20/dlls/winebus.sys/bus_udev.c

No capability is promoted from **observed statically** to **verified** without an explicit owner-present test.
