export default function KpiCard({ title, value, unit }:{
  title: string; value: string; unit?: string;
}) {
  return (
    <div className="stat">
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
      {unit && <div className="stat-desc">{unit}</div>}
    </div>
  );
}
