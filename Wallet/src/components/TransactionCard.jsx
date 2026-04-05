import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";

export default function TransactionCard({
  isAdmin,
  transactions,
  setTransactions, 
  onApprove,
  justApproved,
}) {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [animatingIds, setAnimatingIds] = useState(new Set());
  const prevIsAdmin = useRef(isAdmin);

  // ✅ Add modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTx, setNewTx] = useState({
    date: "",
    amount: "",
    name: "",
    method: "",
    category: "",
  });

  // ── Animation effect ──
  useEffect(() => {
    if (prevIsAdmin.current && !isAdmin && justApproved.size > 0) {
      setAnimatingIds(new Set(justApproved));
      setTimeout(() => setAnimatingIds(new Set()), 1800);
    }
    prevIsAdmin.current = isAdmin;
  }, [isAdmin, justApproved]);

  // ── ADD TRANSACTION ──
  const handleAdd = () => {
    if (!newTx.date || !newTx.amount || !newTx.name) return;

    const updated = [
      ...transactions,
      {
        ...newTx,
        id: Date.now(),
        amount: Number(newTx.amount),
        status: "Pending",
      },
    ];

    setTransactions(updated); 
    setShowAddModal(false);
    setNewTx({ date: "", amount: "", name: "", method: "", category: "" });
  };

  // ── DELETE ──
  const handleDelete = (id) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated); 
  };

  // ── PDF DOWNLOAD ──
  const downloadPDF = (tx) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Transaction Invoice", 20, 20);

    doc.setFontSize(12);
    doc.text(`Date: ${tx.date}`, 20, 40);
    doc.text(`Amount: ₹${tx.amount}`, 20, 50);
    doc.text(`Name: ${tx.name}`, 20, 60);
    doc.text(`Method: ${tx.method}`, 20, 70);
    doc.text(`Category: ${tx.category}`, 20, 80);
    doc.text(`Status: ${tx.status}`, 20, 90);

    doc.save(`invoice-${tx.id}.pdf`);
  };

  return (
    <div className="h-full w-full bg-[#F7F8FA] rounded-[28px] p-6 border border-[#E5E7EB] flex flex-col">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
          Recent Transactions
        </h2>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <span className="text-xs text-slate-400 italic">
              Admin view — manage transactions
            </span>
          )}

          {/* ADD BUTTON */}
          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="text-xs bg-black text-white px-3 py-1.5 rounded-lg font-semibold"
            >
              + Add
            </button>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr>
              {["Date", "Amount", "Payment", "Method", "Category", "Status"].map((h) => (
                <th key={h} className="text-left text-xs font-bold text-black uppercase pb-3 pr-4">
                  {h}
                </th>
              ))}
              <th className="text-left text-xs font-bold text-black uppercase pb-3">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((tx, i) => {
              const isAnimating = animatingIds.has(tx.id);

              return (
                <AnimatePresence key={tx.id} mode="wait">
                  <motion.tr
                    key={tx.id + tx.status}
                    initial={isAnimating ? { backgroundColor: "#bbf7d0" } : { opacity: 0.85 }}
                    animate={{ backgroundColor: "rgba(0,0,0,0)", opacity: 1 }}
                    transition={{ duration: isAnimating ? 1.4 : 0.3 }}
                    className={`border-t border-slate-100 ${
                      hoveredRow === i ? "bg-slate-50" : ""
                    }`}
                    onMouseEnter={() => setHoveredRow(i)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="py-3 pr-4 text-sm text-black">{tx.date}</td>

                    <td className="py-3 pr-4 font-semibold text-black text-sm">
                      ₹{tx.amount}
                    </td>

                    <td className="py-3 pr-4 text-sm flex items-center gap-2">
                      💳 {tx.name}
                    </td>

                    <td className="py-3 pr-4 text-sm text-black">
                      {tx.method}
                    </td>

                    <td className="py-3 pr-4">
                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-lg text-xs font-semibold">
                        {tx.category}
                      </span>
                    </td>

                    <td className="py-3 pr-4 bg-slate-100">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-md ${
                          tx.status === "Completed"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {tx.status === "Completed" ? "✓ Completed" : "⏳ Pending"}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="py-3">
                      <div className="flex items-center gap-2 flex-wrap">

                        {tx.status === "Pending" && isAdmin && (
                          <button
                            onClick={() => onApprove(tx.id)}
                            className="bg-green-600 text-white text-xs px-3 py-1 rounded-lg"
                          >
                            Approve
                          </button>
                        )}

                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(tx.id)}
                            className="bg-red-500 text-white text-xs px-3 py-1 rounded-lg"
                          >
                            Delete
                          </button>
                        )}

                        {/* PDF BUTTON */}
                        <button
                          onClick={() => downloadPDF(tx)}
                          className="bg-blue-500 text-white text-xs px-3 py-1 rounded-lg"
                        >
                          Invoice
                        </button>

                      </div>
                    </td>
                  </motion.tr>
                </AnimatePresence>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ADD MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white rounded-xl p-6 w-full max-w-sm space-y-3">
              <h3 className="font-bold text-lg">Add Transaction</h3>

              {["date", "amount", "name", "method", "category"].map((field) => (
                <input
                  key={field}
                  placeholder={field}
                  className="w-full border p-2 rounded"
                  value={newTx[field]}
                  onChange={(e) =>
                    setNewTx({ ...newTx, [field]: e.target.value })
                  }
                />
              ))}

              <div className="flex justify-end gap-2">
                <button onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>

                <button
                  onClick={handleAdd}
                  className="bg-black text-white px-3 py-1 rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}