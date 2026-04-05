import { useState, useEffect } from "react";

/* Trend Badge */
const TrendBadge = ({ value, positive }) => (
  <span
    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
      ${
        positive
          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
          : "bg-rose-50 text-rose-500 border border-rose-100"
      }`}
  >
    <span>{positive ? "↑" : "↓"}</span>
    {value}%
  </span>
);

/* Animated Number */
const AnimatedNumber = ({ target }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
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

/* Main Component */
export default function BalanceCard() {
  const balance = 15700;
  const change = 12.1;
  const isPositive = change > 0;

  const income = 8200;
  const expense = 3500;

  const [showBreakdown, setShowBreakdown] = useState(false);

  return (
    <div
      className="h-full w-full bg-[#F7F8FA] rounded-[28px] p-4 sm:p-6 border border-[#E5E7EB] flex flex-col justify-between group cursor-pointer"
      onClick={() => setShowBreakdown((prev) => !prev)}
    >

      {/* Header */}
      <div className="relative z-10 text-center">
        <p className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-400 font-semibold mb-1">
          Portfolio
        </p>
        <h2 className="text-base sm:text-lg text-slate-700 font-bold">
          Total Balance
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Tap / hover to see breakdown
        </p>
      </div>

      {/* CENTER */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">

        {/* NORMAL VIEW */}
        <div
          className={`absolute flex flex-col items-center justify-center text-center transition-all duration-300
          ${showBreakdown ? "opacity-0 scale-95" : "opacity-100 scale-100"}
          group-hover:opacity-0 group-hover:scale-95`}
        >
          {/* Balance */}
          <div className="mb-4">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-3xl sm:text-4xl font-bold text-slate-800">
                ₹<AnimatedNumber target={balance} />
              </span>
              <span className="text-xl sm:text-2xl font-light text-slate-300">
                .00
              </span>
            </div>
          </div>

          {/* Trend */}
          <div className="flex items-center gap-2">
            <TrendBadge value={change} positive={isPositive} />
            <span className="text-slate-400 text-xs sm:text-sm">
              vs last month
            </span>
          </div>
        </div>

        {/* BREAKDOWN VIEW */}
        <div
          className={`absolute flex flex-col items-center justify-center text-center transition-all duration-300
          ${showBreakdown ? "opacity-100 scale-100" : "opacity-0 scale-95"}
          group-hover:opacity-100 group-hover:scale-100`}
        >
          <h3 className="text-slate-500 text-sm mb-4 font-medium">
            Monthly Overview
          </h3>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 items-center">
            {/* Income */}
            <div className="text-center">
              <p className="text-xs text-slate-400 mb-1">Income</p>
              <p className="text-base sm:text-lg font-semibold text-emerald-500">
                +₹{income.toLocaleString()}
              </p>
            </div>

            {/* Expense */}
            <div className="text-center">
              <p className="text-xs text-slate-400 mb-1">Expense</p>
              <p className="text-base sm:text-lg font-semibold text-rose-500">
                -₹{expense.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}