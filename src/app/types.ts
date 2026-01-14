export type Mode = 0 | 1 | 2; // 0=Idle, 1=ClosedLoop, 2=OpenLoopTest

export interface Telemetry {
  t_ms: number;      // monotonic time (ms)
  temp_C: number;    // °C
  humid_pct: number; // %
  lux: number;       // lux
  u_pid: number;     // controller output (0..1)
  u_act: number;     // actuator actual (0..1)
}

export interface PIDConfig {
  r_humid: number; // %
  Kp: number;
  Ki: number;      // discrete form (per Ts)
  Kd: number;      // discrete form (per Ts)
  Ts: number;      // s
  u_min: number;   // 0..1
  u_max: number;   // 0..2
  Kaw: number;     // anti-windup gain
  Td_f: number;    // derivative LPF time-constant (s)
}

export interface SafetyLimits {
  H_min: number; H_max: number;
  dHdt_max: number;    // %/s
  min_on_s: number;    // actuator dwell constraints
  min_off_s: number;
}

export interface SchedulerBlock {
  dow: number;         // 0=Sun..6=Sat
  t_start: string;     // "HH:MM"
  t_end: string;       // "HH:MM"
  setpoint: number;    // %
}
