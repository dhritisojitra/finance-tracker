import { useState, useEffect } from "react";

const TrendBadge = ({ value, positive }) => (
  <span
    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide
      ${positive
        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
        : "bg-rose-50 text-rose-500 border border-rose-100"
      }`}
  >
    <span className="text-sm leading-none">
      {positive ? "↑" : "↓"}
    </span>
    {value}%
  </span>
);

const AnimatedNumber = ({ target }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const step = 16;
    const increment = target / (duration / step);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setDisplay(target);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, step);

    return () => clearInterval(timer);
  }, [target]);

  return display.toLocaleString("en-US");
};

export default function BalanceCard() {
  const balance = 15700;
  const change = 12.1;
  const isPositive = change > 0;

  return (
    <div className="w-full  p-4 sm:p-8">
      <div className="w-xs max-w-sm sm:max-w-md">

        {/* Card */}
        <div className="relative bg-white rounded-3xl shadow-xl shadow-slate-200/70 p-6 sm:p-8 border border-slate-100 overflow-hidden">

          {/* Subtle background accent */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br from-emerald-50 to-teal-50 opacity-60 pointer-events-none" />
          <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-gradient-to-tr from-slate-100 to-gray-50 opacity-80 pointer-events-none" />

          {/* Header row */}
          <div className="flex items-start justify-between mb-6 relative">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-1">
                Portfolio
              </p>
              <h2 className="text-slate-700 font-bold text-lg sm:text-xl leading-tight">
                Total Balance
              </h2>
            </div>

            {/* External link button */}
            <button className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M7 17L17 7M7 7h10v10" />
              </svg>
            </button>
          </div>

          {/* Balance */}
          <div className="mb-5 relative">
            <div className="flex items-baseline gap-0.5">
              <span className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight leading-none" style={{ fontVariantNumeric: "tabular-nums" }}>
                $<AnimatedNumber target={balance} />
              </span>
              <span className="text-2xl sm:text-3xl font-light text-slate-300 leading-none">.00</span>
            </div>
          </div>

          {/* Footer row */}
          <div className="flex items-center gap-3 relative">
            <TrendBadge value={change} positive={isPositive} />
            <span className="text-slate-400 text-sm font-medium">vs last month</span>
          </div>

          {/* Thin bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-emerald-200 via-teal-300 to-emerald-200" />
        </div>

        {/* Floating label below */}
        <p className="text-center text-xs text-slate-400 mt-4 tracking-wide">
          Updated just now · USD
        </p>
      </div>
    </div>
  );
}