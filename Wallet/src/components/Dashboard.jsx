import { useState, useEffect } from "react";
import BalanceCard from "./BalanceCard";
import StatsCard from "./StatsCard";
import BudgetCard from "./BudgetCard";
import TransactionCard from "./TransactionCard";

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    darkMode
      ? root.classList.add("dark")
      : root.classList.remove("dark");
  }, [darkMode]);

  return (
    <div className="
      min-h-screen p-4 sm:p-6
      bg-gradient-to-br from-green-50 via-emerald-50 to-slate-100
      dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
      transition-colors duration-300
    ">

      {/* 🔝 HEADER */}
      <div className="
        flex flex-col sm:flex-row
        sm:items-center sm:justify-between
        gap-4 mb-6
      ">

        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
          Finance Dashboard
        </h1>

        {/* Buttons */}
        <div className="flex flex-wrap gap-2">

          {/* Theme */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="
              px-3 py-2 sm:px-4 text-xs sm:text-sm font-semibold rounded-xl
              bg-white text-slate-700 border border-slate-200
              hover:bg-slate-100
              dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:hover:bg-slate-700
              transition
            "
          >
            {darkMode ? "Light ☀️" : "Dark 🌙"}
          </button>

          {/* Admin */}
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            className="
              px-3 py-2 sm:px-4 text-xs sm:text-sm font-semibold rounded-xl
              bg-green-600 text-white hover:bg-green-700 transition
            "
          >
            {isAdmin ? "User Mode" : "Admin Mode"}
          </button>

        </div>
      </div>

      {/* 🧱 GRID */}
      <div className="
        grid grid-cols-1
        lg:grid-cols-3
        xl:grid-cols-4
        gap-4 sm:gap-6
      ">

        {/* LEFT AREA */}
        <div className="
          flex flex-col gap-4 sm:gap-6
          lg:col-span-2 xl:col-span-3
        ">

          {/* TOP ROW */}
          <div className="
            grid grid-cols-1
            md:grid-cols-3
            gap-4 sm:gap-6
          ">

            {/* Balance */}
            <div className="md:col-span-2">
              <BalanceCard />
            </div>

            {/* Placeholder */}
            <div className="
              hidden md:flex
              items-center justify-center
              bg-white dark:bg-slate-800
              border border-slate-100 dark:border-slate-700
              rounded-3xl text-slate-400 text-sm
            ">
              Add Widget
            </div>

          </div>

          {/* Stats */}
          <StatsCard />

          {/* Transactions */}
          <TransactionCard isAdmin={isAdmin} />

        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col gap-4 sm:gap-6">

          <BudgetCard />

          {/* Hide on small screens */}
          <div className="
            hidden sm:flex
            h-40 items-center justify-center
            bg-white dark:bg-slate-800
            border border-slate-100 dark:border-slate-700
            rounded-3xl text-slate-400 text-sm
          ">
            Future Widget
          </div>

        </div>

      </div>
    </div>
  );
}