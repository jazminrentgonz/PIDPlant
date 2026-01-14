// Simple first-order-plus-dead-time-like response (dead-time omitted for simplicity).
// Humidity dynamics around a setpoint with small noise and bounded [0,100].
export class FOPDT {
  private H: number;
  constructor(
    public readonly Ts: number, // s
    public readonly tau: number, // s time constant
    public H0 = 50
  ) { this.H = H0; }

  step(setpoint: number, u: number): number {
    const alpha = this.Ts / Math.max(this.tau, 1e-6);
    const dH = alpha * (setpoint - this.H) + 0.15 * (u - 0.5); // actuator effect
    const noise = (Math.random() - 0.5) * 0.05;                // ~±0.025%
    this.H = Math.min(100, Math.max(0, this.H + dH + noise));
    return this.H;
  }

  get value() { return this.H; }
}
