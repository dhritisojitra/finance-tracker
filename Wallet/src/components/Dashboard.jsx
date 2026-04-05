import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import BalanceCard from "./BalanceCard";
import StatsCard from "./StatsCard";
import BudgetCard from "./BudgetCard";
import TransactionCard from "./TransactionCard";
import SavingsCard from "./SavingsCard";
import WidgetManager from "./WidgetManager";
import StockInvestCard from "./StockInvestCard";

const ALL_WIDGETS = [
  { id: "balance",      label: "Balance Overview",   span: 2, icon: "💰" },
  { id: "transactions", label: "Transactions",        span: 3, icon: "🧾" },
  { id: "stats",        label: "Stats Chart",         span: 3, icon: "📊" },
  { id: "budget",       label: "Budget",              span: 2, icon: "🎯" },
  { id: "stocks",       label: "Stocks & Investing",  span: 5, icon: "📈" },
  { id: "savings",      label: "Savings Goals",       span: 5, icon: "🏦" },
];

// ─── Admin Toggle ─────────────────────────────────────────────────────────────
function AdminToggle({ isAdmin, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={isAdmin}
      className={`
        relative flex items-center rounded-2xl overflow-hidden
        border transition-all duration-300 select-none
        h-10 w-[148px] cursor-pointer
        ${isAdmin
          ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950 dark:border-emerald-600"
          : "border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700"}
      `}
    >
      <motion.div
        layout
        animate={{ x: isAdmin ? 74 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 36 }}
        className={`
          absolute top-1 bottom-1 w-[70px] rounded-xl z-10
          ${isAdmin
            ? "bg-emerald-500 shadow-md shadow-emerald-200 dark:shadow-emerald-900"
            : "bg-slate-800 dark:bg-slate-200 shadow-sm"}
        `}
      />
      <span className={`relative z-20 flex items-center justify-center gap-1 w-[74px] text-xs font-semibold transition-colors duration-200 ${!isAdmin ? "text-white dark:text-slate-900" : "text-slate-400 dark:text-slate-500"}`}>
        <span className="text-[13px]">👤</span> User
      </span>
      <span className={`relative z-20 flex items-center justify-center gap-1 w-[74px] text-xs font-semibold transition-colors duration-200 ${isAdmin ? "text-white" : "text-slate-400 dark:text-slate-500"}`}>
        <span className="text-[13px]">🛡</span> Admin
      </span>
    </button>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [isAdmin, setIsAdmin] = useState(false);

  const [showWidgetMgr, setShowWidgetMgr] = useState(false);
  const [widgetOrder, setWidgetOrder]     = useState(ALL_WIDGETS.map((w) => w.id));
  const [hiddenWidgets, setHiddenWidgets] = useState(new Set());

  const [transactions, setTransactions] = useState([
    { id: 1, date: "25 Jul 12:30", amount: -10,  name: "YouTube",  method: "VISA **3254",       category: "Subscription",       status: "Completed" },
    { id: 2, date: "26 Jul 15:00", amount: -150, name: "Reserved", method: "Mastercard **2154", category: "Shopping",           status: "Pending"   },
    { id: 3, date: "27 Jul 9:00",  amount: -80,  name: "Yaposhka", method: "Mastercard **2154", category: "Cafe & Restaurants", status: "Completed" },
  ]);

  const [justApproved, setJustApproved] = useState(new Set());

  const [savings, setSavings] = useState(() => {
    try {
      const stored = localStorage.getItem("savings");
      return stored ? JSON.parse(stored) : [{ id: 1, title: "Vacation Fund", balance: 8420, goal: 12000, monthly: 1200 }];
    } catch {
      return [{ id: 1, title: "Vacation Fund", balance: 8420, goal: 12000, monthly: 1200 }];
    }
  });

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData]   = useState({ title: "", balance: "", goal: "", monthly: "" });

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleApprove = (id) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, status: "Completed" } : t)));
    setJustApproved((prev) => new Set([...prev, id]));
    setTimeout(() => setJustApproved(new Set()), 2000);
  };

  const handleAddGoal = () => {
    if (!formData.title || !formData.goal || !formData.monthly) {
      alert("Please fill all required fields.");
      return;
    }
    setSavings((prev) => [...prev, { id: Date.now(), title: formData.title, balance: Number(formData.balance) || 0, goal: Number(formData.goal), monthly: Number(formData.monthly) }]);
    setFormData({ title: "", balance: "", goal: "", monthly: "" });
    setShowModal(false);
  };

  const deleteGoal = (id) => setSavings((prev) => prev.filter((g) => g.id !== id));

  // ── Effects ──────────────────────────────────────────────────────────────────


  useEffect(() => {
    localStorage.setItem("savings", JSON.stringify(savings));
  }, [savings]);

  // ── Widget renderer ───────────────────────────────────────────────────────────
  const renderWidget = (id) => {
    if (hiddenWidgets.has(id)) return null;

    switch (id) {
      case "balance":
        return <div key="balance" className="lg:col-span-2 h-full"><BalanceCard /></div>;
      case "transactions":
        return (
          <div key="transactions" className="lg:col-span-3 h-full">
            <TransactionCard isAdmin={isAdmin} transactions={transactions} setTransactions={setTransactions} onApprove={handleApprove} justApproved={justApproved} />
          </div>
        );
      case "stats":
        return <div key="stats" className="lg:col-span-3"><StatsCard /></div>;
      case "budget":
        return <div key="budget" className="lg:col-span-2"><BudgetCard /></div>;
      case "stocks":
        return (
          <div key="stocks" className="lg:col-span-5 space-y-2">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white px-1">Investing Insights</h2>
            <StockInvestCard isAdmin={isAdmin} />
          </div>
        );
      case "savings":
        return (
          <div key="savings" className="lg:col-span-5 space-y-4">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white px-1">Savings Goals</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savings.map((goal) => (
                <SavingsCard key={goal.id} {...goal} onDelete={() => deleteGoal(goal.id)} />
              ))}
              <div onClick={() => setShowModal(true)} className="min-h-[260px] flex flex-col items-center justify-center gap-2 rounded-[28px] border-2 border-dashed border-slate-300 dark:border-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition group">
                <span className="text-3xl text-slate-300 dark:text-slate-600 group-hover:text-emerald-400 transition">＋</span>
                <span className="text-xs text-slate-400 group-hover:text-emerald-400 transition font-medium">Add Goal</span>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  const visibleWidgets = widgetOrder.filter((id) => !hiddenWidgets.has(id));

  return (
    <div className="min-h-screen w-full bg-[#EEF2F7] dark:bg-slate-950 transition-colors duration-300">
      
      {/* HEADER */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 md:px-8 py-5">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
              {isAdmin ? "Admin Dashboard" : "Welcome back"}
            </h1>
            <p className="text-slate-400 text-sm">
              {isAdmin ? "Managing system" : "Manage your finances smartly"}
            </p>
          </div>
          <AnimatePresence>
            {isAdmin && (
              <motion.span
                key="admin-badge"
                initial={{ opacity: 0, scale: 0.75, y: -6 }}
                animate={{ opacity: 1, scale: 1,    y:  0 }}
                exit={{    opacity: 0, scale: 0.75, y: -6 }}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold tracking-wide uppercase"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                Admin Access
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setShowWidgetMgr(true)} className="px-4 py-2 h-10 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 transition">
            ⚙️ Widgets
          </button>

          <AdminToggle isAdmin={isAdmin} onToggle={() => setIsAdmin((v) => !v)} />

 

          <img src="https://static.vecteezy.com/system/resources/previews/046/010/545/non_2x/user-icon-simple-design-free-vector.jpg" className="w-10 h-10 rounded-2xl border-2 border-white dark:border-slate-700 shadow-sm" alt="Adaline" />
        </div>
      </header>

      {/* MAIN */}
      <main className="w-full px-4 md:px-8 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {visibleWidgets.map((id) => renderWidget(id))}
        </div>
      </main>

      {/* WIDGET MANAGER MODAL */}
      <AnimatePresence>
        {showWidgetMgr && (
          <WidgetManager
            allWidgets={ALL_WIDGETS}
            widgetOrder={widgetOrder}
            hiddenWidgets={hiddenWidgets}
            onClose={() => setShowWidgetMgr(false)}
            onSave={({ order, hidden }) => {
              setWidgetOrder(order);
              setHiddenWidgets(hidden);
              setShowWidgetMgr(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* ADD SAVINGS MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{    opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0,  scale: 1    }}
              exit={{    opacity: 0, y: 24, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4"
            >
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Add Savings Goal</h3>
              {[
                { key: "title",   placeholder: "Goal title",                  type: "text"   },
                { key: "balance", placeholder: "Current balance (₹)",          type: "number" },
                { key: "goal",    placeholder: "Target amount (₹) *",          type: "number" },
                { key: "monthly", placeholder: "Monthly contribution (₹) *",   type: "number" },
              ].map(({ key, placeholder, type }) => (
                <input
                  key={key}
                  type={type}
                  placeholder={placeholder}
                  value={formData[key]}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-emerald-400 outline-none transition"
                />
              ))}
              <div className="flex justify-end gap-3 pt-1">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 transition">Cancel</button>
                <button onClick={handleAddGoal} className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition">Add Goal</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}