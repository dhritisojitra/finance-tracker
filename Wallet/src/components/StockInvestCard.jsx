import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STOCKS = [
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    price: "189.43",
    change: "+1.24",
    pct: "+0.66%",
    up: true,
    tip: "Strong iPhone 16 cycle + services revenue growth. Good long-term hold.",
    risk: "Low",
    sector: "Tech",
    sparkline: [180, 183, 178, 185, 182, 187, 189],
  },
  {
    ticker: "MSFT",
    name: "Microsoft",
    price: "415.20",
    change: "+3.80",
    pct: "+0.92%",
    up: true,
    tip: "Azure AI momentum accelerating. Copilot integration driving enterprise adoption.",
    risk: "Low",
    sector: "Tech",
    sparkline: [405, 408, 402, 410, 407, 412, 415],
  },
  {
    ticker: "NVDA",
    name: "NVIDIA Corp.",
    price: "875.60",
    change: "-12.30",
    pct: "-1.38%",
    up: false,
    tip: "Short-term pullback. Long-term AI chip demand remains structurally strong.",
    risk: "High",
    sector: "Semiconductors",
    sparkline: [895, 888, 902, 880, 892, 878, 875],
  },
  {
    ticker: "GOOGL",
    name: "Alphabet Inc.",
    price: "172.55",
    change: "+0.95",
    pct: "+0.55%",
    up: true,
    tip: "Ad recovery + Gemini AI integration. Cloud segment growing 28% YoY.",
    risk: "Medium",
    sector: "Tech",
    sparkline: [168, 170, 167, 171, 169, 172, 173],
  },
  {
    ticker: "VTI",
    name: "Vanguard Total Mkt",
    price: "243.10",
    change: "+1.05",
    pct: "+0.43%",
    up: true,
    tip: "Best beginner pick. Whole US market exposure, rock-bottom 0.03% fees.",
    risk: "Low",
    sector: "ETF",
    sparkline: [238, 240, 237, 241, 240, 242, 243],
  },
];

const RISK_COLORS = {
  Low:    { bg: "bg-emerald-50 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400" },
  Medium: { bg: "bg-amber-50 dark:bg-amber-900/30",    text: "text-amber-700 dark:text-amber-400"    },
  High:   { bg: "bg-red-50 dark:bg-red-900/30",        text: "text-red-700 dark:text-red-400"        },
};

function Sparkline({ data, up }) {
  const w = 72, h = 32;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  const color = up ? "#22c55e" : "#ef4444";
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <polyline points={pts} stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function StockRow({ stock, onClick, active }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: 3 }}
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200
        ${active
          ? "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800"
          : "hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent"}
      `}
    >
      {/* Ticker badge */}
      <div className="w-11 h-11 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center flex-shrink-0 shadow-sm">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{stock.ticker}</span>
      </div>

      {/* Name + sector */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-black truncate">{stock.name}</p>
        <p className="text-xs text-black">{stock.sector}</p>
      </div>

      {/* Sparkline */}
      <div className="hidden sm:block flex-shrink-0">
        <Sparkline data={stock.sparkline} up={stock.up} />
      </div>

      {/* Price + change */}
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold text-black">₹{stock.price}</p>
        <p className={`text-xs font-semibold ${stock.up ? "text-emerald-500" : "text-red-500"}`}>
          {stock.up ? "▲" : "▼"} {stock.pct}
        </p>
      </div>
    </motion.button>
  );
}

export default function StockInvestCard() {
  const [active, setActive] = useState(0);
  const [tab, setTab]       = useState("tips"); // "tips" | "start"

  const selected = STOCKS[active];
  const risk     = RISK_COLORS[selected.risk];

  return (
    <div className="w-full rounded-[28px] bg-white   dark:border-slate-800 shadow-sm overflow-hidden">

      {/* ── Top banner ── */}
      <div className="bg-emerald-500 px-5 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-base sm:text-lg leading-tight">
            Stocks & Investing
          </h2>
          <p className="text-emerald-100 text-xs mt-0.5">Curated tips · not financial advice</p>
        </div>
        <div className="flex items-center gap-1 bg-white/20 rounded-xl px-3 py-1.5">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="text-white text-xs font-semibold">Live</span>
        </div>
      </div>

      {/* ── Tab row ── */}
      <div className="flex gap-1 px-5 pt-4 pb-1">
        {[
          { key: "tips",  label: "📈 Stock Tips"      },
          { key: "start", label: "🚀 Start Investing"  },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`
              px-4 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200
              ${tab === t.key
                ? "bg-emerald-500 text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-400"}
            `}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── TABS ── */}
      <AnimatePresence mode="wait">

        {/* STOCK TIPS TAB */}
        {tab === "tips" && (
          <motion.div
            key="tips"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-0"
          >
            {/* Stock list */}
            <div className="px-3 py-3 space-y-1 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800">
              {STOCKS.map((s, i) => (
                <StockRow
                  key={s.ticker}
                  stock={s}
                  active={active === i}
                  onClick={() => setActive(i)}
                />
              ))}
            </div>

            {/* Detail panel */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.ticker}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                className="px-5 py-5 flex flex-col gap-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">{selected.ticker}</p>
                    <p className="text-sm text-slate-400">{selected.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-slate-800 dark:text-white">${selected.price}</p>
                    <p className={`text-sm font-semibold ${selected.up ? "text-emerald-500" : "text-red-500"}`}>
                      {selected.change} ({selected.pct})
                    </p>
                  </div>
                </div>

                {/* Larger sparkline */}
                <div className="w-full">
                  {(() => {
                    const d = selected.sparkline;
                    const w = 260, h = 56;
                    const min = Math.min(...d), max = Math.max(...d);
                    const range = max - min || 1;
                    const pts = d.map((v, i) => {
                      const x = (i / (d.length - 1)) * w;
                      const y = h - ((v - min) / range) * (h - 6) - 3;
                      return `${x},${y}`;
                    }).join(" ");
                    const color = selected.up ? "#22c55e" : "#ef4444";
                    const fillPts = `0,${h} ${pts} ${w},${h}`;
                    return (
                      <svg width="100%" viewBox={`0 0 ${w} ${h}`} fill="none" className="overflow-visible">
                        <defs>
                          <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
                            <stop offset="100%" stopColor={color} stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <polygon points={fillPts} fill="url(#sg)" />
                        <polyline points={pts} stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                      </svg>
                    );
                  })()}
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                    <span
                        className={`
                        text-xs font-semibold text-black border border-black px-3 py-1 rounded-lg
                        ${risk.bg}
                        `}
                    >
                        {selected.risk} Risk
                    </span>

                    <span className="text-xs font-semibold text-black border border-black px-3 py-1 rounded-lg bg-slate-100">
                        {selected.sector}
                    </span>
                </div>

                {/* Analyst tip */}
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-xl p-3">
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-800 mb-1">Analyst Note</p>
                  <p className="text-sm text-black leading-snug">{selected.tip}</p>
                </div>

                {/* CTA */}
                <button className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold transition-all shadow-sm shadow-emerald-200 dark:shadow-none">
                  View {selected.ticker} Details →
                </button>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {/* START INVESTING TAB */}
        {tab === "start" && (
          <motion.div
            key="start"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="px-5 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {[
              {
                icon: "🌱",
                title: "Start with ETFs",
                desc: "Low risk, instant diversification. VTI or VOO are perfect first buys — they track the whole US market.",
                action: "Explore ETFs",
                accent: "emerald",
              },
              {
                icon: "📅",
                title: "Dollar-Cost Average",
                desc: "Invest a fixed amount every month regardless of price. Removes emotion from investing and smooths out volatility.",
                action: "Set up auto-invest",
                accent: "emerald",
              },
              {
                icon: "🔒",
                title: "Emergency Fund First",
                desc: "Before investing, ensure 3–6 months of expenses are in a high-yield savings account. Never invest money you may need soon.",
                action: "Check savings",
                accent: "amber",
              },
              {
                icon: "📚",
                title: "Learn the Basics",
                desc: "Understand P/E ratios, dividends, and market cycles before picking individual stocks. Knowledge is your best asset.",
                action: "Read guide",
                accent: "slate",
              },
            ].map((item) => (
              <div
                    key={item.title}
                    className="
                        rounded-2xl p-4 border flex flex-col gap-2 transition-all duration-200 hover:shadow-md
                        bg-slate-800 border-slate-700
                    "
                    >
                    <span className="text-2xl">{item.icon}</span>

                    <p className="text-sm font-bold text-white">
                        {item.title}
                    </p>

                    <p className="text-xs text-slate-400 leading-relaxed flex-1">
                        {item.desc}
                    </p>

                    <button
                        className="
                        self-start mt-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition
                        bg-slate-700 text-white hover:bg-slate-600
                        "
                    >
                        {item.action} →
                    </button>
                </div>
            ))}

            {/* Disclaimer */}
            <div className="sm:col-span-2 flex items-start gap-2 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-700">
              <span className="text-base flex-shrink-0">⚠️</span>
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong className="text-slate-500 dark:text-slate-300">Disclaimer:</strong> All stock tips and investing information shown are for educational purposes only and do not constitute financial advice. Always consult a qualified financial advisor before investing.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}