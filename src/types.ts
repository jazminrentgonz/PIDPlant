export type ViewKey = "dashboard" | "plantDatabase" | "controlSettings";

export type PlantType = "Houseplant" | "Herb" | "Succulent" | "Vegetable" | "Flower";

export interface PlantProfile {
  id: string;
  name: string;
  scientificName?: string;
  type: PlantType;
  idealTempC: { min: number; max: number };
  idealHumidityPct?: { min: number; max: number };
}

export interface PIDSettings {
  kp: number;
  ki: number;
  kd: number;
  setpointHumidityPct: number;
  setpointTempC: number;
  sampleTimeMs: number;
  outputLimit: { min: number; max: number };
}
