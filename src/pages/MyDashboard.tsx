import { useState } from "react";
import BlePanel from "../components/BlePanel";
import type { Telemetry } from "../ble/bleClient";
import type { PlantProfile } from "../types";

export default function MyDashboard({
  myPlants,
  onRemove,
  onClear,
}: {
  myPlants: PlantProfile[];
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  const [telemetry, setTelemetry] = useState<Telemetry | null>(null);

  return (
    <section>
      <h1 className="pageTitle">My Dashboard</h1>
      <p className="pageSubtitle">Your current incubator plant collection and device status.</p>

      {/* BLE connection + telemetry ingestion */}
      <BlePanel onTelemetry={(t) => setTelemetry(t)} />

      {/* Telemetry display */}
      <div className="panel" style={{ marginTop: 14 }}>
        <div className="panelHeader">
          <div className="panelTitle">Live Telemetry</div>
        </div>

        {telemetry ? (
          <div className="list">
            <div className="listRow">
              <div className="listMain">
                <div className="listTitle">Temperature</div>
                <div className="mutedSmall">{telemetry.tempC.toFixed(2)} °C</div>
              </div>
            </div>

            <div className="listRow">
              <div className="listMain">
                <div className="listTitle">Humidity</div>
                <div className="mutedSmall">{telemetry.humidityPct.toFixed(2)} %</div>
              </div>
            </div>

            {telemetry.actuatorPct != null ? (
              <div className="listRow">
                <div className="listMain">
                  <div className="listTitle">Actuator Output</div>
                  <div className="mutedSmall">{telemetry.actuatorPct.toFixed(0)} %</div>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="emptyState">
            <div className="emptyTitle">No telemetry yet.</div>
            <div className="mutedSmall">Connect via BLE and enable notifications.</div>
          </div>
        )}
      </div>

      {/* Existing My Plants panel */}
      <div className="panel" style={{ marginTop: 14 }}>
        <div className="panelHeader">
          <div className="panelTitle">My Plants</div>
          <button
            className={myPlants.length ? "ghostButton" : "ghostButton disabled"}
            onClick={onClear}
            disabled={!myPlants.length}
          >
            Clear All
          </button>
        </div>

        {myPlants.length === 0 ? (
          <div className="emptyState">
            <div className="emptyTitle">No plants added yet.</div>
            <div className="mutedSmall">Go to Plant Database and add profiles.</div>
          </div>
        ) : (
          <div className="list">
            {myPlants.map((p) => (
              <div className="listRow" key={p.id}>
                <div className="listMain">
                  <div className="listTitle">
                    {p.scientificName ? `${p.name} (${p.scientificName})` : p.name}
                  </div>
                  <div className="mutedSmall">
                    {p.type} • {p.idealTempC.min}–{p.idealTempC.max}°C
                  </div>
                </div>
                <button className="dangerButton" onClick={() => onRemove(p.id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
