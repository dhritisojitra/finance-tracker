import { motion } from "framer-motion";

export default function SavingsCard({
  title,
  balance,
  goal,
  monthly,
  onDelete,
}) {
  const progress = Math.min((balance / goal) * 100, 100);
  const remaining = goal - balance;
  const monthsLeft = monthly > 0 ? Math.ceil(remaining / monthly) : 0;

  return (
    <div className="w-full bg-white  rounded-[28px] p-6 border border-[#E5E7EB] dark:border-slate-700 relative min-h-[260px] flex flex-col justify-between">

      {/* Delete */}
      <button
        onClick={onDelete}
        className="absolute top-3 right-4 text-black hover:text-red-500"
      >
        ✕
      </button>

      {/* Title */}
      <h3 className="text-lg font-semibold text-slate-800 dark:text-black mb-2">
        {title}
      </h3>

      {/* Progress */}
      <div className="flex justify-center my-4">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full rotate-[-90deg]">
            <circle cx="64" cy="64" r="54" stroke="#E5E7EB" strokeWidth="10" fill="none" />
            <motion.circle
              cx="64"
              cy="64"
              r="54"
              stroke="#22C55E"
              strokeWidth="10"
              fill="none"
              strokeDasharray={339}
              strokeDashoffset={339 - (339 * progress) / 100}
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-black">Saved</span>
            <span className="font-bold text-black dark:text-black">
              ₹{balance}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 text-center text-sm">
        <div>
          <p className="font-semibold text-black dark:text-black">₹{goal}</p>
          <p className="text-black">Goal</p>
        </div>
        <div>
          <p className="font-semibold text-black dark:text-black">₹{remaining}</p>
          <p className="text-black">Left</p>
        </div>
        <div>
          <p className="font-semibold text-black dark:text-black">{monthsLeft}</p>
          <p className="text-black">Months</p>
        </div>
      </div>
    </div>
  );
}