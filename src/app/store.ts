import { create } from 'zustand';
import type { Telemetry, PIDConfig, Mode, SafetyLimits } from './types';

type LogRow = Telemetry & { iso: string; mode: Mode; r_humid: number };

interface AppState {
  mode: Mode;
  pid: PIDConfig;
  safety: SafetyLimits;
  telemetry: Telemetry | null;
  log: LogRow[];
  setMode: (m: Mode) => void;
  setPID: (p: Partial<PIDConfig>) => void;
  pushTelemetry: (t: Telemetry) => void;
  clearLog: () => void;
}

const NOW = () => new Date().toISOString();

export const useApp = create<AppState>((set, get) => ({
  mode: 1,
  pid: { r_humid:60, Kp:0.8, Ki:0, Kd:0, Ts:0.1, u_min:0, u_max:1, Kaw:0, Td_f:0.05 },
  safety: { H_min:30, H_max:80, dHdt_max:2, min_on_s:2, min_off_s:2 },
  telemetry: null,
  log: [],
  setMode: (m)=>set({mode:m}),
  setPID: (p)=>set({ pid: { ...get().pid, ...p } }),
  pushTelemetry: (t)=>{
    const { mode, pid } = get();
    set({ telemetry:t, log:[...get().log, { ...t, iso:NOW(), mode, r_humid:pid.r_humid }].slice(-12000) });
  },
  clearLog: ()=>set({ log: [] }),
}));
