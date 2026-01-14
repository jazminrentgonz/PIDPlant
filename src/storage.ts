import type { PlantProfile, PIDSettings } from "./types";

const KEYS = {
  myPlants: "pid_incubator_my_plants_v1",
  pid: "pid_incubator_pid_v1",
  theme: "pid_incubator_theme_v1",
} as const;

export function loadMyPlants(): PlantProfile[] {
  try {
    const raw = localStorage.getItem(KEYS.myPlants);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveMyPlants(plants: PlantProfile[]) {
  localStorage.setItem(KEYS.myPlants, JSON.stringify(plants));
}

const DEFAULT_PID: PIDSettings = {
  kp: 1.2,
  ki: 0.18,
  kd: 0.06,
  setpointHumidityPct: 65,
  setpointTempC: 23,
  sampleTimeMs: 1000,
  outputLimit: { min: 0, max: 100 },
};

export function loadPIDSettings(): PIDSettings {
  try {
    const raw = localStorage.getItem(KEYS.pid);
    if (!raw) return DEFAULT_PID;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PID, ...parsed };
  } catch {
    return DEFAULT_PID;
  }
}

export function savePIDSettings(pid: PIDSettings) {
  localStorage.setItem(KEYS.pid, JSON.stringify(pid));
}

export function loadTheme(): "dark" | "light" {
  const raw = localStorage.getItem(KEYS.theme);
  return raw === "light" ? "light" : "dark";
}

export function saveTheme(theme: "dark" | "light") {
  localStorage.setItem(KEYS.theme, theme);
}
