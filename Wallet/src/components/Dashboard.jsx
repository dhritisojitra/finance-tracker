import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import BalanceCard from "./BalanceCard";
import StatsCard from "./StatsCard";
import BudgetCard from "./BudgetCard";
import TransactionCard from "./TransactionCard";
import SavingsCard from "./SavingsCard";

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [transactions, setTransactions] = useState([
    { id: 1, date: "25 Jul 12:30", amount: -10, name: "YouTube", method: "VISA **3254", category: "Subscription", status: "Completed" },
    { id: 2, date: "26 Jul 15:00", amount: -150, name: "Reserved", method: "Mastercard **2154", category: "Shopping", status: "Pending" },
    { id: 3, date: "27 Jul 9:00", amount: -80, name: "Yaposhka", method: "Mastercard **2154", category: "Cafe & Restaurants", status: "Completed" },
  ]);

  const [justApproved, setJustApproved] = useState(new Set());

  const handleApprove = (id) => {
    setTransactions(prev =>
      prev.map(t => t.id === id ? { ...t, status: "Completed" } : t)
    );
    setJustApproved(prev => new Set([...prev, id]));
    setTimeout(() => setJustApproved(new Set()), 2000);
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen w-full bg-[#EEF2F7] dark:bg-slate-950 transition-colors duration-300">

      {/* HEADER */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 md:px-8 py-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
            {isAdmin ? "Admin Dashboard" : "Welcome back, Adaline!"}
          </h1>
          <p className="text-slate-400 text-sm">
            {isAdmin ? "Approving requests" : "Manage your finances smartly"}
          </p>
        </div>

        <div className="flex items-center gap-3">

          {/* Admin Toggle */}
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            className={`w-12 h-6 rounded-full relative transition ${isAdmin ? "bg-green-500" : "bg-slate-300"}`}
          >
            <motion.div
              layout
              className="w-4 h-4 bg-white rounded-full absolute top-1"
              style={{ left: isAdmin ? 26 : 4 }}
            />
          </button>

          {/* Dark Mode */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-12 h-6 rounded-full relative transition ${darkMode ? "bg-green-500" : "bg-slate-300"}`}
          >
            <motion.div
              layout
              className="w-4 h-4 bg-white rounded-full absolute top-1 flex items-center justify-center text-[8px]"
              style={{ left: darkMode ? 26 : 4 }}
            >
              {darkMode ? "🌙" : "☀️"}
            </motion.div>
          </button>

          <img
            src="https://i.pravatar.cc/150?u=adaline"
            className="w-9 h-9 rounded-full border border-slate-200"
            alt="profile"
          />
        </div>
      </header>

      {/* MAIN */}
      <main className="w-full max-w-none px-4 md:px-8 pb-8 space-y-6">

        {/* TOP ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Balance */}
          <div className="lg:col-span-2 flex">
            <div className="w-full h-full">
              <BalanceCard />
            </div>
          </div>

          {/* Transactions */}
          <div className="lg:col-span-3 flex">
            <div className="w-full h-full">
              <TransactionCard
                isAdmin={isAdmin}
                transactions={transactions}
                onApprove={handleApprove}
                justApproved={justApproved}
              />
            </div>
          </div>

        </div>

        {/* MIDDLE ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Stats */}
          <div className="lg:col-span-3 flex">
            <div className="w-full h-full">
              <StatsCard />
            </div>
          </div>

          {/* Budget */}
          <div className="lg:col-span-2 flex">
            <div className="w-full h-full">
              <BudgetCard />
            </div>
          </div>

        </div>

        {/* BOTTOM ROW */}
        <div className="w-full">
          
            <SavingsCard />
          
        </div>

      </main>
    </div>
  );
}