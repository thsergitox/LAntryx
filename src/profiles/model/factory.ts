import type { Profile } from "../../desktop/bridge/contracts";
export function newProfile(name: string): Profile {
  return {
    schemaVersion: 1,
    id: crypto.randomUUID(),
    name,
    model: "MK825-TRIX",
    layout: "es-69",
    lighting: {
      color: { r: 152, g: 214, b: 160 },
      brightness: 4,
      effect: "uniform",
      enabled: true,
    },
  };
}
