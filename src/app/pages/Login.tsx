import { useState } from "react";
import { useNavigate } from "react-router";
import { Shirt, Lock, User } from "lucide-react";

export function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-2">
        {/* Left Side - Illustration */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-12 flex flex-col items-center justify-center text-white">
          <div className="mb-8">
            <Shirt size={80} strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-bold mb-4">LaundryPro</h1>
          <p className="text-blue-100 text-center text-lg">
            Sistem Manajemen Order Laundry
          </p>
          <p className="text-blue-200 text-center mt-2 text-sm">
            Modern • Aman • Efisien
          </p>

          <div className="mt-12 bg-blue-400/30 backdrop-blur-sm rounded-lg p-4 w-full max-w-xs">
            <div className="flex items-center gap-2 text-sm">
              <Lock size={16} />
              <span>Data Dienkripsi dengan ChaCha20</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Selamat Datang</h2>
            <p className="text-gray-500">Silakan login untuk melanjutkan</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Masukkan username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Masukkan password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              Masuk
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            © 2026 LaundryPro. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
