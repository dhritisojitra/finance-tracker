import { useState } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";

/**
 * WidgetManager
 *
 * Props:
 *   allWidgets   – array of { id, label, icon, span }
 *   widgetOrder  – current ordered array of widget ids
 *   hiddenWidgets – Set of hidden widget ids
 *   onClose()    – called when user dismisses without saving
 *   onSave({ order, hidden }) – called when user confirms changes
 */
export default function WidgetManager({ allWidgets, widgetOrder, hiddenWidgets, onClose, onSave }) {
  // Local draft state – only applied when user hits "Save"
  const [draftOrder,  setDraftOrder]  = useState([...widgetOrder]);
  const [draftHidden, setDraftHidden] = useState(new Set(hiddenWidgets));

  const toggleVisibility = (id) => {
    setDraftHidden((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const reset = () => {
    setDraftOrder(allWidgets.map((w) => w.id));
    setDraftHidden(new Set());
  };

  // Build ordered widget meta for the drag list
  const orderedMeta = draftOrder.map((id) => allWidgets.find((w) => w.id === id)).filter(Boolean);

  return (
    <motion.div
      key="widget-manager-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.92, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 24 }}
        transition={{ type: "spring", stiffness: 340, damping: 28 }}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-white">Manage Widgets</h2>
            <p className="text-xs text-slate-400 mt-0.5">Drag to reorder · toggle to show/hide</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-lg"
          >
            ✕
          </button>
        </div>

        {/* Drag list */}
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Widget Order
          </p>

          <Reorder.Group
            axis="y"
            values={draftOrder}
            onReorder={setDraftOrder}
            className="space-y-2 select-none"
          >
            {orderedMeta.map((widget) => {
              const hidden = draftHidden.has(widget.id);
              return (
                <Reorder.Item
                  key={widget.id}
                  value={widget.id}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl cursor-grab active:cursor-grabbing
                    border transition-all duration-200
                    ${hidden
                      ? "border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 opacity-50"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm"}
                  `}
                  whileDrag={{ scale: 1.03, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
                >
                  {/* Drag handle */}
                  <span className="text-slate-300 dark:text-slate-600 text-lg leading-none flex-shrink-0">
                    ⠿
                  </span>

                  {/* Icon + label */}
                  <span className="text-xl flex-shrink-0">{widget.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${hidden ? "text-slate-400" : "text-slate-700 dark:text-slate-200"}`}>
                      {widget.label}
                    </p>
                    <p className="text-xs text-slate-400">
                      {widget.span === 5 ? "Full width" : `${widget.span}/5 columns`}
                    </p>
                  </div>

                  {/* Visibility toggle */}
                  <button
                    onClick={() => toggleVisibility(widget.id)}
                    title={hidden ? "Show widget" : "Hide widget"}
                    className={`
                      w-8 h-8 flex items-center justify-center rounded-lg transition-all text-sm
                      ${hidden
                        ? "bg-slate-100 dark:bg-slate-700 text-slate-400 hover:bg-indigo-50 hover:text-indigo-500"
                        : "bg-indigo-50 dark:bg-indigo-900/40 text-indigo-500 hover:bg-red-50 hover:text-red-400"}
                    `}
                  >
                    {hidden ? "👁️" : "✓"}
                  </button>
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        </div>

        {/* Tip */}
        <div className="mx-6 mb-4 px-3 py-2.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
          <p className="text-xs text-indigo-500 dark:text-indigo-400">
            💡 Drag the <strong>⠿</strong> handle to reorder. Click the checkmark to hide a widget.
          </p>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={reset}
            className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            Reset to default
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave({ order: draftOrder, hidden: draftHidden })}
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-indigo-500 hover:bg-indigo-600 text-white transition shadow-sm shadow-indigo-200 dark:shadow-none"
            >
              Save Layout
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}