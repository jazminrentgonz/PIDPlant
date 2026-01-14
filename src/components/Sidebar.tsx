import type { ViewKey } from "../types";

export default function Sidebar({
  active,
  onNavigate,
}: {
  active: ViewKey;
  onNavigate: (v: ViewKey) => void;
}) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brandMark" aria-hidden="true">⟡</div>
        <div className="brandText">PID Plant Incubator</div>
      </div>

      <nav className="nav">
        <button
          className={active === "dashboard" ? "navItem active" : "navItem"}
          onClick={() => onNavigate("dashboard")}
        >
          <span className="navIcon">⟲</span>
          <span>My Dashboard</span>
        </button>

        <button
          className={active === "plantDatabase" ? "navItem active" : "navItem"}
          onClick={() => onNavigate("plantDatabase")}
        >
          <span className="navIcon">⛁</span>
          <span>Plant Database</span>
        </button>

        <button
          className={active === "controlSettings" ? "navItem active" : "navItem"}
          onClick={() => onNavigate("controlSettings")}
        >
          <span className="navIcon">⚙</span>
          <span>Control Settings</span>
        </button>
      </nav>

      <div className="sidebarFooter">
        <div className="mutedSmall">Local prototype UI</div>
      </div>
    </aside>
  );
}
