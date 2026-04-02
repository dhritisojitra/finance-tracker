import { useState } from "react";

const transactions = [
  {
    id: 1,
    date: "25 Jul 12:30",
    amount: -10,
    name: "YouTube",
    method: "VISA **3254",
    category: "Subscription",
    icon: (
      <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center">
        ▶
      </div>
    ),
  },
  {
    id: 2,
    date: "26 Jul 15:00",
    amount: -150,
    name: "Reserved",
    method: "Mastercard **2154",
    category: "Shopping",
    icon: (
      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-white">
        •••
      </div>
    ),
  },
  {
    id: 3,
    date: "27 Jul 9:00",
    amount: -80,
    name: "Yaposhka",
    method: "Mastercard **2154",
    category: "Cafe & Restaurants",
    icon: (
      <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
        🍣
      </div>
    ),
  },
];

export default function TransactionCard({ adminMode }) {
  const [approved, setApproved] = useState({});
  const [hoveredRow, setHoveredRow] = useState(null);

  return (
    <div className="w-full">
      <div className="bg-white rounded-3xl border border-green-100 shadow-xl shadow-green-100/50 p-5 sm:p-7">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
            Recent Transactions
          </h2>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr>
                {["Date", "Amount", "Payment", "Method", "Category", "Status"].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs font-bold text-green-600 uppercase pb-3"
                  >
                    {h}
                  </th>
                ))}
                {adminMode && (
                  <th className="text-left text-xs font-bold text-green-600 uppercase pb-3">
                    Action
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {transactions.map((tx, i) => (
                <tr
                  key={tx.id}
                  className="border-t border-green-50 transition"
                  style={{
                    background:
                      hoveredRow === i ? "#f0fdf4" : "transparent",
                  }}
                  onMouseEnter={() => setHoveredRow(i)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  {/* Date */}
                  <td className="py-3">{tx.date}</td>

                  {/* Amount */}
                  <td className="py-3 font-semibold text-slate-700">
                    - ${Math.abs(tx.amount)}
                  </td>

                  {/* Payment */}
                  <td className="py-3 flex items-center gap-2">
                    {tx.icon}
                    {tx.name}
                  </td>

                  {/* Method */}
                  <td className="py-3 text-slate-500">
                    {tx.method}
                  </td>

                  {/* Category */}
                  <td className="py-3">
                    <span className="bg-green-50 text-green-700 px-2 py-1 rounded-lg text-xs font-semibold">
                      {tx.category}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3">
                    {approved[tx.id] ? (
                      <span className="text-green-600 text-xs font-semibold">
                        Approved
                      </span>
                    ) : (
                      <span className="text-yellow-500 text-xs font-semibold">
                        Pending
                      </span>
                    )}
                  </td>

                  {/* Admin Action */}
                  {adminMode && (
                    <td className="py-3">
                      {!approved[tx.id] && (
                        <button
                          onClick={() =>
                            setApproved((prev) => ({
                              ...prev,
                              [tx.id]: true,
                            }))
                          }
                          className="bg-green-600 text-white text-xs px-3 py-1 rounded-lg hover:bg-green-700"
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom note */}
        <p className="text-center text-xs text-slate-400 mt-4">
          Transaction history · Demo
        </p>
      </div>
    </div>
  );
}