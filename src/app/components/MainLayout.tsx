import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  ClipboardList,
  FileText,
  Settings,
  LogOut,
  Bell,
  User,
  ShieldCheck
} from "lucide-react";

export function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/customers", label: "Data Pelanggan", icon: Users },
    { path: "/orders", label: "Manajemen Order", icon: ShoppingBag },
    { path: "/status", label: "Status Pesanan", icon: ClipboardList },
    { path: "/reports", label: "Laporan", icon: FileText },
    { path: "/settings", label: "Pengaturan", icon: Settings },
  ];

  const securityMenu = { path: "/security", label: "Pengaturan Keamanan", icon: ShieldCheck };

  const allMenus = [...menuItems, securityMenu];
  const currentLabel = allMenus.find(item => item.path === location.pathname)?.label || "Dashboard";

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-blue-600">LaundryPro</h1>
          <p className="text-sm text-gray-500 mt-1">Sistem Manajemen Order</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Security divider */}
          <div className="pt-2 pb-1">
            <div className="border-t border-gray-100" />
            <p className="text-xs text-gray-400 px-4 pt-3 pb-1 uppercase tracking-wider font-medium">Keamanan</p>
          </div>

          {/* Security Menu */}
          {(() => {
            const Icon = securityMenu.icon;
            const isActive = location.pathname === securityMenu.path;
            return (
              <Link
                to={securityMenu.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon size={20} />
                <span>{securityMenu.label}</span>
                {!isActive && (
                  <span className="ml-auto text-xs bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded font-medium">
                    NEW
                  </span>
                )}
              </Link>
            );
          })()}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all w-full"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{currentLabel}</h2>
              <p className="text-sm text-gray-500 mt-1">Senin, 27 April 2026</p>
            </div>

            <div className="flex items-center gap-4">
              {/* Encryption status indicator */}
              <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-lg text-xs font-medium">
                <ShieldCheck size={13} />
                <span>ChaCha20 Aktif</span>
              </div>

              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">Admin User</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={20} className="text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
