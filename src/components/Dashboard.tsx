import { useEffect, useMemo } from "react";
import { useApp } from "../app/store";
import { useSimLink, sim } from "../sim/bleSim";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function Dashboard() {
  const { telemetry, log, pushTelemetry, pid, setPID } = useApp();
  const { connected } = useSimLink();

  useEffect(() => {
    if (!connected) return;
    const off = sim.onNotify(pushTelemetry);
    return () => off();
  }, [connected, pushTelemetry]);

  const data = useMemo(() => {
    const n = log.length, stride = n > 1500 ? Math.ceil(n/1500) : 1;
    return log.filter((_,i)=>i%stride===0).map(r => ({
      t: (r.t_ms/1000).toFixed(1),
      Humidity: r.humid_pct,
      Output: r.u_pid
    }));
  }, [log]);

  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="stats bg-base-200 shadow rounded-box">
        <Kpi title="Humidity" value={fmt(telemetry?.humid_pct)} unit="%" />
        <Kpi title="Temperature" value={fmt(telemetry?.temp_C)} unit="°C" />
        <Kpi title="Light" value={fmt(telemetry?.lux)} unit="lux" />
        <Kpi title="PID Output" value={fmt(telemetry?.u_pid)} unit="0..1" />
      </div>

      {/* Chart */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title">Telemetry</h2>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="t" />
                <YAxis yAxisId="left" domain={[0,100]} />
                <YAxis yAxisId="right" orientation="right" domain={[0,1]} />
                <Tooltip /><Legend />
                <Line yAxisId="left" type="monotone" dataKey="Humidity" dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="Output" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* PID controls */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title">PID Tuning</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Num label="Setpoint (%)" val={pid.r_humid} on={(v)=>{ setPID({r_humid:v}); connected && sim.writePID({...pid, r_humid:v}); }} />
            <Num label="Kp"           val={pid.Kp}      on={(v)=>{ setPID({Kp:v});       connected && sim.writePID({...pid, Kp:v}); }} />
            <Num label="Ki"           val={pid.Ki}      on={(v)=>{ setPID({Ki:v});       connected && sim.writePID({...pid, Ki:v}); }} />
            <Num label="Kd"           val={pid.Kd}      on={(v)=>{ setPID({Kd:v});       connected && sim.writePID({...pid, Kd:v}); }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Kpi({title,value,unit}:{title:string;value:string;unit?:string}) {
  return (
    <div className="stat">
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
      {unit && <div className="stat-desc">{unit}</div>}
    </div>
  );
}
function Num({label,val,on}:{label:string;val:number;on:(v:number)=>void}) {
  return (
    <label className="form-control">
      <div className="label"><span className="label-text">{label}</span></div>
      <input type="number" className="input input-bordered" value={val}
             onChange={(e)=>on(parseFloat(e.target.value))}/>
    </label>
  );
}
const fmt = (x?: number) => x==null ? "—" : x.toFixed(1);
