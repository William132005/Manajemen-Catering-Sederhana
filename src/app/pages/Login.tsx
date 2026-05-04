import { useState } from "react";
import { useNavigate } from "react-router";
import { ChefHat, Lock, User, Eye, EyeOff, Shield, Utensils, Coffee, Star } from "lucide-react";

export function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username || !password) { setError("Username dan password wajib diisi."); return; }
    if (username !== "admin" || password !== "admin123") {
      setError("Kredensial tidak valid. Gunakan admin / admin123");
      return;
    }
    setLoading(true);
    setTimeout(() => { setLoading(false); navigate("/dashboard"); }, 1000);
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#060e1e" }}>
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-2/5 p-10" style={{ background: "linear-gradient(160deg, #0c1830 0%, #0f2045 100%)" }}>
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#3b82f6,#1d4ed8)" }}>
              <ChefHat size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold">CateringPro</p>
              <p className="text-xs" style={{ color: "#475569" }}>Manajemen Catering</p>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
            Sistem Manajemen<br />
            <span style={{ color: "#60a5fa" }}>Catering Modern</span>
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>
            Platform terpadu untuk mengelola pemesanan catering, pelanggan, jadwal acara, dan laporan keuangan dengan keamanan enkripsi ChaCha20.
          </p>

          <div className="mt-10 space-y-4">
            {[
              { icon: Shield, text: "Enkripsi data otomatis dengan ChaCha20" },
              { icon: Utensils, text: "Manajemen pemesanan catering lengkap" },
              { icon: Star, text: "Laporan real-time & analitik bisnis" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(59,130,246,0.12)" }}>
                  <Icon size={14} style={{ color: "#3b82f6" }} />
                </div>
                <p className="text-sm" style={{ color: "#94a3b8" }}>{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative floating cards */}
        <div className="space-y-3">
          <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-center gap-2 mb-2">
              <Lock size={13} style={{ color: "#3b82f6" }} />
              <p className="text-xs font-semibold" style={{ color: "#3b82f6" }}>Keamanan Data</p>
            </div>
            <p className="text-xs" style={{ color: "#64748b" }}>
              Data sensitif pelanggan dienkripsi menggunakan <em>ChaCha20 Stream Cipher</em> berbasis komponen jaringan perangkat.
            </p>
          </div>
          <p className="text-xs text-center" style={{ color: "#334155" }}>© 2026 CateringPro · Proyek Implementasi Keamanan Data</p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
            {/* Accent bar */}
            <div className="h-1" style={{ background: "linear-gradient(90deg, #3b82f6, #1d4ed8, #6366f1)" }} />

            <div className="p-8">
              <div className="text-center mb-7">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "linear-gradient(135deg,#3b82f6,#1d4ed8)" }}>
                  <ChefHat size={26} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Masuk ke CateringPro</h2>
                <p className="text-sm text-gray-500 mt-1">Masukkan kredensial Anda untuk melanjutkan</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Username</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm outline-none transition-all"
                      style={{ borderColor: "#e2e8f0" }}
                      onFocus={e => e.target.style.borderColor = "#3b82f6"}
                      onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                      placeholder="Masukkan username"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 border rounded-lg text-sm outline-none transition-all"
                      style={{ borderColor: "#e2e8f0" }}
                      onFocus={e => e.target.style.borderColor = "#3b82f6"}
                      onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                      placeholder="Masukkan password"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 mt-1"
                  style={{ background: loading ? "#93c5fd" : "linear-gradient(135deg,#3b82f6,#1d4ed8)" }}
                >
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Memverifikasi...</>
                  ) : "Masuk ke Dashboard"}
                </button>
              </form>

              <div className="mt-5 p-3 rounded-lg text-center" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <p className="text-xs text-gray-500">Demo: <span className="font-mono font-semibold text-gray-700">admin</span> / <span className="font-mono font-semibold text-gray-700">admin123</span></p>
              </div>
            </div>

            <div className="px-8 py-3 text-center" style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
              <p className="text-xs text-gray-400">© 2026 CateringPro · Sistem Informasi Catering</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
