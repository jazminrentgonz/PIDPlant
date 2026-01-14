export default function Topbar({
  title,
  theme,
  onToggleTheme,
}: {
  title: string;
  theme: "dark" | "light";
  onToggleTheme: () => void;
}) {
  return (
    <header className="topbar">
      <div className="topbarTitle">{title}</div>
      <div className="topbarActions">
        <button className="iconButton" onClick={onToggleTheme} title="Toggle theme">
          {theme === "dark" ? "☾" : "☀"}
        </button>
      </div>
    </header>
  );
}
