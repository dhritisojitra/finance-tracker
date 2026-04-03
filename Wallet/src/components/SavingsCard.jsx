// SavingsCard.jsx
import { motion } from "framer-motion";

export default function SavingsCard({
  title = "Vacation Fund",
  balance = 8420,
  goal = 12000,
  monthly = 1200,
}) {
  const progress = Math.min((balance / goal) * 100, 100);
  const remaining = goal - balance;
  const monthsLeft = Math.ceil(remaining / monthly);

  return (
    <div className="w-full bg-[#F7F8FA] rounded-[28px] p-6 border border-[#E5E7EB]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        <span className="text-sm text-slate-400">{progress.toFixed(0)}%</span>
      </div>

      {/* Progress Ring */}
      <div className="flex items-center justify-center my-6">
        <div className="relative w-36 h-36">
          <svg className="w-full h-full rotate-[-90deg]">
            <circle
              cx="72"
              cy="72"
              r="60"
              stroke="#E5E7EB"
              strokeWidth="10"
              fill="none"
            />
            <motion.circle
              cx="72"
              cy="72"
              r="60"
              stroke="#22C55E"
              strokeWidth="10"
              fill="none"
              strokeDasharray={377}
              strokeDashoffset={377 - (377 * progress) / 100}
              strokeLinecap="round"
              initial={{ strokeDashoffset: 377 }}
              animate={{ strokeDashoffset: 377 - (377 * progress) / 100 }}
              transition={{ duration: 1 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-xs text-slate-400">Saved</span>
            <span className="text-xl font-bold text-slate-800">
              ${balance}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 text-center text-sm">
        <div>
          <p className="font-semibold text-slate-700">${goal}</p>
          <p className="text-slate-400 text-xs">Goal</p>
        </div>
        <div>
          <p className="font-semibold text-slate-700">${remaining}</p>
          <p className="text-slate-400 text-xs">Left</p>
        </div>
        <div>
          <p className="font-semibold text-slate-700">{monthsLeft}</p>
          <p className="text-slate-400 text-xs">Months</p>
        </div>
      </div>
    </div>
  );
}

