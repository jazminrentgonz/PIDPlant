import { create } from 'zustand';
import { Telemetry, PIDConfig, Mode } from '../app/types';
import { FOPDT } from './fopdt';

// ---- App-side “connection” state (simulates a BLE peripheral) ----
interface SimState {
  connected: boolean;
  deviceId?: string;
  connect: () => void;
  disconnect: () => void;
}
export const useSimLink = create<SimState>((set) => ({
  connected: false,
  deviceId: 'SIM-INCUBATOR-01',
  connect: () => set({ connected: true }),
  disconnect: () => set({ connected: false })
}));

// ---- Simulator engine ----
type Listener = (s: Telemetry) => void;

export class SimBLE {
  private timer?: number;
  private t_ms = 0;
  private model: FOPDT;
  private setpoint = 60;  // %
  private u_pid = 0.5;    // 0..1
  private temp = 24.0;    // °C
  private lux = 200.0;    // lux
  private Ts = 0.1;       // s
  private mode: Mode = 1; // ClosedLoop
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.model = new FOPDT(this.Ts, 8, 52);
  }

  start() {
    if (this.timer) return;
    this.timer = window.setInterval(() => this.tick(), this.Ts * 1000);
  }

  stop() {
    if (this.timer) window.clearInterval(this.timer);
    this.timer = undefined;
  }

  onNotify(cb: Listener) { this.listeners.add(cb); return () => this.listeners.delete(cb); }

  // --- Writes that would normally go over GATT ---
  writePID(cfg: PIDConfig) {
    this.Ts = cfg.Ts;
    this.setpoint = cfg.r_humid;
    // naive “PID effect” in sim: drive u_pid proportional to error
    const e = this.setpoint - this.model.value;
    this.u_pid = Math.max(cfg.u_min, Math.min(cfg.u_max, 0.5 + cfg.Kp*e*0.01));
  }

  writeMode(mode: Mode, setpoint?: number) {
    this.mode = mode;
    if (setpoint != null) this.setpoint = setpoint;
  }

  private tick() {
    this.t_ms += this.Ts * 1000;
    // simple environment drift
    this.temp += (Math.random() - 0.5) * 0.02;
    this.lux  += (Math.random() - 0.5) * 1.0;

    // update humidity state
    const H = this.model.step(this.setpoint, this.u_pid);
    const tlm: Telemetry = {
      t_ms: Math.round(this.t_ms),
      temp_C: this.temp,
      humid_pct: H,
      lux: Math.max(0, this.lux),
      u_pid: this.u_pid,
      u_act: this.u_pid
    };
    this.listeners.forEach(cb => cb(tlm));
  }
}

export const sim = new SimBLE();