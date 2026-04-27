import { Users, ShoppingBag, Clock, CheckCircle, TrendingUp } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const statsData = [
  { label: "Total Pelanggan", value: "248", icon: Users, color: "blue" },
  { label: "Order Hari Ini", value: "32", icon: ShoppingBag, color: "green" },
  { label: "Order Diproses", value: "18", icon: Clock, color: "orange" },
  { label: "Order Selesai", value: "156", icon: CheckCircle, color: "purple" },
];

const weeklyData = [
  { day: "Sen", orders: 24 },
  { day: "Sel", orders: 32 },
  { day: "Rab", orders: 28 },
  { day: "Kam", orders: 35 },
  { day: "Jum", orders: 42 },
  { day: "Sab", orders: 38 },
  { day: "Min", orders: 30 },
];

const recentOrders = [
  { id: "ORD-001", customer: "Budi Santoso", service: "Cuci Setrika", weight: "3.5 kg", status: "Diproses", date: "27 Apr 2026" },
  { id: "ORD-002", customer: "Siti Nurhaliza", service: "Cuci Kering", weight: "2.0 kg", status: "Menunggu", date: "27 Apr 2026" },
  { id: "ORD-003", customer: "Ahmad Wijaya", service: "Setrika Saja", weight: "4.0 kg", status: "Selesai", date: "26 Apr 2026" },
  { id: "ORD-004", customer: "Rina Marlina", service: "Cuci Setrika", weight: "5.5 kg", status: "Diproses", date: "26 Apr 2026" },
  { id: "ORD-005", customer: "Dedi Prasetyo", service: "Cuci Express", weight: "1.5 kg", status: "Selesai", date: "26 Apr 2026" },
];

export function Dashboard() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Menunggu": return "bg-yellow-100 text-yellow-700";
      case "Diproses": return "bg-blue-100 text-blue-700";
      case "Selesai": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: "bg-blue-100 text-blue-600",
            green: "bg-green-100 text-green-600",
            orange: "bg-orange-100 text-orange-600",
            purple: "bg-purple-100 text-purple-600",
          }[stat.color];

          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses}`}>
                  <Icon size={24} />
                </div>
                <TrendingUp size={16} className="text-green-500" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Grafik Order Mingguan</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData} id="bar-chart-weekly">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Bar dataKey="orders" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Tren Pendapatan</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyData} id="line-chart-revenue">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Line type="monotone" dataKey="orders" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Order Terbaru</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pelanggan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jenis Layanan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Berat</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{order.customer}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{order.service}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{order.weight}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{order.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}