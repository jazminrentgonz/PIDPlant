import { useEffect, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import PlantDatabase from "./pages/PlantDatabase";
import MyDashboard from "./pages/MyDashboard";
import ControlSettings from "./pages/ControlSettings";
import type { PlantProfile, PIDSettings, ViewKey } from "./types";
import {
  loadMyPlants,
  saveMyPlants,
  loadPIDSettings,
  savePIDSettings,
  loadTheme,
  saveTheme,
} from "./storage";
import { PLANTS } from "./data/plants";

export default function App() {
  const [view, setView] = useState<ViewKey>("plantDatabase");

  const [myPlants, setMyPlants] = useState<PlantProfile[]>(() => loadMyPlants());
  const [pid, setPid] = useState<PIDSettings>(() => loadPIDSettings());
  const [theme, setTheme] = useState<"dark" | "light">(() => loadTheme());

  useEffect(() => saveMyPlants(myPlants), [myPlants]);
  useEffect(() => savePIDSettings(pid), [pid]);
  useEffect(() => saveTheme(theme), [theme]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const myPlantIds = useMemo(() => new Set(myPlants.map((p) => p.id)), [myPlants]);

  function addPlant(p: PlantProfile) {
    if (myPlantIds.has(p.id)) return;
    setMyPlants((prev) => [...prev, p]);
  }

  function removePlant(id: string) {
    setMyPlants((prev) => prev.filter((p) => p.id !== id));
  }

  function clearPlants() {
    setMyPlants([]);
  }

  const content = (() => {
    switch (view) {
      case "dashboard":
        return (
          <MyDashboard
            myPlants={myPlants}
            onRemove={removePlant}
            onClear={clearPlants}
          />
        );
      case "controlSettings":
        return <ControlSettings pid={pid} onChange={setPid} />;
      case "plantDatabase":
      default:
        return (
          <PlantDatabase
            plants={PLANTS}
            myPlantIds={myPlantIds}
            onAdd={addPlant}
          />
        );
    }
  })();

  return (
    <div className="appShell">
      <Sidebar active={view} onNavigate={setView} />
      <div className="mainArea">
        <Topbar
          title="PID Plant Incubator"
          theme={theme}
          onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        />
        <main className="content">{content}</main>
      </div>
    </div>
  );
}
