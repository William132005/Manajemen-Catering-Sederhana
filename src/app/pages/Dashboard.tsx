import { useState } from "react";
import { Users, UtensilsCrossed, Clock, Calendar, TrendingUp, ArrowUpRight, Shield, ChevronRight, Lock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Link } from "react-router";

const monthlyData = [
  { bulan: "Jan", pesanan: 8 }, { bulan: "Feb", pesanan: 12 },
  { bulan: "Mar", pesanan: 10 }, { bulan: "Apr", pesanan: 15 },
  { bulan: "Mei", pesanan: 18 }, { bulan: "Jun", pesanan: 14 },
  { bulan: "Jul", pesanan: 20 }, { bulan: "Agt", pesanan: 17 },
  { bulan: "Sep", pesanan: 22 }, { bulan: "Okt", pesanan: 19 },
  { bulan: "Nov", pesanan: 24 }, { bulan: "Des", pesanan: 16 },
];

const recentOrders = [
  { id: "CAT-001", customer: "Budi Santoso", event: "Pernikahan Putri", date: "2026-05-10", pkg: "Platinum", status: "Dikonfirmasi", guests: 300 },
  { id: "CAT-002", customer: "Siti Rahma", event: "Ulang Tahun ke-50", date: "2026-05-08", pkg: "Gold", status: "Diproses", guests: 150 },
  { id: "CAT-003", customer: "PT Maju Jaya", event: "Seminar Tahunan", date: "2026-05-06", pkg: "Silver", status: "Selesai", guests: 200 },
  { id: "CAT-004", customer: "Ahmad Fauzi", event: "Arisan Keluarga", date: "2026-05-05", pkg: "Silver", status: "Selesai", guests: 80 },
  { id: "CAT-005", customer: "CV Barokah", event: "Gathering Karyawan", date: "2026-05-04", pkg: "Gold", status: "Selesai", guests: 120 },
];

const statusStyle: Record<string, { bg: string; color: string }> = {
  "Dikonfirmasi": { bg: "#dbeafe", color: "#1d4ed8" },
  "Diproses": { bg: "#fef3c7", color: "#d97706" },
  "Selesai": { bg: "#d1fae5", color: "#065f46" },
  "Dibatalkan": { bg: "#fee2e2", color: "#991b1b" },
  "Draft": { bg: "#f1f5f9", color: "#475569" },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-lg">
        <p className="text-xs font-semibold text-gray-600 mb-1">{label}</p>
        <p className="text-sm font-bold text-blue-600">{payload[0].value} pesanan</p>
      </div>
    );
  }
  return null;
};

export function Dashboard() {
  const stats = [
    { label: "Total Pelanggan", value: "48", sub: "+6 bulan ini", icon: Users, iconBg: "#ede9fe", iconColor: "#7c3aed", trend: "+14%" },
    { label: "Total Pesanan", value: "127", sub: "Sepanjang waktu", icon: UtensilsCrossed, iconBg: "#dbeafe", iconColor: "#2563eb", trend: "+8%" },
    { label: "Pesanan Aktif", value: "12", sub: "Sedang diproses", icon: Clock, iconBg: "#fef3c7", iconColor: "#d97706", trend: "3 selesai hari ini" },
    { label: "Jadwal Hari Ini", value: "3", sub: "Acara terjadwal", icon: Calendar, iconBg: "#d1fae5", iconColor: "#059669", trend: "2 tersisa" },
  ];

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm" style={{ border: "1px solid #e2e8f0" }}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: s.iconBg }}>
                  <Icon size={20} style={{ color: s.iconColor }} />
                </div>
                <span className="flex items-center gap-1 text-xs font-medium" style={{ color: "#059669" }}>
                  <TrendingUp size={11} />{s.trend}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-0.5">{s.value}</p>
              <p className="text-sm font-medium text-gray-700">{s.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Chart + Security */}
      <div className="grid grid-cols-3 gap-4">
        {/* Monthly Chart */}
        <div className="col-span-2 bg-white rounded-2xl p-5 shadow-sm" style={{ border: "1px solid #e2e8f0" }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-gray-800">Ringkasan Pesanan Bulanan</h3>
              <p className="text-xs text-gray-400 mt-0.5">Total pesanan per bulan – Tahun 2026</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg" style={{ background: "#f1f5f9", color: "#475569" }}>
              <ArrowUpRight size={12} />Tahun 2026
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="bulan" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f1f5f9" }} />
              <Bar dataKey="pesanan" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Security Panel */}
        <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ border: "1px solid #e2e8f0" }}>
          <div className="flex items-center gap-2 mb-4">
            <Shield size={16} style={{ color: "#2563eb" }} />
            <h3 className="font-bold text-gray-800">Status Keamanan</h3>
          </div>

          <div className="rounded-xl p-4 mb-4" style={{ background: "#0c1830" }}>
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium" style={{ color: "#475569" }}>Enkripsi Aktif</p>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-400">Online</span>
              </div>
            </div>
            <p className="text-white font-bold text-lg">ChaCha20</p>
            <p className="text-xs mt-0.5" style={{ color: "#475569" }}>Stream Cipher · 256-bit Key</p>
          </div>

          <div className="space-y-2 mb-4" style={{ padding: "12px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <p className="text-xs font-semibold text-gray-600 mb-2">Key Source: Network Components</p>
            {[
              ["IPv4 Address", "192.168.1.x"],
              ["Provider", "Telkom Indonesia"],
              ["Hostname", "DESKTOP-XXXX"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between">
                <p className="text-xs text-gray-500">{k}</p>
                <p className="text-xs font-mono font-medium text-gray-700">{v}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="text-center p-3 rounded-xl" style={{ background: "#d1fae5" }}>
              <p className="font-bold text-green-700">127</p>
              <p className="text-xs text-green-600">Records</p>
            </div>
            <div className="text-center p-3 rounded-xl" style={{ background: "#dbeafe" }}>
              <p className="font-bold" style={{ color: "#1d4ed8" }}>256</p>
              <p className="text-xs" style={{ color: "#1d4ed8" }}>Bit Key</p>
            </div>
          </div>

          <Link to="/security" className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-semibold text-white transition-all" style={{ background: "#2563eb" }}>
            <Shield size={13} />Detail Keamanan
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm" style={{ border: "1px solid #e2e8f0" }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
          <h3 className="font-bold text-gray-800">Pesanan Terbaru</h3>
          <Link to="/orders" className="flex items-center gap-1 text-xs font-medium hover:underline" style={{ color: "#2563eb" }}>
            Lihat Semua <ChevronRight size={13} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ background: "#f8fafc" }}>
              <tr>
                {["ID", "Pelanggan", "Nama Acara", "Tanggal Acara", "Paket", "Tamu", "Status Enkripsi", "Status"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase" style={{ color: "#94a3b8" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o, i) => (
                <tr key={o.id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: "#f1f5f9" }}>
                  <td className="px-5 py-3.5 text-xs font-mono font-semibold text-gray-600">{o.id}</td>
                  <td className="px-5 py-3.5 text-sm font-medium text-gray-800">{o.customer}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{o.event}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{new Date(o.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-700 font-medium">{o.pkg}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{o.guests.toLocaleString("id-ID")}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "#d1fae5", color: "#065f46" }}>
                      <Lock size={9} />ENCRYPTED
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: statusStyle[o.status]?.bg, color: statusStyle[o.status]?.color }}>
                      {o.status}
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
