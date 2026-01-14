import { useEffect, useState } from "react";
import { useSimLink, sim } from "../sim/bleSim";

export default function Toolbar() {
  const { connected, connect, disconnect } = useSimLink();
  const [theme, setTheme] = useState("emerald");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <select className="select select-bordered"
              value={theme} onChange={(e)=>setTheme(e.target.value)}>
        <option value="emerald">emerald</option>
        <option value="dark">dark</option>
        <option value="light">light</option>
      </select>

      {!connected ? (
        <button className="btn btn-primary" onClick={() => { connect(); sim.start(); }}>
          Connect (Sim)
        </button>
      ) : (
        <button className="btn" onClick={() => { disconnect(); sim.stop(); }}>
          Disconnect
        </button>
      )}
    </div>
  );
}
