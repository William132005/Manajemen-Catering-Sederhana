import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard, Users, UtensilsCrossed, ClipboardList,
  BarChart2, ShieldCheck, FlaskConical, Settings,
  LogOut, Bell, ChevronDown, Lock
} from "lucide-react";

const NAV_MAIN = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/customers", label: "Data Pelanggan", icon: Users },
  { path: "/orders", label: "Pemesanan Catering", icon: UtensilsCrossed },
  { path: "/status", label: "Status Pesanan", icon: ClipboardList },
  { path: "/reports", label: "Laporan", icon: BarChart2 },
];

const NAV_SECURITY = [
  { path: "/security", label: "Keamanan & Enkripsi", icon: ShieldCheck },
  { path: "/demo-enkripsi", label: "Demo ChaCha20", icon: FlaskConical },
];

const NAV_BOTTOM = [
  { path: "/settings", label: "Pengaturan", icon: Settings },
];

export function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const allMenus = [...NAV_MAIN, ...NAV_SECURITY, ...NAV_BOTTOM];
  const currentLabel = allMenus.find(m => m.path === location.pathname)?.label ?? "Dashboard";

  const NavItem = ({ path, label, icon: Icon }: { path: string; label: string; icon: React.ElementType }) => {
    const active = location.pathname === path;
    return (
      <Link
        to={path}
        className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-150 relative group"
        style={{
          background: active ? "rgba(59,130,246,0.12)" : "transparent",
          color: active ? "#60a5fa" : "#94a3b8",
          borderLeft: active ? "3px solid #3b82f6" : "3px solid transparent",
        }}
        onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = "#cbd5e1"; }}
        onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = "#94a3b8"; }}
      >
        <Icon size={17} strokeWidth={active ? 2.2 : 1.8} />
        <span style={{ fontWeight: active ? 600 : 400 }}>{label}</span>
      </Link>
    );
  };

  return (
    <div className="flex h-screen" style={{ background: "#f1f5f9" }}>
      {/* Sidebar */}
      <aside className="w-60 flex flex-col shrink-0" style={{ background: "#0c1830", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
        {/* Logo */}
        <div className="px-5 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#3b82f6,#1d4ed8)" }}>
              <UtensilsCrossed size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">CateringPro</p>
              <p className="text-xs mt-0.5" style={{ color: "#475569" }}>Manajemen Catering</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-0.5">
            {NAV_MAIN.map(item => <NavItem key={item.path} {...item} />)}
          </div>

          <div className="mt-5 mb-2 px-4">
            <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: "#334155" }}>Keamanan</p>
          </div>
          <div className="space-y-0.5">
            {NAV_SECURITY.map(item => <NavItem key={item.path} {...item} />)}
          </div>

          <div className="mt-5 mb-2 px-4">
            <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: "#334155" }}>Sistem</p>
          </div>
          <div className="space-y-0.5">
            {NAV_BOTTOM.map(item => <NavItem key={item.path} {...item} />)}
          </div>
        </div>

        {/* Encryption status */}
        <div className="mx-3 mb-3 p-3 rounded-xl" style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)" }}>
          <div className="flex items-center gap-2 mb-1">
            <Lock size={12} style={{ color: "#3b82f6" }} />
            <span className="text-xs font-semibold" style={{ color: "#3b82f6" }}>ChaCha20 Aktif</span>
          </div>
          <p className="text-xs" style={{ color: "#475569" }}>Enkripsi 256-bit diaktifkan</p>
        </div>

        {/* Logout */}
        <div className="px-3 pb-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px" }}>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm w-full transition-all"
            style={{ color: "#64748b" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#f87171"; (e.currentTarget as HTMLElement).style.background = "rgba(248,113,113,0.08)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#64748b"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
          >
            <LogOut size={16} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white px-6 py-3.5 flex items-center justify-between shrink-0" style={{ borderBottom: "1px solid #e2e8f0" }}>
          <div>
            <h2 className="font-bold text-gray-800">{currentLabel}</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: "#dbeafe", color: "#1d4ed8" }}>
              <ShieldCheck size={12} />
              Enkripsi Aktif
            </div>
            <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-all">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2.5 pl-3" style={{ borderLeft: "1px solid #e2e8f0" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: "linear-gradient(135deg,#3b82f6,#1d4ed8)" }}>A</div>
              <div className="text-sm">
                <p className="font-semibold text-gray-800 leading-tight">Admin</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
              <ChevronDown size={14} className="text-gray-400" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
