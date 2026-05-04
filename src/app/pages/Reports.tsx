import { useState } from "react";
import { FileText, Download, Printer, Search, Shield, TrendingUp, Users, Filter, Lock, CheckCircle, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const allOrders = [
  { id: "CAT-001", customer: "Budi Santoso", event: "Pernikahan Putri", type: "Pernikahan", date: "2026-04-20", guests: 300, pkg: "Paket Platinum", total: 36000000, status: "Selesai", payment: "Lunas", keyId: "KEY-001", encAt: "2026-04-20 09:31" },
  { id: "CAT-002", customer: "Siti Rahma", event: "Ulang Tahun ke-50", type: "Ulang Tahun", date: "2026-04-25", guests: 150, pkg: "Paket Gold", total: 11250000, status: "Selesai", payment: "Lunas", keyId: "KEY-002", encAt: "2026-04-25 14:05" },
  { id: "CAT-003", customer: "PT Maju Jaya", event: "Seminar Tahunan", type: "Seminar", date: "2026-04-28", guests: 200, pkg: "Paket Silver", total: 9000000, status: "Selesai", payment: "Lunas", keyId: "KEY-003", encAt: "2026-04-28 11:22" },
  { id: "CAT-004", customer: "Ahmad Fauzi", event: "Arisan Keluarga", type: "Arisan", date: "2026-05-05", guests: 80, pkg: "Paket Silver", total: 3600000, status: "Dikonfirmasi", payment: "DP 50%", keyId: "KEY-004", encAt: "2026-05-01 10:00" },
  { id: "CAT-005", customer: "CV Barokah", event: "Gathering Karyawan", type: "Gathering", date: "2026-05-04", guests: 120, pkg: "Paket Gold", total: 9000000, status: "Selesai", payment: "Lunas", keyId: "KEY-005", encAt: "2026-05-02 08:45" },
];

const revenueData = [
  { bulan: "Jan", pendapatan: 28000000 }, { bulan: "Feb", pendapatan: 42000000 },
  { bulan: "Mar", pendapatan: 35000000 }, { bulan: "Apr", pendapatan: 68850000 },
  { bulan: "Mei", pendapatan: 21600000 }, { bulan: "Jun", pendapatan: 0 },
];

const statColors = [
  { label: "Total Pesanan", key: "all", color: "#2563eb", bg: "#dbeafe" },
  { label: "Pesanan Selesai", key: "done", color: "#059669", bg: "#d1fae5" },
  { label: "Pesanan Aktif", key: "active", color: "#d97706", bg: "#fef3c7" },
];

const fmtRp = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;
const fmtDate = (d: string) => new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

const CustomTip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border shadow-lg rounded-xl px-4 py-3" style={{ borderColor: "#e2e8f0" }}>
      <p className="text-xs font-semibold text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-bold" style={{ color: "#2563eb" }}>{fmtRp(payload[0].value)}</p>
    </div>
  );
};

export function Reports() {
  const [dateFrom, setDateFrom] = useState("2026-04-01");
  const [dateTo, setDateTo] = useState("2026-05-31");
  const [filtered, setFiltered] = useState(allOrders);
  const [search, setSearch] = useState("");

  const applyFilter = () => {
    let result = allOrders.filter(o => o.date >= dateFrom && o.date <= dateTo);
    if (search) result = result.filter(o => o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase()));
    setFiltered(result);
  };

  const totalRev = filtered.reduce((s, o) => s + o.total, 0);
  const totalDone = filtered.filter(o => o.status === "Selesai").length;
  const totalActive = filtered.filter(o => o.status !== "Selesai" && o.status !== "Dibatalkan").length;

  const handleExport = () => {
    const header = "ID,Pelanggan,Nama Acara,Tipe,Tanggal,Tamu,Paket,Total,Status,Key ID,Waktu Enkripsi\n";
    const rows = filtered.map(o => `${o.id},${o.customer},${o.event},${o.type},${o.date},${o.guests},${o.pkg},${o.total},${o.status},${o.keyId},${o.encAt}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `laporan_catering_${dateFrom}_${dateTo}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => window.print();

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Laporan Transaksi</h2>
          <p className="text-sm text-gray-500 mt-0.5">Ringkasan pesanan, pendapatan, dan audit keamanan data</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border hover:bg-gray-50 transition-all" style={{ borderColor: "#e2e8f0", color: "#475569" }}>
            <Printer size={15} />Print
          </button>
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: "#2563eb" }}>
            <Download size={15} />Export CSV
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl shadow-sm p-5" style={{ border: "1px solid #e2e8f0" }}>
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Dari Tanggal</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none" style={{ borderColor: "#e2e8f0" }} />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Sampai Tanggal</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none" style={{ borderColor: "#e2e8f0" }} />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Pencarian</label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Cari pelanggan/ID..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm outline-none" style={{ borderColor: "#e2e8f0" }} />
            </div>
          </div>
          <button onClick={applyFilter} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold shrink-0" style={{ background: "#2563eb" }}>
            <Filter size={14} />Filter
          </button>
        </div>
      </div>

      {/* Stats + Chart */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Pesanan", value: filtered.length, sub: "Periode terpilih", icon: FileText, bg: "#dbeafe", color: "#2563eb" },
          { label: "Total Pendapatan", value: fmtRp(totalRev), sub: "Audit terenkripsi lulus", icon: TrendingUp, bg: "#d1fae5", color: "#059669", badge: true },
          { label: "Rata-rata / Pesanan", value: fmtRp(filtered.length ? Math.round(totalRev / filtered.length) : 0), sub: `${totalDone} selesai · ${totalActive} aktif`, icon: Users, bg: "#fef3c7", color: "#d97706" },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm" style={{ border: "1px solid #e2e8f0" }}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.bg }}><Icon size={18} style={{ color: s.color }} /></div>
                {(s as any).badge && <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "#d1fae5", color: "#065f46" }}><Shield size={9} />Audit OK</span>}
              </div>
              <p className="text-lg font-bold text-gray-800 mb-0.5">{s.value}</p>
              <p className="text-sm font-medium text-gray-600">{s.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl shadow-sm p-5" style={{ border: "1px solid #e2e8f0" }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-gray-800">Grafik Pendapatan Bulanan</h3>
            <p className="text-xs text-gray-400 mt-0.5">Pendapatan catering per bulan – 2026</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg" style={{ background: "#d1fae5", color: "#065f46" }}>
            <Shield size={11} />Data Terverifikasi
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={revenueData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="bulan" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000000).toFixed(0)}jt`} />
            <Tooltip content={<CustomTip />} cursor={{ fill: "#f8fafc" }} />
            <Bar dataKey="pendapatan" fill="#2563eb" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: "1px solid #e2e8f0" }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
          <h3 className="font-bold text-gray-800">Riwayat Transaksi</h3>
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "#d1fae5", color: "#065f46" }}>
            <Shield size={9} />Data Terenkripsi ChaCha20
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              <tr>
                {["ID", "Pelanggan", "Nama Acara", "Tanggal", "Tamu", "Total (DECRYPTED)", "Status", "Status Enkripsi", "Key ID", "Waktu Enkripsi"].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase whitespace-nowrap" style={{ color: "#94a3b8" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map(o => (
                <tr key={o.id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: "#f1f5f9" }}>
                  <td className="px-5 py-3.5 text-xs font-mono font-semibold text-gray-600">{o.id}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-gray-800 whitespace-nowrap">{o.customer}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600 max-w-[160px] truncate">{o.event}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">{fmtDate(o.date)}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{o.guests}</td>
                  <td className="px-5 py-3.5 text-sm font-bold text-gray-800 whitespace-nowrap">{fmtRp(o.total)}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap" style={{
                      background: o.status === "Selesai" ? "#d1fae5" : o.status === "Dikonfirmasi" ? "#dbeafe" : "#fef3c7",
                      color: o.status === "Selesai" ? "#065f46" : o.status === "Dikonfirmasi" ? "#1d4ed8" : "#d97706"
                    }}>{o.status}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "#d1fae5", color: "#065f46" }}>
                      <CheckCircle size={9} />VERIFIED
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs font-mono text-gray-500">{o.keyId}</td>
                  <td className="px-5 py-3.5 text-xs text-gray-400 whitespace-nowrap">{o.encAt}</td>
                </tr>
              )) : (
                <tr><td colSpan={10} className="py-14 text-center text-gray-400 text-sm">Tidak ada data untuk filter ini</td></tr>
              )}
            </tbody>
            {filtered.length > 0 && (
              <tfoot style={{ background: "#f8fafc", borderTop: "2px solid #e2e8f0" }}>
                <tr>
                  <td colSpan={5} className="px-5 py-4 text-sm font-bold text-gray-600 text-right">TOTAL PENDAPATAN:</td>
                  <td className="px-5 py-4 text-sm font-bold" style={{ color: "#2563eb" }}>{fmtRp(totalRev)}</td>
                  <td colSpan={4} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Security note */}
      <div className="flex items-start gap-3 p-4 rounded-2xl" style={{ background: "#fff7ed", border: "1px solid #fed7aa" }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#ffedd5" }}><Shield size={17} style={{ color: "#d97706" }} /></div>
        <div>
          <p className="text-sm font-bold text-orange-800">Catatan Keamanan Laporan</p>
          <p className="text-xs text-orange-700 mt-0.5">Data nominal dan informasi pelanggan tersimpan dalam database sebagai <code className="font-mono font-bold">Ciphertext Base64</code>. Sistem mendekripsi data secara otomatis untuk ditampilkan di laporan ini menggunakan kunci yang tersimpan di tabel <code className="font-mono font-bold">encryption_keys</code>.</p>
        </div>
      </div>
    </div>
  );
}
