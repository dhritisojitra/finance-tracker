import { useState, useEffect } from "react";

// ── Data ─────────────────────────────────────────
const categories = [
  { label: "Cafe & Restaurants", amount: 1400, color: "#16a34a" },
  { label: "Entertainment", amount: 980, color: "#4ade80" },
  { label: "Investments", amount: 1200, color: "#bbf7d0" },
  { label: "Food & Groceries", amount: 870, color: "#166534" },
  { label: "Health & Beauty", amount: 400, color: "#15803d" },
  { label: "Traveling", amount: 1100, color: "#86efac" },
];

const total = categories.reduce((s, c) => s + c.amount, 0);

// ── Donut math ───────────────────────────────────
const cx = 100, cy = 100, r = 80, strokeW = 22;

function buildArcs(items) {
  let cumulative = 0;
  return items.map((item) => {
    const pct = item.amount / total;
    const start = cumulative * 2 * Math.PI - Math.PI / 2;
    const end = (cumulative + pct) * 2 * Math.PI - Math.PI / 2;

    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);

    const largeArc = pct > 0.5 ? 1 : 0;
    const d = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;

    cumulative += pct;
    return { ...item, d, pct };
  });
}

const arcs = buildArcs(categories);

// ── Animated number ──────────────────────────────
function AnimNum({ value }) {
  const [disp, setDisp] = useState(0);

  useEffect(() => {
    let start = 0;
    const inc = value / 60;

    const timer = setInterval(() => {
      start += inc;
      if (start >= value) {
        setDisp(value);
        clearInterval(timer);
      } else {
        setDisp(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return disp.toLocaleString();
}

// ── Main ─────────────────────────────────────────
export default function BudgetCard() {
  const [hovered, setHovered] = useState(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  return (
    <div className="w-full h-full">

      <div className="h-full bg-white rounded-3xl border border-green-100 p-6 flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-black text-slate-800">Budget</h2>

          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition"
          >
            <span className={`transition-transform ${showBreakdown ? "rotate-180" : ""}`}>
              ↗
            </span>
          </button>
        </div>

        {/* Content centered */}
        <div className="flex-1 flex items-center justify-center">

          <div className="flex items-center gap-6">

            {/* Legend */}
            <ul className="space-y-3">
              {categories.map((cat, i) => (
                <li
                  key={cat.label}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ background: cat.color }}
                  />
                  <span
                    className="text-sm"
                    style={{
                      color: hovered === i ? cat.color : "#64748b",
                    }}
                  >
                    {cat.label}
                  </span>
                </li>
              ))}
            </ul>

            {/* Donut */}
            <div className="relative w-[200px] h-[200px]">
              <svg viewBox="0 0 200 200">
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="none"
                  stroke="#f0fdf4"
                  strokeWidth={strokeW}
                />

                {arcs.map((arc, i) => (
                  <path
                    key={i}
                    d={arc.d}
                    fill="none"
                    stroke={arc.color}
                    strokeWidth={hovered === i ? strokeW + 5 : strokeW}
                    strokeLinecap="round"
                    style={{
                      opacity: hovered !== null && hovered !== i ? 0.3 : 1,
                      transition: "0.2s",
                    }}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                  />
                ))}
              </svg>

              {/* Center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs text-slate-400">
                  Total for month
                </span>
                <div className="flex">
                  <span className="text-xl font-black text-slate-800">
                    $<AnimNum value={total} />
                  </span>
                  <span className="text-sm text-slate-300">.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 🔥 Breakdown Panel */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            showBreakdown ? "max-h-60 mt-4 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t pt-4 space-y-2">
            {categories.map((c) => (
              <div key={c.label} className="flex justify-between text-sm">
                <span className="text-slate-600">{c.label}</span>
                <span className="font-semibold text-slate-800">
                  ${c.amount.toLocaleString()} (
                  {((c.amount / total) * 100).toFixed(0)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-slate-400 mt-3">
        Monthly budget · April 2026
      </p>
    </div>
  );
}