import { useState, useEffect, useRef } from "react";

// ── Data ──────────────────────────────────────────────────────────────────────
const allData = {
  year: {
    labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    all:      { income:[9200,10400,10000,13200,11800,6800,8200,9500,11000,12500,10800,13000], expense:[8100,11200,4800,12100,11200,5200,5900,7800,9200,10100,8900,11200] },
    checking: { income:[5000,6000,5800,7500,6800,3900,4700,5400,6300,7200,6200,7500], expense:[4500,6500,2800,7000,6500,3000,3400,4500,5300,5800,5100,6400] },
    savings:  { income:[2800,2900,2700,3200,2900,1800,2200,2600,2900,3200,2800,3200], expense:[1800,2400,1000,2600,2400,1100,1300,1800,2100,2300,2100,2500] },
    credit:   { income:[1400,1500,1500,2500,2100,1100,1300,1500,1800,2100,1800,2300], expense:[1800,2300,1000,2500,2300,1100,1200,1500,1800,2000,1700,2300] },
  },
  "6m": {
    labels: ["Feb","Mar","Apr","May","Jun","Jul"],
    all:      { income:[10400,10000,13200,11800,6800,8200], expense:[11200,4800,12100,11200,5200,5900] },
    checking: { income:[6000,5800,7500,6800,3900,4700], expense:[6500,2800,7000,6500,3000,3400] },
    savings:  { income:[2900,2700,3200,2900,1800,2200], expense:[2400,1000,2600,2400,1100,1300] },
    credit:   { income:[1500,1500,2500,2100,1100,1300], expense:[2300,1000,2500,2300,1100,1200] },
  },
  "3m": {
    labels: ["May","Jun","Jul"],
    all:      { income:[11800,6800,8200], expense:[11200,5200,5900] },
    checking: { income:[6800,3900,4700], expense:[6500,3000,3400] },
    savings:  { income:[2900,1800,2200], expense:[2400,1100,1300] },
    credit:   { income:[2100,1100,1300], expense:[2300,1100,1200] },
  },
  month: {
    labels: ["Wk 1","Wk 2","Wk 3","Wk 4"],
    all:      { income:[2100,1950,2400,2350], expense:[1800,1600,2200,1800] },
    checking: { income:[1200,1100,1400,1350], expense:[1000,900,1300,1050] },
    savings:  { income:[600,550,650,650], expense:[450,400,550,450] },
    credit:   { income:[300,300,350,350], expense:[350,300,350,300] },
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n) =>
  "$" + Math.round(n).toLocaleString("en-US");

const sum = (arr) => arr.reduce((a, b) => a + b, 0);

// ── Colours (green palette) ───────────────────────────────────────────────────
const COLOR_INCOME  = "#16a34a"; // green-600
const COLOR_EXPENSE = "#86efac"; // green-300
const COLOR_INCOME_HOVER  = "#15803d"; // green-700
const COLOR_EXPENSE_HOVER = "#4ade80"; // green-400

// ── Select component ──────────────────────────────────────────────────────────
function Select({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-green-200 text-slate-700 text-xs font-medium rounded-xl px-3 py-1.5 pr-7 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-300 hover:border-green-300 transition-colors"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
        width="10" height="6" viewBox="0 0 10 6" fill="currentColor"
      >
        <path d="M0 0l5 6 5-6z" />
      </svg>
    </div>
  );
}

// ── Bar chart (custom, animated) ──────────────────────────────────────────────
function BarChart({ labels, income, expense }) {
  const [animated, setAnimated] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  // Re-trigger animation when data changes
  useEffect(() => {
    setAnimated(false);
    const t = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(t);
  }, [labels, income, expense]);

  const maxVal = Math.max(...income, ...expense, 1);
  const CHART_H = 160;

  return (
    <div className="relative">
      {/* Y-axis grid lines */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none" style={{ bottom: 24 }}>
        {[1, 0.75, 0.5, 0.25, 0].map((pct, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 w-10 text-right flex-shrink-0">
              {fmt(maxVal * pct)}
            </span>
            <div className="flex-1 border-t border-slate-100" />
          </div>
        ))}
      </div>

      {/* Bars */}
      <div className="ml-14 flex items-end gap-2 sm:gap-3" style={{ height: CHART_H + 24 }}>
        {labels.map((label, i) => {
          const isHov = hovered === i;
          const incH = animated ? (income[i] / maxVal) * CHART_H : 0;
          const expH = animated ? (expense[i] / maxVal) * CHART_H : 0;
          const delay = `${i * 55}ms`;

          return (
            <div
              key={label}
              className="relative flex flex-col items-center flex-1"
              onMouseEnter={() => { setHovered(i); setTooltip(i); }}
              onMouseLeave={() => { setHovered(null); setTooltip(null); }}
            >
              {/* Tooltip */}
              {tooltip === i && (
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white border border-green-100 rounded-xl shadow-lg px-3 py-2 text-xs whitespace-nowrap z-20 pointer-events-none">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="w-2 h-2 rounded-full bg-green-600 inline-block" />
                    <span className="text-slate-500">Income:</span>
                    <span className="font-semibold text-green-700">{fmt(income[i])}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-300 inline-block" />
                    <span className="text-slate-500">Expense:</span>
                    <span className="font-semibold text-green-500">{fmt(expense[i])}</span>
                  </div>
                  {/* Arrow */}
                  <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-white border-b border-r border-green-100 rotate-45" />
                </div>
              )}

              {/* Bar pair */}
              <div className="flex items-end gap-0.5 w-full justify-center" style={{ height: CHART_H }}>
                {/* Income */}
                <div
                  className="rounded-t-full flex-1 max-w-[14px] cursor-pointer"
                  style={{
                    height: incH,
                    background: isHov ? COLOR_INCOME_HOVER : COLOR_INCOME,
                    transition: `height 0.55s cubic-bezier(0.34,1.4,0.64,1) ${delay}, background 0.2s`,
                  }}
                />
                {/* Expense */}
                <div
                  className="rounded-t-full flex-1 max-w-[14px] cursor-pointer"
                  style={{
                    height: expH,
                    background: isHov ? COLOR_EXPENSE_HOVER : COLOR_EXPENSE,
                    transition: `height 0.55s cubic-bezier(0.34,1.4,0.64,1) ${delay}, background 0.2s`,
                  }}
                />
              </div>

              {/* X label */}
              <span className="text-[10px] text-slate-400 mt-1.5">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Metric card ───────────────────────────────────────────────────────────────
function MetricCard({ label, value, accent }) {
  return (
    <div className="flex-1 min-w-[110px] bg-green-50 rounded-2xl px-4 py-3 border border-green-100">
      <p className="text-[11px] text-green-700 font-medium mb-1">{label}</p>
      <p className={`text-lg font-bold ${accent}`}>{value}</p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function StatsCard() {
  const [account, setAccount] = useState("all");
  const [period, setPeriod] = useState("year");

  const periodData = allData[period];
  const { labels, income, expense } = {
    labels: periodData.labels,
    income: periodData[account].income,
    expense: periodData[account].expense,
  };

  const totalIncome  = sum(income);
  const totalExpense = sum(expense);
  const net          = totalIncome - totalExpense;

  return (
    
      <div className="h-full">

        {/* Card */}
        <div className="h-full bg-white rounded-3xl border border-green-100 p-5 sm:p-6">

          {/* Header */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <h2 className="text-xl font-bold text-slate-800 flex-1">Money flow</h2>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-green-600 flex-shrink-0" />
                Income
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-green-300 flex-shrink-0" />
                Expense
              </span>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Select
                value={account}
                onChange={setAccount}
                options={[
                  { value: "all",      label: "All accounts" },
                  { value: "checking", label: "Checking" },
                  { value: "savings",  label: "Savings" },
                  { value: "credit",   label: "Credit" },
                ]}
              />
              <Select
                value={period}
                onChange={setPeriod}
                options={[
                  { value: "year",  label: "This year" },
                  { value: "6m",    label: "Last 6 months" },
                  { value: "3m",    label: "Last 3 months" },
                  { value: "month", label: "This month" },
                ]}
              />
            </div>
          </div>

          {/* Chart */}
          <BarChart labels={labels} income={income} expense={expense} />

          {/* Summary strip */}
          <div className="flex gap-3 mt-5 flex-wrap">
            <MetricCard
              label="Total income"
              value={fmt(totalIncome)}
              accent="text-green-700"
            />
            <MetricCard
              label="Total expense"
              value={fmt(totalExpense)}
              accent="text-green-400"
            />
            <MetricCard
              label="Net savings"
              value={(net >= 0 ? "+" : "") + fmt(Math.abs(net))}
              accent={net >= 0 ? "text-green-700" : "text-red-500"}
            />
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-3 tracking-wide">
          Financial overview · April 2026
        </p>
      </div>

  );
}