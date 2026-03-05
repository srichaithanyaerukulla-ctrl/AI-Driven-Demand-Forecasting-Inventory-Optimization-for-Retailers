import { useState, useEffect } from "react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";

// ── Fonts ──────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&family=DM+Sans:wght@300;400;500&display=swap";
document.head.appendChild(fontLink);

// ── Design tokens ──────────────────────────────────────────────────────
const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0A0B0D; }

  .ss-root {
    --bg0: #0A0B0D;
    --bg1: #111318;
    --bg2: #181C24;
    --bg3: #1F2430;
    --line: #252B38;
    --amber: #F4A227;
    --amber-dim: rgba(244,162,39,.12);
    --amber-glow: rgba(244,162,39,.35);
    --green: #2ECC71;
    --red: #E74C3C;
    --blue: #3498DB;
    --muted: #4A5568;
    --text2: #8892A4;
    --text1: #C8D0DE;
    --text0: #EEF0F5;
    font-family: 'DM Sans', sans-serif;
    background: var(--bg0);
    color: var(--text1);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* Sidebar */
  .ss-shell { display: flex; flex: 1; overflow: hidden; height: 100vh; }
  .ss-sidebar {
    width: 220px; flex-shrink: 0;
    background: var(--bg1);
    border-right: 1px solid var(--line);
    display: flex; flex-direction: column;
    padding: 0;
  }
  .ss-logo {
    padding: 20px 20px 16px;
    border-bottom: 1px solid var(--line);
    display: flex; align-items: center; gap: 10px;
  }
  .ss-logo-mark {
    width: 32px; height: 32px; border-radius: 8px;
    background: var(--amber);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 16px;
    color: #0A0B0D; letter-spacing: -1px;
  }
  .ss-logo-text { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; color: var(--text0); letter-spacing: -.3px; }
  .ss-logo-sub { font-size: 10px; color: var(--muted); font-weight: 400; letter-spacing: .5px; text-transform: uppercase; }

  .ss-nav { flex: 1; padding: 12px 10px; display: flex; flex-direction: column; gap: 2px; }
  .ss-nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px; border-radius: 8px;
    cursor: pointer; font-size: 13.5px; font-weight: 500;
    color: var(--text2); transition: all .15s;
    position: relative;
  }
  .ss-nav-item:hover { background: var(--bg3); color: var(--text0); }
  .ss-nav-item.active { background: var(--amber-dim); color: var(--amber); }
  .ss-nav-item.active::before {
    content: ''; position: absolute; left: 0; top: 20%; bottom: 20%;
    width: 3px; background: var(--amber); border-radius: 0 2px 2px 0;
  }
  .ss-nav-icon { font-size: 15px; width: 18px; text-align: center; }
  .ss-nav-badge {
    margin-left: auto; background: var(--red); color: #fff;
    font-size: 10px; font-weight: 600; padding: 2px 6px;
    border-radius: 10px; font-family: 'IBM Plex Mono', monospace;
  }
  .ss-nav-section { font-size: 10px; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; padding: 14px 12px 4px; }

  .ss-sidebar-footer {
    padding: 14px 12px; border-top: 1px solid var(--line);
    font-size: 12px; color: var(--muted);
    display: flex; align-items: center; gap: 8px;
  }
  .ss-avatar {
    width: 28px; height: 28px; border-radius: 50%;
    background: linear-gradient(135deg, #3498DB, #9B59B6);
    font-size: 11px; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 600;
  }
  .ss-plan-badge {
    margin-left: auto; background: var(--amber-dim); color: var(--amber);
    font-size: 9px; font-weight: 700; padding: 2px 6px;
    border-radius: 4px; letter-spacing: .5px; text-transform: uppercase;
  }

  /* Main */
  .ss-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  .ss-topbar {
    height: 56px; border-bottom: 1px solid var(--line);
    display: flex; align-items: center; padding: 0 24px;
    gap: 16px; background: var(--bg1);
  }
  .ss-page-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 17px; color: var(--text0); }
  .ss-topbar-right { margin-left: auto; display: flex; align-items: center; gap: 12px; }
  .ss-horizon-picker { display: flex; gap: 4px; }
  .ss-horizon-btn {
    padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 600;
    cursor: pointer; transition: all .15s; border: 1px solid var(--line);
    background: transparent; color: var(--text2); font-family: 'IBM Plex Mono', monospace;
  }
  .ss-horizon-btn.active { background: var(--amber); color: #0A0B0D; border-color: var(--amber); }
  .ss-icon-btn {
    width: 34px; height: 34px; border-radius: 8px; border: 1px solid var(--line);
    background: var(--bg2); display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 14px; color: var(--text2); position: relative;
  }
  .ss-notif-dot {
    position: absolute; top: 5px; right: 5px; width: 7px; height: 7px;
    border-radius: 50%; background: var(--red); border: 1.5px solid var(--bg1);
  }

  .ss-content { flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 20px; }
  .ss-content::-webkit-scrollbar { width: 4px; }
  .ss-content::-webkit-scrollbar-track { background: transparent; }
  .ss-content::-webkit-scrollbar-thumb { background: var(--bg3); border-radius: 2px; }

  /* KPI Strip */
  .ss-kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
  .ss-kpi {
    background: var(--bg1); border: 1px solid var(--line); border-radius: 12px;
    padding: 18px 20px; position: relative; overflow: hidden;
  }
  .ss-kpi::after {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  }
  .ss-kpi.amber::after { background: var(--amber); }
  .ss-kpi.green::after { background: var(--green); }
  .ss-kpi.red::after { background: var(--red); }
  .ss-kpi.blue::after { background: var(--blue); }
  .ss-kpi-label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: .8px; margin-bottom: 8px; }
  .ss-kpi-val { font-family: 'IBM Plex Mono', monospace; font-size: 26px; font-weight: 600; color: var(--text0); line-height: 1; }
  .ss-kpi-delta { font-size: 11.5px; margin-top: 6px; display: flex; align-items: center; gap: 4px; }
  .ss-kpi-delta.up { color: var(--green); }
  .ss-kpi-delta.down { color: var(--red); }
  .ss-kpi-delta.neutral { color: var(--muted); }
  .ss-kpi-sparkline { margin-top: 12px; opacity: .7; }

  /* Grid layout */
  .ss-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .ss-grid-3-1 { display: grid; grid-template-columns: 2fr 1fr; gap: 14px; }

  /* Cards */
  .ss-card {
    background: var(--bg1); border: 1px solid var(--line); border-radius: 12px;
    padding: 20px;
  }
  .ss-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
  .ss-card-title { font-family: 'Syne', sans-serif; font-weight: 600; font-size: 14px; color: var(--text0); }
  .ss-card-action { font-size: 11.5px; color: var(--amber); cursor: pointer; }

  /* Alert items */
  .ss-alert-list { display: flex; flex-direction: column; gap: 8px; }
  .ss-alert-item {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 14px; border-radius: 9px; border: 1px solid transparent;
    cursor: pointer; transition: background .15s;
  }
  .ss-alert-item:hover { background: var(--bg2); }
  .ss-alert-item.critical { border-color: rgba(231,76,60,.3); background: rgba(231,76,60,.04); }
  .ss-alert-item.warning { border-color: rgba(244,162,39,.2); background: rgba(244,162,39,.04); }
  .ss-alert-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .ss-alert-dot.critical { background: var(--red); box-shadow: 0 0 6px var(--red); }
  .ss-alert-dot.warning { background: var(--amber); box-shadow: 0 0 6px var(--amber-glow); }
  .ss-alert-dot.ok { background: var(--green); }
  .ss-alert-name { font-size: 13px; font-weight: 500; color: var(--text0); flex: 1; }
  .ss-alert-days { font-family: 'IBM Plex Mono', monospace; font-size: 11px; }
  .ss-alert-days.critical { color: var(--red); }
  .ss-alert-days.warning { color: var(--amber); }
  .ss-alert-cta {
    font-size: 11px; padding: 4px 10px; border-radius: 5px;
    border: 1px solid var(--amber); color: var(--amber); cursor: pointer;
    transition: all .15s; white-space: nowrap;
  }
  .ss-alert-cta:hover { background: var(--amber); color: #0A0B0D; }

  /* Table */
  .ss-table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
  .ss-table th { 
    text-align: left; padding: 8px 12px; color: var(--muted);
    font-size: 10px; text-transform: uppercase; letter-spacing: .7px;
    border-bottom: 1px solid var(--line); font-weight: 500;
  }
  .ss-table td { padding: 10px 12px; border-bottom: 1px solid rgba(37,43,56,.5); }
  .ss-table tr:last-child td { border-bottom: none; }
  .ss-table tr:hover td { background: var(--bg2); }
  .ss-mono { font-family: 'IBM Plex Mono', monospace; }
  .ss-pill {
    display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 10.5px; font-weight: 600;
  }
  .ss-pill.green { background: rgba(46,204,113,.15); color: var(--green); }
  .ss-pill.red { background: rgba(231,76,60,.15); color: var(--red); }
  .ss-pill.amber { background: var(--amber-dim); color: var(--amber); }
  .ss-pill.blue { background: rgba(52,152,219,.15); color: var(--blue); }

  /* Progress bars */
  .ss-bar-wrap { background: var(--bg3); border-radius: 3px; height: 5px; overflow: hidden; }
  .ss-bar-fill { height: 100%; border-radius: 3px; transition: width .6s ease; }

  /* Model accuracy widget */
  .ss-model-row { display: flex; align-items: center; gap: 12px; padding: 8px 0; border-bottom: 1px solid var(--line); }
  .ss-model-row:last-child { border-bottom: none; }
  .ss-model-name { font-size: 12px; color: var(--text1); width: 120px; flex-shrink: 0; }
  .ss-model-bar-wrap { flex: 1; }
  .ss-model-pct { font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 600; width: 42px; text-align: right; flex-shrink: 0; }

  /* Custom tooltip */
  .ss-tooltip {
    background: var(--bg0); border: 1px solid var(--line);
    border-radius: 8px; padding: 10px 14px; font-size: 12px;
  }
  .ss-tooltip-label { color: var(--muted); margin-bottom: 4px; font-size: 11px; }
  .ss-tooltip-val { font-family: 'IBM Plex Mono', monospace; font-weight: 600; color: var(--text0); }

  /* Upload zone */
  .ss-upload-zone {
    border: 2px dashed var(--line); border-radius: 10px;
    padding: 32px; text-align: center; cursor: pointer;
    transition: all .2s;
  }
  .ss-upload-zone:hover { border-color: var(--amber); background: var(--amber-dim); }
  .ss-upload-icon { font-size: 28px; margin-bottom: 10px; }
  .ss-upload-text { font-size: 13px; color: var(--text2); }
  .ss-upload-subtext { font-size: 11px; color: var(--muted); margin-top: 4px; }

  /* Chip row */
  .ss-chips { display: flex; gap: 6px; flex-wrap: wrap; }
  .ss-chip {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 20px; font-size: 11.5px;
    border: 1px solid var(--line); color: var(--text2); cursor: pointer;
    transition: all .15s;
  }
  .ss-chip.active { border-color: var(--amber); background: var(--amber-dim); color: var(--amber); }

  /* Status bar bottom */
  .ss-statusbar {
    height: 26px; background: var(--bg1); border-top: 1px solid var(--line);
    display: flex; align-items: center; padding: 0 24px; gap: 20px;
    font-size: 10.5px; color: var(--muted); font-family: 'IBM Plex Mono', monospace;
  }
  .ss-status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); display: inline-block; margin-right: 5px; }

  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
  .ss-pulse { animation: pulse 2s infinite; }
  @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  .ss-fade { animation: fadeIn .3s ease forwards; }
`;

const styleEl = document.createElement("style");
styleEl.textContent = css;
document.head.appendChild(styleEl);

// ── Data ───────────────────────────────────────────────────────────────
const forecastData = [
  { d: "Feb 10", actual: 142, forecast: null, lo: null, hi: null },
  { d: "Feb 17", actual: 158, forecast: null, lo: null, hi: null },
  { d: "Feb 24", actual: 171, forecast: null, lo: null, hi: null },
  { d: "Mar 3",  actual: 163, forecast: 163, lo: 150, hi: 176 },
  { d: "Mar 10", actual: null, forecast: 179, lo: 161, hi: 197 },
  { d: "Mar 17", actual: null, forecast: 188, lo: 165, hi: 211 },
  { d: "Mar 24", actual: null, forecast: 195, lo: 168, hi: 222 },
  { d: "Mar 31", actual: null, forecast: 204, lo: 173, hi: 235 },
];

const sparkData = [
  [3,5,4,7,6,8,9],
  [8,6,7,5,9,8,10],
  [2,4,3,5,4,6,5],
  [9,8,10,7,9,11,10],
];

const inventoryTable = [
  { sku: "SKU-0042", name: "Running Shoes Pro X", stock: 23, reorder: 30, forecast: 89, days: 3, status: "critical", action: "Order Now" },
  { sku: "SKU-0118", name: "Yoga Mat Premium", stock: 67, reorder: 40, forecast: 120, days: 8, status: "warning", action: "Reorder Soon" },
  { sku: "SKU-0205", name: "Water Bottle 32oz", stock: 210, reorder: 60, forecast: 95, days: 31, status: "ok", action: "Monitor" },
  { sku: "SKU-0331", name: "Compression Socks 3-pk", stock: 15, reorder: 25, forecast: 68, days: 4, status: "critical", action: "Order Now" },
  { sku: "SKU-0447", name: "Foam Roller Standard", stock: 88, reorder: 35, forecast: 42, days: 29, status: "ok", action: "Monitor" },
  { sku: "SKU-0512", name: "Resistance Band Set", stock: 41, reorder: 45, forecast: 73, days: 7, status: "warning", action: "Reorder Soon" },
];

const slowMovers = [
  { name: "Leg Press Attachment", days: 94, value: "$4,230", rec: "Discount 20%" },
  { name: "Squat Rack Pad XL", days: 71, value: "$2,100", rec: "Bundle Deal" },
  { name: "Jump Rope Speed", days: 62, value: "$840", rec: "Flash Sale" },
];

const modelAccuracy = [
  { name: "Prophet (Meta)", pct: 91, color: "#F4A227" },
  { name: "LSTM Neural Net", pct: 88, color: "#3498DB" },
  { name: "ARIMA/SARIMA", pct: 84, color: "#9B59B6" },
  { name: "XGBoost Ensemble", pct: 93, color: "#2ECC71" },
];

const categoryPerf = [
  { cat: "Footwear", acc: 89 }, { cat: "Apparel", acc: 92 },
  { cat: "Equipment", acc: 85 }, { cat: "Accessories", acc: 94 },
  { cat: "Nutrition", acc: 87 },
];

// ── Sub-components ─────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="ss-tooltip">
      <div className="ss-tooltip-label">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="ss-tooltip-val" style={{ color: p.color }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
};

const Spark = ({ data, color }) => (
  <ResponsiveContainer width="100%" height={34}>
    <AreaChart data={data.map((v, i) => ({ v, i }))} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
      <defs>
        <linearGradient id={`sg-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#sg-${color})`} dot={false} />
    </AreaChart>
  </ResponsiveContainer>
);

// ── Pages ──────────────────────────────────────────────────────────────
const DashboardPage = ({ horizon }) => (
  <div className="ss-fade">
    {/* KPIs */}
    <div className="ss-kpi-row">
      {[
        { label: "Forecast Accuracy", val: "91.4%", delta: "+2.1% vs last month", dir: "up", color: "amber", spark: sparkData[0] },
        { label: "Stockout Risk", val: "4 SKUs", delta: "↑ 2 from yesterday", dir: "down", color: "red", spark: sparkData[1] },
        { label: "Inv. Turnover Rate", val: "6.2×", delta: "On target (6.0×)", dir: "neutral", color: "green", spark: sparkData[2] },
        { label: "Reorder Actions", val: "11", delta: "3 critical priority", dir: "down", color: "blue", spark: sparkData[3] },
      ].map((k, i) => (
        <div className={`ss-kpi ${k.color}`} key={i}>
          <div className="ss-kpi-label">{k.label}</div>
          <div className="ss-kpi-val">{k.val}</div>
          <div className={`ss-kpi-delta ${k.dir}`}>{k.delta}</div>
          <div className="ss-kpi-sparkline">
            <Spark data={k.spark} color={k.color === "amber" ? "#F4A227" : k.color === "red" ? "#E74C3C" : k.color === "green" ? "#2ECC71" : "#3498DB"} />
          </div>
        </div>
      ))}
    </div>

    {/* Forecast chart + Alerts */}
    <div className="ss-grid-3-1">
      <div className="ss-card">
        <div className="ss-card-header">
          <div>
            <div className="ss-card-title">Demand Forecast — Running Shoes Pro X</div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>
              {horizon}-day horizon · Ensemble model · 91% confidence
            </div>
          </div>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--text2)" }}>
              <div style={{ width: 24, height: 2, background: "#F4A227" }} /> Forecast
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--text2)" }}>
              <div style={{ width: 24, height: 2, background: "#3498DB" }} /> Actual
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--text2)" }}>
              <div style={{ width: 12, height: 12, background: "rgba(244,162,39,.2)", borderRadius: 2 }} /> CI 95%
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={forecastData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="fcast-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F4A227" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#F4A227" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2430" vertical={false} />
            <XAxis dataKey="d" tick={{ fontSize: 10, fill: "#4A5568" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#4A5568" }} axisLine={false} tickLine={false} width={32} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x="Mar 3" stroke="#252B38" strokeDasharray="4 4" label={{ value: "Today", fill: "#4A5568", fontSize: 10, position: "top" }} />
            <Area type="monotone" dataKey="hi" stroke="none" fill="rgba(244,162,39,.12)" />
            <Area type="monotone" dataKey="lo" stroke="none" fill="var(--bg1)" />
            <Line type="monotone" dataKey="actual" stroke="#3498DB" strokeWidth={2} dot={{ fill: "#3498DB", r: 3 }} connectNulls />
            <Line type="monotone" dataKey="forecast" stroke="#F4A227" strokeWidth={2} strokeDasharray="5 3" dot={{ fill: "#F4A227", r: 3 }} connectNulls />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="ss-card">
        <div className="ss-card-header">
          <div className="ss-card-title">⚡ Priority Alerts</div>
          <span className="ss-card-action">View All →</span>
        </div>
        <div className="ss-alert-list">
          {[
            { name: "Running Shoes Pro X", days: "3 days", status: "critical", label: "CRITICAL" },
            { name: "Compression Socks", days: "4 days", status: "critical", label: "CRITICAL" },
            { name: "Yoga Mat Premium", days: "8 days", status: "warning", label: "WARNING" },
            { name: "Resistance Band Set", days: "7 days", status: "warning", label: "WARNING" },
          ].map((a, i) => (
            <div className={`ss-alert-item ${a.status}`} key={i}>
              <div className={`ss-alert-dot ${a.status} ${a.status === "critical" ? "ss-pulse" : ""}`} />
              <div className="ss-alert-name">{a.name}</div>
              <div className={`ss-alert-days ${a.status}`}>{a.days}</div>
              <button className="ss-alert-cta">Order</button>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, padding: "10px 12px", background: "var(--bg2)", borderRadius: 8, fontSize: 11.5, color: "var(--text2)", lineHeight: 1.6 }}>
          <span style={{ color: "var(--amber)", fontWeight: 600 }}>AI Insight: </span>
          Footwear demand trending +18% this week. Recommend increasing safety stock by 2 weeks ahead of spring season.
        </div>
      </div>
    </div>

    {/* Inventory table */}
    <div className="ss-card">
      <div className="ss-card-header">
        <div className="ss-card-title">Inventory Status & Reorder Queue</div>
        <div style={{ display: "flex", gap: 8 }}>
          <div className="ss-chips">
            {["All", "Critical", "Warning", "Healthy"].map((c, i) => (
              <div className={`ss-chip ${i === 0 ? "active" : ""}`} key={i}>{c}</div>
            ))}
          </div>
        </div>
      </div>
      <table className="ss-table">
        <thead>
          <tr>
            <th>SKU</th><th>Product</th><th>Stock</th><th>Reorder Point</th>
            <th>30-Day Forecast</th><th>Days Left</th><th>Status</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {inventoryTable.map((r, i) => (
            <tr key={i}>
              <td className="ss-mono" style={{ color: "var(--muted)", fontSize: 11 }}>{r.sku}</td>
              <td style={{ fontWeight: 500, color: "var(--text0)" }}>{r.name}</td>
              <td className="ss-mono">{r.stock}</td>
              <td className="ss-mono" style={{ color: "var(--muted)" }}>{r.reorder}</td>
              <td className="ss-mono">{r.forecast}</td>
              <td>
                <span className={`ss-pill ${r.status === "critical" ? "red" : r.status === "warning" ? "amber" : "green"}`}>
                  {r.days}d
                </span>
              </td>
              <td>
                <span className={`ss-pill ${r.status === "critical" ? "red" : r.status === "warning" ? "amber" : "green"}`}>
                  {r.status}
                </span>
              </td>
              <td>
                <button style={{
                  padding: "4px 10px", borderRadius: 5, fontSize: 11, cursor: "pointer",
                  background: r.status === "critical" ? "rgba(231,76,60,.15)" : r.status === "warning" ? "var(--amber-dim)" : "transparent",
                  color: r.status === "critical" ? "var(--red)" : r.status === "warning" ? "var(--amber)" : "var(--muted)",
                  border: `1px solid ${r.status === "critical" ? "rgba(231,76,60,.4)" : r.status === "warning" ? "rgba(244,162,39,.4)" : "var(--line)"}`,
                }}>{r.action}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ForecastPage = () => (
  <div className="ss-fade">
    <div className="ss-grid-2">
      <div className="ss-card">
        <div className="ss-card-header">
          <div className="ss-card-title">Model Accuracy by Algorithm</div>
        </div>
        {modelAccuracy.map((m, i) => (
          <div className="ss-model-row" key={i}>
            <div className="ss-model-name">{m.name}</div>
            <div className="ss-model-bar-wrap">
              <div className="ss-bar-wrap">
                <div className="ss-bar-fill" style={{ width: `${m.pct}%`, background: m.color }} />
              </div>
            </div>
            <div className="ss-model-pct" style={{ color: m.color }}>{m.pct}%</div>
          </div>
        ))}
      </div>
      <div className="ss-card">
        <div className="ss-card-header">
          <div className="ss-card-title">Accuracy by Category</div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={categoryPerf} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2430" vertical={false} />
            <XAxis dataKey="cat" tick={{ fontSize: 10, fill: "#4A5568" }} axisLine={false} tickLine={false} />
            <YAxis domain={[80, 100]} tick={{ fontSize: 10, fill: "#4A5568" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="acc" fill="#F4A227" radius={[4, 4, 0, 0]} opacity={0.85} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div className="ss-card">
      <div className="ss-card-header">
        <div className="ss-card-title">Slow-Moving Inventory</div>
        <span className="ss-card-action">Export CSV →</span>
      </div>
      <table className="ss-table">
        <thead>
          <tr><th>Product</th><th>Days Without Sale</th><th>Capital Tied Up</th><th>AI Recommendation</th><th></th></tr>
        </thead>
        <tbody>
          {slowMovers.map((s, i) => (
            <tr key={i}>
              <td style={{ fontWeight: 500, color: "var(--text0)" }}>{s.name}</td>
              <td className="ss-mono" style={{ color: "var(--red)" }}>{s.days} days</td>
              <td className="ss-mono" style={{ color: "var(--amber)" }}>{s.value}</td>
              <td><span className="ss-pill amber">{s.rec}</span></td>
              <td><button style={{ background: "transparent", border: "1px solid var(--line)", color: "var(--text2)", padding: "4px 10px", borderRadius: 5, fontSize: 11, cursor: "pointer" }}>Apply</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const DataPage = () => (
  <div className="ss-fade">
    <div className="ss-grid-2">
      <div className="ss-card">
        <div className="ss-card-header">
          <div className="ss-card-title">Upload Sales Data</div>
        </div>
        <div className="ss-upload-zone">
          <div className="ss-upload-icon">📂</div>
          <div className="ss-upload-text">Drag & drop CSV file or click to browse</div>
          <div className="ss-upload-subtext">Max 50MB · Required: product_id, date, quantity, price</div>
        </div>
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { name: "sales_jan_feb_2025.csv", rows: "12,440 rows", status: "ok" },
            { name: "inventory_snapshot.csv", rows: "3,201 rows", status: "ok" },
            { name: "products_catalog.csv", rows: "847 rows", status: "warning" },
          ].map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "var(--bg2)", borderRadius: 7, fontSize: 12 }}>
              <span>📄</span>
              <span style={{ flex: 1, color: "var(--text1)" }}>{f.name}</span>
              <span style={{ color: "var(--muted)" }} className="ss-mono">{f.rows}</span>
              <span className={`ss-pill ${f.status === "ok" ? "green" : "amber"}`}>{f.status === "ok" ? "✓ Valid" : "⚠ Review"}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="ss-card">
        <div className="ss-card-header">
          <div className="ss-card-title">Data Health Report</div>
        </div>
        {[
          { label: "Records Imported", val: "15,641", color: "var(--green)" },
          { label: "Date Range", val: "Jan 1 – Mar 3, 2025", color: "var(--text0)" },
          { label: "Unique SKUs", val: "284", color: "var(--text0)" },
          { label: "Duplicate Rows", val: "23 (auto-removed)", color: "var(--amber)" },
          { label: "Missing Values", val: "0.4%", color: "var(--green)" },
          { label: "Forecast Readiness", val: "277 / 284 SKUs", color: "var(--green)" },
        ].map((r, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid var(--line)", fontSize: 12.5 }}>
            <span style={{ color: "var(--text2)" }}>{r.label}</span>
            <span className="ss-mono" style={{ color: r.color, fontWeight: 600 }}>{r.val}</span>
          </div>
        ))}
        <div style={{ marginTop: 14, padding: "10px 12px", background: "var(--amber-dim)", borderRadius: 7, fontSize: 11.5, color: "var(--amber)", lineHeight: 1.6, border: "1px solid rgba(244,162,39,.2)" }}>
          ⚠ 7 SKUs have &lt;90 days of data. Forecasts will use ensemble fallback with lower confidence.
        </div>
      </div>
    </div>
  </div>
);

const navItems = [
  { id: "dashboard", icon: "◈", label: "Dashboard", badge: null },
  { id: "forecast",  icon: "◉", label: "Forecasts",  badge: null },
  { id: "data",      icon: "⊞", label: "Data Upload", badge: null },
];

// ── Root ───────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [horizon, setHorizon] = useState(14);
  const [time, setTime] = useState(new Date().toLocaleTimeString("en-US", { hour12: false }));

  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString("en-US", { hour12: false })), 1000);
    return () => clearInterval(t);
  }, []);

  const pageTitles = { dashboard: "Overview Dashboard", forecast: "Forecasting & Analytics", data: "Data Management" };

  return (
    <div className="ss-root">
      <div className="ss-shell">
        {/* Sidebar */}
        <aside className="ss-sidebar">
          <div className="ss-logo">
            <div className="ss-logo-mark">SS</div>
            <div>
              <div className="ss-logo-text">StockSense</div>
              <div className="ss-logo-sub">Demand Intelligence</div>
            </div>
          </div>

          <nav className="ss-nav">
            <div className="ss-nav-section">Core</div>
            {navItems.map(n => (
              <div key={n.id} className={`ss-nav-item ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>
                <span className="ss-nav-icon">{n.icon}</span>
                {n.label}
                {n.badge && <span className="ss-nav-badge">{n.badge}</span>}
              </div>
            ))}
            <div className="ss-nav-section">Alerts</div>
            <div className="ss-nav-item">
              <span className="ss-nav-icon">◎</span>
              Notifications
              <span className="ss-nav-badge">4</span>
            </div>
            <div className="ss-nav-section">Settings</div>
            <div className="ss-nav-item"><span className="ss-nav-icon">⚙</span> Configuration</div>
            <div className="ss-nav-item"><span className="ss-nav-icon">⊗</span> Integrations</div>
            <div className="ss-nav-item"><span className="ss-nav-icon">↗</span> API & Export</div>
          </nav>

          <div className="ss-sidebar-footer">
            <div className="ss-avatar">JS</div>
            <div>
              <div style={{ color: "var(--text1)", fontWeight: 500, fontSize: 12 }}>Jamie S.</div>
              <div style={{ fontSize: 10 }}>Store Manager</div>
            </div>
            <div className="ss-plan-badge">Pro</div>
          </div>
        </aside>

        {/* Main area */}
        <div className="ss-main">
          <header className="ss-topbar">
            <div className="ss-page-title">{pageTitles[page]}</div>
            <div className="ss-topbar-right">
              {page === "dashboard" && (
                <div className="ss-horizon-picker">
                  {[7, 14, 30].map(h => (
                    <button key={h} className={`ss-horizon-btn ${horizon === h ? "active" : ""}`} onClick={() => setHorizon(h)}>
                      {h}d
                    </button>
                  ))}
                </div>
              )}
              <div className="ss-icon-btn">
                🔔
                <div className="ss-notif-dot" />
              </div>
              <div className="ss-icon-btn">⤓</div>
            </div>
          </header>

          <div className="ss-content">
            {page === "dashboard" && <DashboardPage horizon={horizon} />}
            {page === "forecast"  && <ForecastPage />}
            {page === "data"      && <DataPage />}
          </div>
        </div>
      </div>

      <footer className="ss-statusbar">
        <span><span className="ss-status-dot" />All systems operational</span>
        <span>Last forecast run: 2h ago</span>
        <span>Models: 284 active</span>
        <span style={{ marginLeft: "auto" }}>UTC {time}</span>
      </footer>
    </div>
  );
}
