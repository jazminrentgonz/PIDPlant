import { useMemo, useRef, useState } from "react";
import { BleClient, type Telemetry } from "../ble/bleClient";

const UUIDS = {
  service: "0000abcd-0000-1000-8000-00805f9b34fb",
  telemetryChar: "0000abce-0000-1000-8000-00805f9b34fb",
  commandChar: "0000abcf-0000-1000-8000-00805f9b34fb",
} as const;

export default function BlePanel({
  onTelemetry,
}: {
  onTelemetry: (t: Telemetry) => void;
}) {
  const clientRef = useRef<BleClient | null>(null);

  const client = useMemo(() => {
    const c = new BleClient(UUIDS);
    clientRef.current = c;
    return c;
  }, []);

  const [status, setStatus] = useState<
    "disconnected" | "connecting" | "connected" | "error"
  >("disconnected");
  const [errMsg, setErrMsg] = useState<string>("");

  async function connect() {
    setErrMsg("");
    setStatus("connecting");
    try {
      await client.connect((t) => onTelemetry(t));
      setStatus("connected");
    } catch (e) {
      setStatus("error");
      setErrMsg(e instanceof Error ? e.message : String(e));
    }
  }

  async function disconnect() {
    setErrMsg("");
    try {
      await client.disconnect();
      setStatus("disconnected");
    } catch (e) {
      setStatus("error");
      setErrMsg(e instanceof Error ? e.message : String(e));
    }
  }

  async function sendExampleCommand() {
    try {
      await client.sendCommand({ type: "setpoints", humidityPct: 65, tempC: 23 });
    } catch (e) {
      setStatus("error");
      setErrMsg(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <div className="panel">
      <div className="panelHeader">
        <div className="panelTitle">Bluetooth (BLE)</div>
        <div className="mutedSmall">Status: {status}</div>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {status !== "connected" ? (
          <button className="primaryButton" style={{ width: 220 }} onClick={connect}>
            Connect
          </button>
        ) : (
          <button className="dangerButton" onClick={disconnect}>
            Disconnect
          </button>
        )}

        <button className="ghostButton" onClick={sendExampleCommand}>
          Send test command
        </button>
      </div>

      {errMsg ? (
        <div className="noteBox" style={{ marginTop: 12, borderColor: "rgba(255,107,107,0.35)" }}>
          <div className="noteTitle">BLE error</div>
          <div className="noteText">{errMsg}</div>
        </div>
      ) : null}

      <div className="mutedSmall" style={{ marginTop: 10 }}>
        Web Bluetooth works best in Chrome/Edge on desktop. iOS Safari does not support it.
      </div>
    </div>
  );
}
