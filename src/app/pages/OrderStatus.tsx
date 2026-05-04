import { useState } from "react";
import { Clock, Package, CheckCircle, XCircle, FileText, Search, Shield, Lock } from "lucide-react";

const all = [
  { id: "CAT-001", customer: "Budi Santoso", event: "Pernikahan Putri", date: "2026-05-10", pkg: "Platinum", guests: 300, status: "Dikonfirmasi", total: 36000000 },
  { id: "CAT-002", customer: "Siti Rahma", event: "Ulang Tahun ke-50", date: "2026-05-08", pkg: "Gold", guests: 150, status: "Diproses", total: 11250000 },
  { id: "CAT-003", customer: "PT Maju Jaya", event: "Seminar Tahunan", date: "2026-05-06", pkg: "Silver", guests: 200, status: "Selesai", total: 9000000 },
  { id: "CAT-004", customer: "Ahmad Fauzi", event: "Arisan Keluarga", date: "2026-05-05", pkg: "Silver", guests: 80, status: "Dikonfirmasi", total: 3600000 },
  { id: "CAT-005", customer: "CV Barokah", event: "Gathering Karyawan", date: "2026-05-04", pkg: "Gold", guests: 120, status: "Selesai", total: 9000000 },
  { id: "CAT-006", customer: "Rina Amelia", event: "Pesta Ulang Tahun", date: "2026-05-12", pkg: "Silver", guests: 60, status: "Draft", total: 2700000 },
  { id: "CAT-007", customer: "Hendra Gunawan", event: "Rapat Direksi", date: "2026-05-03", pkg: "Gold", guests: 40, status: "Selesai", total: 3000000 },
  { id: "CAT-008", customer: "Dewi Susanti", event: "Wisuda Anak", date: "2026-05-15", pkg: "Platinum", guests: 100, status: "Diproses", total: 12000000 },
];

const categories = [
  { name: "Draft", icon: FileText, bg: "#f1f5f9", color: "#475569", border: "#e2e8f0" },
  { name: "Dikonfirmasi", icon: Clock, bg: "#dbeafe", color: "#1d4ed8", border: "#bfdbfe" },
  { name: "Diproses", icon: Package, bg: "#fef3c7", color: "#d97706", border: "#fed7aa" },
  { name: "Selesai", icon: CheckCircle, bg: "#d1fae5", color: "#059669", border: "#86efac" },
  { name: "Dibatalkan", icon: XCircle, bg: "#fee2e2", color: "#dc2626", border: "#fca5a5" },
];

const fmtRp = (n: number) => `Rp ${(n / 1000000).toFixed(1)}jt`;

export function OrderStatus() {
  const [active, setActive] = useState("Semua");
  const [search, setSearch] = useState("");

  const filtered = all.filter(o => {
    const matchStatus = active === "Semua" || o.status === active;
    const matchSearch = o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const count = (s: string) => all.filter(o => o.status === s).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5 mb-0.5">
          <h2 className="text-xl font-bold text-gray-800">Status Pesanan</h2>
          <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "#d1fae5", color: "#065f46" }}>
            <Shield size={9} />Real-time
          </span>
        </div>
        <p className="text-sm text-gray-500">Pantau status setiap pesanan catering secara real-time</p>
      </div>

      {/* Status summary cards */}
      <div className="grid grid-cols-5 gap-3">
        {categories.map(cat => {
          const Icon = cat.icon;
          const isActive = active === cat.name;
          const c = count(cat.name);
          return (
            <button key={cat.name} onClick={() => setActive(cat.name)} className="p-4 rounded-2xl text-left transition-all" style={{
              background: isActive ? cat.bg : "white",
              border: `2px solid ${isActive ? cat.border : "#e2e8f0"}`,
              boxShadow: isActive ? "0 2px 8px rgba(0,0,0,0.06)" : "none"
            }}>
              <div className="flex items-center justify-between mb-2">
                <Icon size={18} style={{ color: isActive ? cat.color : "#94a3b8" }} />
                <span className="text-2xl font-bold" style={{ color: isActive ? cat.color : "#475569" }}>{c}</span>
              </div>
              <p className="text-xs font-semibold" style={{ color: isActive ? cat.color : "#64748b" }}>{cat.name}</p>
            </button>
          );
        })}
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm" style={{ border: "1px solid #e2e8f0" }}>
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Cari pesanan atau pelanggan..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm outline-none" style={{ borderColor: "#e2e8f0" }} />
        </div>
        <button onClick={() => setActive("Semua")} className="px-4 py-2 rounded-xl text-sm font-semibold transition-all" style={{ background: active === "Semua" ? "#2563eb" : "#f1f5f9", color: active === "Semua" ? "white" : "#475569" }}>
          Semua ({all.length})
        </button>
        {categories.slice(1).map(cat => (
          <button key={cat.name} onClick={() => setActive(cat.name)} className="px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap" style={{
            background: active === cat.name ? cat.bg : "#f8fafc",
            color: active === cat.name ? cat.color : "#94a3b8",
            border: `1px solid ${active === cat.name ? cat.border : "#e2e8f0"}`
          }}>
            {cat.name} ({count(cat.name)})
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.map(o => {
          const cat = categories.find(c => c.name === o.status) ?? categories[0];
          const Icon = cat.icon;
          return (
            <div key={o.id} className="bg-white rounded-2xl p-5 hover:shadow-md transition-all" style={{ border: `2px solid ${cat.border}` }}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-mono font-bold text-gray-500">{o.id}</span>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: cat.bg }}>
                  <Icon size={13} style={{ color: cat.color }} />
                  <span className="text-xs font-semibold" style={{ color: cat.color }}>{o.status}</span>
                </div>
              </div>
              <h3 className="font-bold text-gray-800 mb-0.5">{o.event}</h3>
              <p className="text-sm text-gray-500 mb-3 flex items-center gap-1.5">
                <Lock size={11} className="text-gray-400" />
                {o.customer}
              </p>
              <div className="space-y-1.5 mb-4">
                {[["Paket", `Paket ${o.pkg}`], ["Tanggal", new Date(o.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })], ["Jumlah Tamu", `${o.guests} orang`]].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-gray-400">{k}:</span>
                    <span className="font-medium text-gray-700">{v}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3" style={{ borderTop: `1px solid ${cat.border}` }}>
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "#d1fae5", color: "#065f46" }}>
                  <Shield size={8} />ENCRYPTED
                </span>
                <span className="font-bold text-gray-800">{fmtRp(o.total)}</span>
              </div>
            </div>
          );
        })}
      </div>
      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl p-14 text-center" style={{ border: "1px solid #e2e8f0" }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: "#f1f5f9" }}>
            <Search size={22} className="text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">Tidak ada pesanan ditemukan</p>
        </div>
      )}
    </div>
  );
}
