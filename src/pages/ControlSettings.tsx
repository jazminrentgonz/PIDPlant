import type { PIDSettings } from "../types";

function clampNumber(n: number, min: number, max: number) {
  if (Number.isNaN(n)) return min;
  return Math.min(max, Math.max(min, n));
}

export default function ControlSettings({
  pid,
  onChange,
}: {
  pid: PIDSettings;
  onChange: (next: PIDSettings) => void;
}) {
  function setField<K extends keyof PIDSettings>(key: K, value: PIDSettings[K]) {
    onChange({ ...pid, [key]: value });
  }

  return (
    <section>
      <h1 className="pageTitle">Control Settings</h1>
      <p className="pageSubtitle">Prototype controls for PID tuning and setpoints (local only).</p>

      <div className="panel">
        <div className="formGrid">
          <label className="field">
            <span className="fieldLabel">Kp</span>
            <input
              className="fieldInput"
              type="number"
              step="0.01"
              value={pid.kp}
              onChange={(e) => setField("kp", Number(e.target.value))}
            />
          </label>

          <label className="field">
            <span className="fieldLabel">Ki</span>
            <input
              className="fieldInput"
              type="number"
              step="0.01"
              value={pid.ki}
              onChange={(e) => setField("ki", Number(e.target.value))}
            />
          </label>

          <label className="field">
            <span className="fieldLabel">Kd</span>
            <input
              className="fieldInput"
              type="number"
              step="0.01"
              value={pid.kd}
              onChange={(e) => setField("kd", Number(e.target.value))}
            />
          </label>

          <label className="field">
            <span className="fieldLabel">Humidity Setpoint (%)</span>
            <input
              className="fieldInput"
              type="number"
              step="1"
              value={pid.setpointHumidityPct}
              onChange={(e) =>
                setField("setpointHumidityPct", clampNumber(Number(e.target.value), 0, 100))
              }
            />
          </label>

          <label className="field">
            <span className="fieldLabel">Temperature Setpoint (°C)</span>
            <input
              className="fieldInput"
              type="number"
              step="0.5"
              value={pid.setpointTempC}
              onChange={(e) => setField("setpointTempC", Number(e.target.value))}
            />
          </label>

          <label className="field">
            <span className="fieldLabel">Sample Time (ms)</span>
            <input
              className="fieldInput"
              type="number"
              step="100"
              value={pid.sampleTimeMs}
              onChange={(e) => setField("sampleTimeMs", clampNumber(Number(e.target.value), 100, 60000))}
            />
          </label>

          <label className="field">
            <span className="fieldLabel">Output Min</span>
            <input
              className="fieldInput"
              type="number"
              step="1"
              value={pid.outputLimit.min}
              onChange={(e) =>
                setField("outputLimit", {
                  ...pid.outputLimit,
                  min: Number(e.target.value),
                })
              }
            />
          </label>

          <label className="field">
            <span className="fieldLabel">Output Max</span>
            <input
              className="fieldInput"
              type="number"
              step="1"
              value={pid.outputLimit.max}
              onChange={(e) =>
                setField("outputLimit", {
                  ...pid.outputLimit,
                  max: Number(e.target.value),
                })
              }
            />
          </label>
        </div>

        <div className="noteBox">
          <div className="noteTitle">Next integration step</div>
          <div className="noteText">
            Wire these values to your backend/device control layer (BLE/serial), then stream sensor telemetry
            and log actuation commands for reproducible tuning.
          </div>
        </div>
      </div>
    </section>
  );
}
