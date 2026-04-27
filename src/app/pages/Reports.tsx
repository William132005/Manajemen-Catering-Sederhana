import { FileText, Download, Printer, TrendingUp, Calendar } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const monthlyData = [
  { month: "Jan", revenue: 4500000, orders: 145 },
  { month: "Feb", revenue: 5200000, orders: 167 },
  { month: "Mar", revenue: 4800000, orders: 152 },
  { month: "Apr", revenue: 6100000, orders: 189 },
];

const serviceData = [
  { name: "Cuci Setrika", value: 45, color: "#3b82f6" },
  { name: "Cuci Kering", value: 30, color: "#8b5cf6" },
  { name: "Setrika Saja", value: 15, color: "#10b981" },
  { name: "Cuci Express", value: 10, color: "#f59e0b" },
];

const transactionData = [
  { date: "2026-04-27", orderId: "ORD-001", customer: "Budi Santoso", service: "Cuci Setrika", amount: 35000, status: "Selesai" },
  { date: "2026-04-27", orderId: "ORD-002", customer: "Siti Nurhaliza", service: "Cuci Kering", amount: 24000, status: "Diproses" },
  { date: "2026-04-26", orderId: "ORD-003", customer: "Ahmad Wijaya", service: "Setrika Saja", amount: 20000, status: "Selesai" },
  { date: "2026-04-26", orderId: "ORD-004", customer: "Rina Marlina", service: "Cuci Setrika", amount: 55000, status: "Selesai" },
  { date: "2026-04-25", orderId: "ORD-005", customer: "Dedi Prasetyo", service: "Cuci Express", amount: 22500, status: "Selesai" },
  { date: "2026-04-25", orderId: "ORD-006", customer: "Putri Ayu", service: "Cuci Setrika", amount: 30000, status: "Selesai" },
  { date: "2026-04-24", orderId: "ORD-007", customer: "Bambang Hermawan", service: "Setrika Saja", amount: 12500, status: "Selesai" },
  { date: "2026-04-24", orderId: "ORD-008", customer: "Indah Permata", service: "Cuci Kering", amount: 54000, status: "Selesai" },
];

export function Reports() {
  const totalRevenue = transactionData.reduce((sum, t) => sum + t.amount, 0);
  const totalOrders = transactionData.length;
  const avgOrderValue = totalRevenue / totalOrders;

  const handleExportPDF = () => {
    alert("Export PDF akan segera tersedia. Fitur ini akan mengunduh laporan dalam format PDF.");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Laporan Transaksi</h2>
          <p className="text-gray-500 mt-1">Ringkasan pendapatan dan aktivitas bisnis</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all shadow-md"
          >
            <Download size={20} />
            Export PDF
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all shadow-md"
          >
            <Printer size={20} />
            Print
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <FileText size={28} />
            <TrendingUp size={20} className="opacity-75" />
          </div>
          <h3 className="text-3xl font-bold mb-1">Rp {totalRevenue.toLocaleString('id-ID')}</h3>
          <p className="text-blue-100">Total Pendapatan</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <Calendar size={28} />
            <TrendingUp size={20} className="opacity-75" />
          </div>
          <h3 className="text-3xl font-bold mb-1">{totalOrders}</h3>
          <p className="text-purple-100">Total Order</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp size={28} />
            <TrendingUp size={20} className="opacity-75" />
          </div>
          <h3 className="text-3xl font-bold mb-1">Rp {Math.round(avgOrderValue).toLocaleString('id-ID')}</h3>
          <p className="text-green-100">Rata-rata per Order</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Pendapatan Bulanan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData} id="bar-chart-monthly-revenue">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`}
              />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribusi Layanan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart id="pie-chart-services">
              <Pie
                data={serviceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {serviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transaction Trend */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Tren Order Bulanan</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={monthlyData} id="line-chart-monthly-orders">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            />
            <Legend />
            <Line type="monotone" dataKey="orders" stroke="#8b5cf6" strokeWidth={3} name="Jumlah Order" dot={{ fill: '#8b5cf6', r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Riwayat Transaksi</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pelanggan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Layanan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactionData.map((transaction) => (
                <tr key={transaction.orderId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {new Date(transaction.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{transaction.orderId}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{transaction.customer}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{transaction.service}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    Rp {transaction.amount.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                      transaction.status === "Selesai" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t-2 border-gray-300">
              <tr>
                <td colSpan={4} className="px-6 py-4 text-sm font-bold text-gray-800 text-right">
                  TOTAL PENDAPATAN:
                </td>
                <td className="px-6 py-4 text-sm font-bold text-blue-600">
                  Rp {totalRevenue.toLocaleString('id-ID')}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}