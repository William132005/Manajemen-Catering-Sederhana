import { useState } from "react";
import { Clock, Package, CheckCircle, Archive, Search } from "lucide-react";

interface Order {
  id: string;
  customerName: string;
  service: string;
  weight: number;
  dateIn: string;
  dateOut: string;
  status: string;
  totalCost: number;
}

const allOrders: Order[] = [
  { id: "ORD-001", customerName: "Budi Santoso", service: "Cuci Setrika", weight: 3.5, dateIn: "2026-04-27", dateOut: "2026-04-29", status: "Diproses", totalCost: 35000 },
  { id: "ORD-002", customerName: "Siti Nurhaliza", service: "Cuci Kering", weight: 2.0, dateIn: "2026-04-27", dateOut: "2026-04-28", status: "Menunggu", totalCost: 24000 },
  { id: "ORD-003", customerName: "Ahmad Wijaya", service: "Setrika Saja", weight: 4.0, dateIn: "2026-04-26", dateOut: "2026-04-27", status: "Selesai", totalCost: 20000 },
  { id: "ORD-004", customerName: "Rina Marlina", service: "Cuci Setrika", weight: 5.5, dateIn: "2026-04-26", dateOut: "2026-04-28", status: "Diproses", totalCost: 55000 },
  { id: "ORD-005", customerName: "Dedi Prasetyo", service: "Cuci Express", weight: 1.5, dateIn: "2026-04-25", dateOut: "2026-04-26", status: "Sudah Diambil", totalCost: 22500 },
  { id: "ORD-006", customerName: "Putri Ayu", service: "Cuci Setrika", weight: 3.0, dateIn: "2026-04-27", dateOut: "2026-04-29", status: "Menunggu", totalCost: 30000 },
  { id: "ORD-007", customerName: "Bambang Hermawan", service: "Setrika Saja", weight: 2.5, dateIn: "2026-04-26", dateOut: "2026-04-27", status: "Selesai", totalCost: 12500 },
  { id: "ORD-008", customerName: "Indah Permata", service: "Cuci Kering", weight: 4.5, dateIn: "2026-04-25", dateOut: "2026-04-27", status: "Sudah Diambil", totalCost: 54000 },
];

const statusCategories = [
  { name: "Menunggu", icon: Clock, color: "yellow", bgColor: "bg-yellow-50", borderColor: "border-yellow-200", textColor: "text-yellow-700" },
  { name: "Diproses", icon: Package, color: "blue", bgColor: "bg-blue-50", borderColor: "border-blue-200", textColor: "text-blue-700" },
  { name: "Selesai", icon: CheckCircle, color: "green", bgColor: "bg-green-50", borderColor: "border-green-200", textColor: "text-green-700" },
  { name: "Sudah Diambil", icon: Archive, color: "gray", bgColor: "bg-gray-50", borderColor: "border-gray-200", textColor: "text-gray-700" },
];

export function OrderStatus() {
  const [selectedStatus, setSelectedStatus] = useState<string>("Semua");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = allOrders.filter(order => {
    const matchesStatus = selectedStatus === "Semua" || order.status === selectedStatus;
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusStats = (status: string) => {
    return allOrders.filter(order => order.status === status).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Status Pesanan</h2>
        <p className="text-gray-500 mt-1">Pantau status order laundry secara real-time</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-4 gap-4">
        {statusCategories.map((status) => {
          const Icon = status.icon;
          const count = getStatusStats(status.name);

          return (
            <button
              key={status.name}
              onClick={() => setSelectedStatus(status.name)}
              className={`p-6 rounded-xl border-2 transition-all text-left ${
                selectedStatus === status.name
                  ? `${status.bgColor} ${status.borderColor} shadow-md`
                  : "bg-white border-gray-200 hover:shadow-md"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon size={28} className={selectedStatus === status.name ? status.textColor : "text-gray-400"} />
                <span className={`text-3xl font-bold ${selectedStatus === status.name ? status.textColor : "text-gray-700"}`}>
                  {count}
                </span>
              </div>
              <p className={`font-medium ${selectedStatus === status.name ? status.textColor : "text-gray-600"}`}>
                {status.name}
              </p>
            </button>
          );
        })}
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSelectedStatus("Semua")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            selectedStatus === "Semua"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          Semua ({allOrders.length})
        </button>
        {statusCategories.map((status) => (
          <button
            key={status.name}
            onClick={() => setSelectedStatus(status.name)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedStatus === status.name
                ? `${status.bgColor} ${status.textColor} border-2 ${status.borderColor}`
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {status.name} ({getStatusStats(status.name)})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari order berdasarkan ID atau nama pelanggan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map((order) => {
          const statusInfo = statusCategories.find(s => s.name === order.status);
          const Icon = statusInfo?.icon || Clock;

          return (
            <div
              key={order.id}
              className={`bg-white rounded-xl shadow-sm border-2 ${statusInfo?.borderColor} p-6 hover:shadow-md transition-all`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-gray-900">{order.id}</span>
                <div className={`p-2 rounded-lg ${statusInfo?.bgColor}`}>
                  <Icon size={20} className={statusInfo?.textColor} />
                </div>
              </div>

              <h3 className="font-semibold text-gray-800 mb-2">{order.customerName}</h3>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Layanan:</span>
                  <span className="text-gray-700 font-medium">{order.service}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Berat:</span>
                  <span className="text-gray-700 font-medium">{order.weight} kg</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Masuk:</span>
                  <span className="text-gray-700 font-medium">{new Date(order.dateIn).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Selesai:</span>
                  <span className="text-gray-700 font-medium">{new Date(order.dateOut).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                </div>
              </div>

              <div className={`pt-4 border-t ${statusInfo?.borderColor} flex items-center justify-between`}>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo?.bgColor} ${statusInfo?.textColor}`}>
                  {order.status}
                </span>
                <span className="font-bold text-gray-900">
                  Rp {order.totalCost.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredOrders.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Tidak ada order</h3>
          <p className="text-gray-500">Tidak ditemukan order dengan status "{selectedStatus}"</p>
        </div>
      )}
    </div>
  );
}
