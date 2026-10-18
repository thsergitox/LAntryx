export type Rgb = { r: number; g: number; b: number };
export type Lighting = {
  color: Rgb;
  brightness: 1 | 2 | 3 | 4 | 5;
  effect: "uniform";
  enabled: boolean;
};
export type Profile = {
  schemaVersion: 1;
  id: string;
  name: string;
  model: "MK825-TRIX";
  layout: "es-69";
  lighting: Lighting;
};
export type DeviceState = {
  generation: number;
  status:
    | "offline"
    | "checking"
    | "denied"
    | "unverified"
    | "ready"
    | "applying"
    | "failed"
    | "unknown";
  canApply: boolean;
  reason: string | null;
};
export type ApplyResult = {
  outcome: "simulated" | "transport-accepted" | "failed" | "unknown";
  generation: number;
  message: string;
};
export type EditorState = {
  saved: Profile;
  draft: Lighting;
  lastApplied: Lighting | null;
  dirty: boolean;
  generation: number;
};
export type EditorAction =
  | { type: "edit-color"; color: Rgb }
  | { type: "edit-brightness"; brightness: Lighting["brightness"] }
  | { type: "edit-enabled"; enabled: boolean }
  | { type: "load-profile" | "save-local"; profile: Profile }
  | { type: "apply-result"; lighting: Lighting; result: ApplyResult };
export interface Bridge {
  profiles: {
    list(): Promise<Profile[]>;
    save(profile: Profile): Promise<Profile>;
    remove(id: string): Promise<void>;
    import(): Promise<Profile | null>;
    export(id: string): Promise<boolean>;
  };
  preferences: {
    get(): Promise<{ language: "en" | "es" }>;
    set(language: "en" | "es"): Promise<void>;
  };
  device: {
    inspect(): Promise<DeviceState>;
    simulate(lighting: Lighting): Promise<ApplyResult>;
  };
}
declare global {
  interface Window {
    lantryx: Bridge;
  }
}
