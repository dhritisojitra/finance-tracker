import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TransactionCard({ isAdmin, transactions, onApprove, justApproved }) {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editNote, setEditNote] = useState("");

  // Track which rows should animate (just switched from admin → user with changes)
  const [animatingIds, setAnimatingIds] = useState(new Set());

  const prevIsAdmin = useRef(isAdmin);

  useEffect(() => {
    // Detect the moment we switch from admin to user
    if (prevIsAdmin.current && !isAdmin && justApproved.size > 0) {
      setAnimatingIds(new Set(justApproved));
      setTimeout(() => setAnimatingIds(new Set()), 1800);
    }
    prevIsAdmin.current = isAdmin;
  }, [isAdmin, justApproved]);

  const startEdit = (tx) => {
    setEditingId(tx.id);
    setEditNote(tx.note || "");
  };

  return (
   <div className="h-full w-full bg-[#F7F8FA] rounded-[28px] p-6 border border-[#E5E7EB] flex flex-col">

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-black">
            Recent Transactions
          </h2>
          {isAdmin && (
            <span className="text-xs text-slate-400 dark:text-slate-500 italic">Admin view — approve or edit rows</span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr>
                {["Date", "Amount", "Payment", "Method", "Category", "Status"].map((h) => (
                  <th key={h} className="text-left text-xs font-bold text-black uppercase pb-3 pr-4">
                    {h}
                  </th>
                ))}
                {isAdmin && (
                  <th className="text-left text-xs font-bold text-green-600 uppercase pb-3">Actions</th>
                )}
              </tr>
            </thead>

            <tbody>
              {transactions.map((tx, i) => {
                const isAnimating = animatingIds.has(tx.id);
                const isEditing = editingId === tx.id;

                return (
                  <AnimatePresence key={tx.id} mode="wait">
                    <motion.tr
                      key={tx.id + tx.status}
                      initial={isAnimating ? { backgroundColor: "#bbf7d0" } : { opacity: 0.85 }}
                      animate={{ backgroundColor: "rgba(0,0,0,0)", opacity: 1 }}
                      transition={{ duration: isAnimating ? 1.4 : 0.3 }}
                      className={`border-t border-slate-100 dark:border-slate-800 transition-colors ${
                        hoveredRow === i ? "bg-slate-50 dark:bg-slate-800/50" : ""
                      }`}
                      onMouseEnter={() => setHoveredRow(i)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      {/* Date */}
                      <td className="py-3 pr-4 text-sm text-black whitespace-nowrap">{tx.date}</td>

                      {/* Amount */}
                      <td className="py-3 pr-4 font-semibold text-black  text-sm">
                        - ${Math.abs(tx.amount)}
                      </td>

                      {/* Payment name */}
                      <td className="py-3 pr-4 text-sm dark:text-black flex items-center gap-2">
                        💳 {tx.name}
                      </td>

                      {/* Method */}
                      <td className="py-3 pr-4 text-sm text-black">{tx.method}</td>

                      {/* Category */}
                      <td className="py-3 pr-4">
                        <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-lg text-xs font-semibold">
                          {tx.category}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 pr-4 bg-slate-100">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={tx.status}
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 6 }}
                            transition={{ duration: 0.25 }}
                            className={`text-xs font-bold px-2 py-1 rounded-md ${
                              tx.status === "Completed"
                                ? "text-green-600 dark:text-green-400"
                                : " text-yellow-600 dark:text-yellow-400"
                            }`}
                          >
                            {tx.status === "Completed" ? "✓ Completed" : "⏳ Pending"}
                          </motion.span>
                        </AnimatePresence>
                      </td>

                      {/* Admin actions */}
                      {isAdmin && (
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            {tx.status === "Pending" && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onApprove(tx.id)}
                                className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors"
                              >
                                Approve
                              </motion.button>
                            )}
                            {tx.status === "Completed" && (
                              <span className="text-green-500 text-xs font-semibold">✓ Done</span>
                            )}
                          </div>
                        </td>
                      )}
                    </motion.tr>
                  </AnimatePresence>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
  
  );
}