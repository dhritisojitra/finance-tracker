import { useState, useEffect, useRef } from "react";

// ── Data ──────────────────────────────────────────────────────────────────────
const categories = [
  { label: "Cafe & Restaurants", amount: 1400, color: "#16a34a" },   // green-600
  { label: "Entertainment",      amount: 980,  color: "#4ade80" },   // green-400
  { label: "Investments",        amount: 1200, color: "#bbf7d0" },   // green-200
  { label: "Food & Groceries",   amount: 870,  color: "#166534" },   // green-900
  { label: "Health & Beauty",    amount: 400,  color: "#15803d" },   // green-700
  { label: "Traveling",          amount: 1100, color: "#86efac" },   // green-300
];

const total = categories.reduce((s, c) => s + c.amount, 0);

// ── SVG Donut helpers ─────────────────────────────────────────────────────────
const cx = 100, cy = 100, r = 80, strokeW = 22;
const circumference = 2 * Math.PI * r;

function polarToXY(pct, radius) {
  const angle = pct * 2 * Math.PI - Math.PI / 2;
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
}

// Build arc path for each slice
function buildArcs(items) {
  let cumulative = 0;
  return items.map((item) => {
    const pct = item.amount / total;
    const startAngle = cumulative * 2 * Math.PI - Math.PI / 2;
    const endAngle   = (cumulative + pct) * 2 * Math.PI - Math.PI / 2;
    const largeArc   = pct > 0.5 ? 1 : 0;

    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);

    // mid-point of arc for tooltip anchor
    const midPct = cumulative + pct / 2;
    const tipAngle = midPct * 2 * Math.PI - Math.PI / 2;
    const tipR = r + strokeW / 2 + 18;
    const tipX = cx + tipR * Math.cos(tipAngle);
    const tipY = cy + tipR * Math.sin(tipAngle);

    const d = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
    cumulative += pct;
    return { ...item, d, pct, tipX, tipY };
  });
}

const arcs = buildArcs(categories);

// ── Animated number ───────────────────────────────────────────────────────────
function AnimNum({ value }) {
  const [disp, setDisp] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 900, step = 14;
    const inc = value / (duration / step);
    const timer = setInterval(() => {
      start += inc;
      if (start >= value) { setDisp(value); clearInterval(timer); }
      else setDisp(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [value]);
  return <>{disp.toLocaleString("en-US")}</>;
}

// ── Main component ────────────────────────────────────────────────────────────
export default function BudgetCard() {
  const [hovered, setHovered]   = useState(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 120);
    return () => clearTimeout(t);
  }, []);

  const hoveredArc = hovered !== null ? arcs[hovered] : null;

  return (
    <div className="w-full bg-gradient-to-br from-green-50 via-emerald-50 to-slate-100 p-4 sm:p-8">
      <div className="w-full max-w-sm sm:max-w-md">

        {/* Card */}
        <div className="bg-white rounded-3xl border border-green-100 shadow-xl shadow-green-100/60 p-6">

          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Budget</h2>
            <button className="w-9 h-9 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all hover:scale-105 active:scale-95">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7M7 7h10v10" />
              </svg>
            </button>
          </div>

          {/* Body: legend + donut */}
          <div className="flex items-center gap-4">

            {/* Legend */}
            <ul className="flex-1 space-y-2.5 min-w-0">
              {categories.map((cat, i) => (
                <li
                  key={cat.label}
                  className="flex items-center gap-2.5 cursor-pointer group"
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0 transition-transform duration-200 group-hover:scale-125"
                    style={{ background: cat.color }}
                  />
                  <span
                    className="text-xs sm:text-sm truncate transition-colors duration-200"
                    style={{ color: hovered === i ? cat.color : "#64748b" }}
                  >
                    {cat.label}
                  </span>
                </li>
              ))}
            </ul>

            {/* Donut */}
            <div className="relative flex-shrink-0" style={{ width: 200, height: 200 }}>
              <svg
                viewBox="0 0 200 200"
                width="200"
                height="200"
                style={{ overflow: "visible" }}
              >
                {/* Track ring */}
                <circle
                  cx={cx} cy={cy} r={r}
                  fill="none"
                  stroke="#f0fdf4"
                  strokeWidth={strokeW}
                />

                {/* Slices */}
                {arcs.map((arc, i) => {
                  const isHov = hovered === i;
                  const dashLen = animated ? arc.pct * circumference : 0;
                  const dashOff = circumference - dashLen;

                  // Compute strokeDashoffset to animate each slice independently
                  // We use strokeDasharray + offset trick on individual arcs
                  return (
                    <path
                      key={arc.label}
                      d={arc.d}
                      fill="none"
                      stroke={arc.color}
                      strokeWidth={isHov ? strokeW + 5 : strokeW}
                      strokeLinecap="round"
                      style={{
                        filter: isHov ? `drop-shadow(0 0 6px ${arc.color}88)` : "none",
                        transition: "stroke-width 0.2s ease, filter 0.2s ease, opacity 0.2s ease",
                        opacity: hovered !== null && !isHov ? 0.35 : 1,
                        cursor: "pointer",
                      }}
                      onMouseEnter={() => setHovered(i)}
                      onMouseLeave={() => setHovered(null)}
                    />
                  );
                })}

                {/* Animated grow-in overlay using clip via dasharray on full ring */}
                {!animated && (
                  <circle
                    cx={cx} cy={cy} r={r}
                    fill="none"
                    stroke="white"
                    strokeWidth={strokeW + 2}
                    strokeDasharray={circumference}
                    strokeDashoffset={0}
                  />
                )}

                {/* Tooltip bubble on hovered slice */}
                {hoveredArc && (
                  <g>
                    <rect
                      x={hoveredArc.tipX - 30}
                      y={hoveredArc.tipY - 22}
                      width={60}
                      height={42}
                      rx={8}
                      fill="white"
                      stroke="#d1fae5"
                      strokeWidth={1}
                      style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.08))" }}
                    />
                    <text
                      x={hoveredArc.tipX}
                      y={hoveredArc.tipY - 6}
                      textAnchor="middle"
                      fontSize={9}
                      fill="#16a34a"
                      fontWeight="600"
                    >
                      {(hoveredArc.pct * 100).toFixed(0)}%
                    </text>
                    <text
                      x={hoveredArc.tipX}
                      y={hoveredArc.tipY + 8}
                      textAnchor="middle"
                      fontSize={9}
                      fill="#166534"
                      fontWeight="700"
                    >
                      ${hoveredArc.amount.toLocaleString()}
                    </text>
                  </g>
                )}
              </svg>

              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] text-slate-400 font-medium tracking-wide">Total for month</span>
                <div className="flex items-baseline">
                  <span className="text-lg font-black text-slate-800">
                    $<AnimNum value={total} />
                  </span>
                  <span className="text-sm text-slate-300 font-light">.00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom accent */}
          <div className="mt-5 h-0.5 rounded-full bg-gradient-to-r from-green-200 via-emerald-300 to-green-100" />
        </div>

        <p className="text-center text-xs text-slate-400 mt-3 tracking-wide">
          Monthly budget · April 2026
        </p>
      </div>
    </div>
  );
}