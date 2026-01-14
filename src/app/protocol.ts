export const SVC = 'A000';
export const CH = {
  TLM: 'A001',   // telemetry (notify)
  PID: 'A002',   // PID config (write)
  MODE:'A003',   // mode & setpoint (write/notify)
  SAFE:'A004',   // safety limits (write)
  SCHED:'A005',  // scheduler (write/notify)
  CAL:'A006',    // calibration (write/notify)
} as const;
