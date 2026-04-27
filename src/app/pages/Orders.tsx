import { useState } from "react";
import { Plus, Edit, Trash2, Eye, Search, Shield, Calendar, Lock, CheckCircle, Wifi, Database, Key, Hash } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

interface Order {
  id: string;
  customerId: string;
  customerName: string;
  service: string;
  weight: number;
  dateIn: string;
  dateOut: string;
  status: string;
  totalCost: number;
  notes: string;
}

const initialOrders: Order[] = [
  {
    id: "ORD-001",
    customerId: "CST-001",
    customerName: "Budi Santoso",
    service: "Cuci Setrika",
    weight: 3.5,
    dateIn: "2026-04-27",
    dateOut: "2026-04-29",
    status: "Diproses",
    totalCost: 35000,
    notes: "Pisahkan pakaian putih"
  },
  {
    id: "ORD-002",
    customerId: "CST-002",
    customerName: "Siti Nurhaliza",
    service: "Cuci Kering",
    weight: 2.0,
    dateIn: "2026-04-27",
    dateOut: "2026-04-28",
    status: "Menunggu",
    totalCost: 24000,
    notes: ""
  },
  {
    id: "ORD-003",
    customerId: "CST-003",
    customerName: "Ahmad Wijaya",
    service: "Setrika Saja",
    weight: 4.0,
    dateIn: "2026-04-26",
    dateOut: "2026-04-27",
    status: "Selesai",
    totalCost: 20000,
    notes: "Hati-hati dengan bahan sutra"
  },
];

const services = [
  { name: "Cuci Setrika", price: 10000 },
  { name: "Cuci Kering", price: 12000 },
  { name: "Setrika Saja", price: 5000 },
  { name: "Cuci Express", price: 15000 },
];

const customers = [
  { id: "CST-001", name: "Budi Santoso" },
  { id: "CST-002", name: "Siti Nurhaliza" },
  { id: "CST-003", name: "Ahmad Wijaya" },
  { id: "CST-004", name: "Rina Marlina" },
  { id: "CST-005", name: "Dedi Prasetyo" },
];

export function Orders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState({
    customerId: "",
    customerName: "",
    service: "",
    weight: 0,
    dateIn: new Date().toISOString().split('T')[0],
    dateOut: "",
    notes: ""
  });
  const [isEncryptSimOpen, setIsEncryptSimOpen] = useState(false);
  const [encryptStep, setEncryptStep] = useState(0);
  const [encryptDone, setEncryptDone] = useState(false);
  const [pendingAction, setPendingAction] = useState<"add" | "edit" | null>(null);

  const filteredOrders = orders.filter(order =>
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateCost = (service: string, weight: number) => {
    const serviceData = services.find(s => s.name === service);
    return serviceData ? serviceData.price * weight : 0;
  };

  const handleAdd = () => {
    const totalCost = calculateCost(formData.service, formData.weight);
    const newOrder: Order = {
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      customerId: formData.customerId,
      customerName: formData.customerName,
      service: formData.service,
      weight: formData.weight,
      dateIn: formData.dateIn,
      dateOut: formData.dateOut,
      status: "Menunggu",
      totalCost,
      notes: formData.notes
    };
    setOrders([...orders, newOrder]);
    resetForm();
    setIsAddOpen(false);
  };

  const handleEdit = () => {
    if (selectedOrder) {
      const totalCost = calculateCost(formData.service, formData.weight);
      setOrders(orders.map(o =>
        o.id === selectedOrder.id ? {
          ...o,
          customerId: formData.customerId,
          customerName: formData.customerName,
          service: formData.service,
          weight: formData.weight,
          dateIn: formData.dateIn,
          dateOut: formData.dateOut,
          totalCost,
          notes: formData.notes
        } : o
      ));
      setIsEditOpen(false);
      setSelectedOrder(null);
      resetForm();
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus order ini?")) {
      setOrders(orders.filter(o => o.id !== id));
    }
  };

  const handleStatusUpdate = (id: string, newStatus: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const resetForm = () => {
    setFormData({
      customerId: "",
      customerName: "",
      service: "",
      weight: 0,
      dateIn: new Date().toISOString().split('T')[0],
      dateOut: "",
      notes: ""
    });
  };

  const openEdit = (order: Order) => {
    setSelectedOrder(order);
    setFormData({
      customerId: order.customerId,
      customerName: order.customerName,
      service: order.service,
      weight: order.weight,
      dateIn: order.dateIn,
      dateOut: order.dateOut,
      notes: order.notes
    });
    setIsEditOpen(true);
  };

  const openDetail = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const handleCustomerChange = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    setFormData({
      ...formData,
      customerId,
      customerName: customer ? customer.name : ""
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Menunggu": return "bg-yellow-100 text-yellow-700";
      case "Diproses": return "bg-blue-100 text-blue-700";
      case "Selesai": return "bg-green-100 text-green-700";
      case "Sudah Diambil": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const runEncryptionSimulation = (action: "add" | "edit") => {
    setPendingAction(action);
    setEncryptStep(0);
    setEncryptDone(false);
    setIsEncryptSimOpen(true);
    const steps = [0, 1, 2, 3];
    steps.forEach((step, i) => {
      setTimeout(() => {
        setEncryptStep(step + 1);
        if (i === steps.length - 1) {
          setEncryptDone(true);
        }
      }, (i + 1) * 900);
    });
  };

  const handleEncryptConfirm = () => {
    if (pendingAction === "add") {
      handleAdd();
    } else if (pendingAction === "edit") {
      handleEdit();
    }
    setIsEncryptSimOpen(false);
    setEncryptStep(0);
    setEncryptDone(false);
    setPendingAction(null);
  };

  const encryptSteps = [
    { icon: Wifi, label: "Mengambil Data Jaringan", desc: "IPv4, MAC, Hostname terdeteksi", color: "blue" },
    { icon: Key, label: "Membentuk Encryption Key", desc: "Hash(IPv4 + MAC + Hostname) → 256-bit", color: "purple" },
    { icon: Lock, label: "Mengenkripsi Data Order", desc: "ChaCha20 stream cipher aktif", color: "indigo" },
    { icon: Database, label: "Menyimpan ke Database", desc: "Data terenkripsi disimpan ke SQLite", color: "green" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-gray-800">Manajemen Order Laundry</h2>
          <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
            <Shield size={12} />
            <span>Data Dienkripsi ChaCha20</span>
          </div>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all shadow-md"
        >
          <Plus size={20} />
          Tambah Order
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari order berdasarkan ID, pelanggan, atau layanan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Pelanggan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jenis Layanan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Berat (kg)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal Masuk</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal Selesai</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Biaya</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div className="flex items-center gap-1.5">
                      <Lock size={11} className="text-indigo-400" />
                      {order.customerName}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{order.service}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{order.weight} kg</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{new Date(order.dateIn).toLocaleDateString('id-ID')}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{new Date(order.dateOut).toLocaleDateString('id-ID')}</td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      className={`px-3 py-1 text-xs font-medium rounded-full border-0 outline-none cursor-pointer ${getStatusColor(order.status)}`}
                    >
                      <option value="Menunggu">Menunggu</option>
                      <option value="Diproses">Diproses</option>
                      <option value="Selesai">Selesai</option>
                      <option value="Sudah Diambil">Sudah Diambil</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    <div className="flex items-center gap-1">
                      <Lock size={11} className="text-indigo-400" />
                      Rp {order.totalCost.toLocaleString('id-ID')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openDetail(order)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Lihat Detail"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => openEdit(order)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                        title="Edit Order"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Hapus"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Order Modal */}
      <Dialog.Root open={isAddOpen} onOpenChange={setIsAddOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <Dialog.Title className="text-xl font-bold text-gray-800 mb-2">Tambah Order Baru</Dialog.Title>

            {/* Encryption Notice */}
            <div className="flex items-center gap-2.5 bg-indigo-50 border border-indigo-200 rounded-lg p-3 mb-4">
              <Shield size={16} className="text-indigo-600 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-indigo-700">Perlindungan Data Aktif</p>
                <p className="text-xs text-indigo-600">Data akan dienkripsi otomatis dengan ChaCha20 sebelum disimpan ke database</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Pelanggan</label>
                <select
                  value={formData.customerId}
                  onChange={(e) => handleCustomerChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">-- Pilih Pelanggan --</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>{customer.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Layanan</label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">-- Pilih Layanan --</option>
                  {services.map(service => (
                    <option key={service.name} value={service.name}>
                      {service.name} - Rp {service.price.toLocaleString('id-ID')}/kg
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Berat Laundry (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.weight || ""}
                  onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Biaya <Lock size={11} className="inline text-indigo-500 ml-1" />
                </label>
                <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg font-semibold text-gray-800">
                  Rp {calculateCost(formData.service, formData.weight).toLocaleString('id-ID')}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Masuk</label>
                <input
                  type="date"
                  value={formData.dateIn}
                  onChange={(e) => setFormData({ ...formData, dateIn: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estimasi Selesai</label>
                <input
                  type="date"
                  value={formData.dateOut}
                  onChange={(e) => setFormData({ ...formData, dateOut: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan Tambahan <Lock size={11} className="inline text-indigo-500 ml-1" />
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  rows={3}
                  placeholder="Catatan khusus untuk order ini..."
                />
              </div>
            </div>

            {/* Encrypted fields info */}
            <div className="flex items-center gap-2 mt-3 text-xs text-indigo-600">
              <Lock size={11} />
              <span>Field bertanda gembok akan dienkripsi otomatis dengan ChaCha20</span>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setIsAddOpen(false); resetForm(); }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              >
                Batal
              </button>
              <button
                onClick={() => { setIsAddOpen(false); runEncryptionSimulation("add"); }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
              >
                <Shield size={16} />
                Simpan & Enkripsi Order
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Edit Order Modal */}
      <Dialog.Root open={isEditOpen} onOpenChange={setIsEditOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <Dialog.Title className="text-xl font-bold text-gray-800 mb-2">Edit Order</Dialog.Title>

            {/* Encryption Notice */}
            <div className="flex items-center gap-2.5 bg-indigo-50 border border-indigo-200 rounded-lg p-3 mb-4">
              <Shield size={16} className="text-indigo-600 shrink-0" />
              <p className="text-xs text-indigo-700 font-medium">Data akan dienkripsi ulang dengan ChaCha20 saat disimpan</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Pelanggan</label>
                <select
                  value={formData.customerId}
                  onChange={(e) => handleCustomerChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">-- Pilih Pelanggan --</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>{customer.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Layanan</label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">-- Pilih Layanan --</option>
                  {services.map(service => (
                    <option key={service.name} value={service.name}>
                      {service.name} - Rp {service.price.toLocaleString('id-ID')}/kg
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Berat Laundry (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.weight || ""}
                  onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Biaya</label>
                <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg font-semibold text-gray-800">
                  Rp {calculateCost(formData.service, formData.weight).toLocaleString('id-ID')}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Masuk</label>
                <input
                  type="date"
                  value={formData.dateIn}
                  onChange={(e) => setFormData({ ...formData, dateIn: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estimasi Selesai</label>
                <input
                  type="date"
                  value={formData.dateOut}
                  onChange={(e) => setFormData({ ...formData, dateOut: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Tambahan</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setIsEditOpen(false); resetForm(); }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              >
                Batal
              </button>
              <button
                onClick={() => { setIsEditOpen(false); runEncryptionSimulation("edit"); }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
              >
                <Shield size={16} />
                Update & Enkripsi
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Detail Order Modal */}
      <Dialog.Root open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg">
            <Dialog.Title className="text-xl font-bold text-gray-800 mb-4">Detail Order</Dialog.Title>
            {selectedOrder && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">ID Order</p>
                    <p className="font-semibold text-gray-800">{selectedOrder.id}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-1.5 mb-1">
                    <p className="text-xs text-gray-500">Nama Pelanggan</p>
                    <Lock size={10} className="text-indigo-400" />
                    <span className="text-xs text-indigo-500 font-medium">Terenkripsi</span>
                  </div>
                  <p className="font-semibold text-gray-800">{selectedOrder.customerName}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Jenis Layanan</p>
                    <p className="font-semibold text-gray-800">{selectedOrder.service}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Berat</p>
                    <p className="font-semibold text-gray-800">{selectedOrder.weight} kg</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Tanggal Masuk</p>
                    <p className="font-semibold text-gray-800">{new Date(selectedOrder.dateIn).toLocaleDateString('id-ID')}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Tanggal Selesai</p>
                    <p className="font-semibold text-gray-800">{new Date(selectedOrder.dateOut).toLocaleDateString('id-ID')}</p>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                  <div className="flex items-center gap-1.5 mb-1">
                    <p className="text-xs text-blue-600">Total Biaya</p>
                    <Lock size={10} className="text-indigo-500" />
                    <span className="text-xs text-indigo-600 font-medium">Terenkripsi</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-700">Rp {selectedOrder.totalCost.toLocaleString('id-ID')}</p>
                </div>
                {selectedOrder.notes && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-1.5 mb-1">
                      <p className="text-xs text-gray-500">Catatan</p>
                      <Lock size={10} className="text-indigo-400" />
                    </div>
                    <p className="text-gray-800">{selectedOrder.notes}</p>
                  </div>
                )}
                {/* Security Footer */}
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg p-2.5">
                  <Shield size={13} className="text-green-600" />
                  <p className="text-xs text-green-700">Data ini dienkripsi dengan ChaCha20 menggunakan kunci berbasis jaringan perangkat</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setIsDetailOpen(false)}
              className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              Tutup
            </button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Encryption Simulation Modal */}
      <Dialog.Root open={isEncryptSimOpen} onOpenChange={() => {}}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <Dialog.Title className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
              <Shield size={20} className="text-indigo-600" />
              Proses Enkripsi Data Order
            </Dialog.Title>
            <p className="text-sm text-gray-500 mb-5">Mengamankan data dengan algoritma ChaCha20...</p>

            <div className="space-y-3">
              {encryptSteps.map((step, index) => {
                const Icon = step.icon;
                const isDone = encryptStep > index + 1;
                const isActive = encryptStep === index + 1;
                const isPending = encryptStep <= index;
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-500 ${
                      isDone ? "bg-green-50 border-green-200" :
                      isActive ? "bg-blue-50 border-blue-300 shadow-sm" :
                      "bg-gray-50 border-gray-100 opacity-50"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      isDone ? "bg-green-500" :
                      isActive ? "bg-blue-500 animate-pulse" :
                      "bg-gray-200"
                    }`}>
                      {isDone
                        ? <CheckCircle size={18} className="text-white" />
                        : <Icon size={18} className={isActive ? "text-white" : "text-gray-400"} />
                      }
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        isDone ? "text-green-800" : isActive ? "text-blue-800" : "text-gray-500"
                      }`}>{step.label}</p>
                      <p className={`text-xs ${
                        isDone ? "text-green-600" : isActive ? "text-blue-600" : "text-gray-400"
                      }`}>{step.desc}</p>
                    </div>
                    {isActive && (
                      <div className="flex gap-1">
                        {[0, 1, 2].map(d => (
                          <span key={d} className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />
                        ))}
                      </div>
                    )}
                    {isDone && <CheckCircle size={16} className="text-green-500 shrink-0" />}
                  </div>
                );
              })}
            </div>

            {encryptDone && (
              <div className="mt-4 flex items-center gap-2 bg-green-50 border border-green-300 rounded-lg p-3">
                <CheckCircle size={18} className="text-green-600 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-green-800">Enkripsi Berhasil!</p>
                  <p className="text-xs text-green-600">Data order telah diamankan dan siap disimpan ke database</p>
                </div>
              </div>
            )}

            <button
              onClick={handleEncryptConfirm}
              disabled={!encryptDone}
              className="w-full mt-4 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {encryptDone ? (
                <>
                  <Database size={16} />
                  Konfirmasi & Simpan ke Database
                </>
              ) : (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Memproses Enkripsi...
                </>
              )}
            </button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}