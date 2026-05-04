import { useState } from "react";
import { Save, Shield, Bell, User, Building, CreditCard, CheckCircle } from "lucide-react";

const inputCls = "w-full px-3 py-2.5 border rounded-lg text-sm outline-none transition-all";
const iStyle = { borderColor: "#e2e8f0" };
const onF = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => e.target.style.borderColor = "#3b82f6";
const onB = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => e.target.style.borderColor = "#e2e8f0";

export function Settings() {
  const [saved, setSaved] = useState(false);
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const Section = ({ icon: Icon, iconBg, iconColor, title, sub, children }: { icon: React.ElementType; iconBg: string; iconColor: string; title: string; sub: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: "1px solid #e2e8f0" }}>
      <div className="flex items-center gap-3 px-6 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: iconBg }}><Icon size={18} style={{ color: iconColor }} /></div>
        <div>
          <h3 className="font-bold text-gray-800">{title}</h3>
          <p className="text-xs text-gray-400">{sub}</p>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Pengaturan</h2>
        <p className="text-sm text-gray-500 mt-0.5">Konfigurasi aplikasi dan preferensi sistem</p>
      </div>

      <Section icon={User} iconBg="#dbeafe" iconColor="#2563eb" title="Profil Pengguna" sub="Informasi akun administrator">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Nama Lengkap</label><input type="text" defaultValue="Admin CateringPro" className={inputCls} style={iStyle} onFocus={onF as any} onBlur={onB as any} /></div>
          <div><label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Email</label><input type="email" defaultValue="admin@cateringpro.id" className={inputCls} style={iStyle} onFocus={onF as any} onBlur={onB as any} /></div>
          <div><label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Nomor Telepon</label><input type="tel" defaultValue="0812-3456-7890" className={inputCls} style={iStyle} onFocus={onF as any} onBlur={onB as any} /></div>
          <div><label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Role</label>
            <select className={inputCls} style={iStyle} onFocus={onF as any} onBlur={onB as any}>
              <option>Administrator</option><option>Manager</option><option>Operator</option><option>Kasir</option>
            </select>
          </div>
        </div>
      </Section>

      <Section icon={Building} iconBg="#ede9fe" iconColor="#7c3aed" title="Informasi Bisnis" sub="Detail usaha catering">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Nama Usaha</label><input type="text" defaultValue="CateringPro" className={inputCls} style={iStyle} onFocus={onF as any} onBlur={onB as any} /></div>
          <div><label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">No. Telepon</label><input type="tel" defaultValue="(021) 1234-5678" className={inputCls} style={iStyle} onFocus={onF as any} onBlur={onB as any} /></div>
          <div><label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Email Bisnis</label><input type="email" defaultValue="info@cateringpro.id" className={inputCls} style={iStyle} onFocus={onF as any} onBlur={onB as any} /></div>
          <div><label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Website</label><input type="url" defaultValue="https://cateringpro.id" className={inputCls} style={iStyle} onFocus={onF as any} onBlur={onB as any} /></div>
          <div className="col-span-2"><label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Alamat Usaha</label><textarea defaultValue="Jl. Raya Catering No. 1, Jakarta Selatan 12345" className={inputCls} style={{ ...iStyle, resize: "none" }} rows={2} onFocus={onF as any} onBlur={onB as any} /></div>
        </div>
      </Section>

      <Section icon={Shield} iconBg="#d1fae5" iconColor="#059669" title="Keamanan Data" sub="Pengaturan enkripsi ChaCha20">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
            <div>
              <p className="font-semibold text-green-800">Enkripsi ChaCha20</p>
              <p className="text-sm text-green-600">Data sensitif pelanggan dan pesanan terenkripsi otomatis</p>
            </div>
            <span className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl" style={{ background: "#059669", color: "white" }}>
              <CheckCircle size={14} />Aktif
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Password Lama</label><input type="password" placeholder="••••••••" className={inputCls} style={iStyle} onFocus={onF as any} onBlur={onB as any} /></div>
            <div><label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Password Baru</label><input type="password" placeholder="••••••••" className={inputCls} style={iStyle} onFocus={onF as any} onBlur={onB as any} /></div>
          </div>
        </div>
      </Section>

      <Section icon={CreditCard} iconBg="#fef3c7" iconColor="#d97706" title="Harga Paket Catering" sub="Atur harga per paket">
        <div className="grid grid-cols-2 gap-4">
          {[["Paket Silver", "45000"], ["Paket Gold", "75000"], ["Paket Platinum", "120000"], ["Paket Premium", "180000"]].map(([label, val]) => (
            <div key={label}><label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{label} (Rp/orang)</label><input type="number" defaultValue={val} className={inputCls} style={iStyle} onFocus={onF as any} onBlur={onB as any} /></div>
          ))}
        </div>
      </Section>

      <Section icon={Bell} iconBg="#ffedd5" iconColor="#ea580c" title="Notifikasi" sub="Preferensi pemberitahuan">
        <div className="space-y-4">
          {[["Pesanan Baru", "Notifikasi saat ada pesanan catering baru masuk", true], ["Status Pesanan", "Update perubahan status pengerjaan", true], ["Laporan Harian", "Ringkasan transaksi harian via email", false], ["Peringatan Keamanan", "Notifikasi anomali sistem enkripsi", true]].map(([label, desc, checked]) => (
            <div key={label as string} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid #f1f5f9" }}>
              <div>
                <p className="text-sm font-semibold text-gray-700">{label as string}</p>
                <p className="text-xs text-gray-400">{desc as string}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked={checked as boolean} />
                <div className="w-10 h-5 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" style={{ background: (checked as boolean) ? "#2563eb" : "#e2e8f0" }} />
              </label>
            </div>
          ))}
        </div>
      </Section>

      {/* Save */}
      <div className="flex justify-end">
        <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold text-sm shadow-sm transition-all" style={{ background: saved ? "#059669" : "#2563eb" }}>
          {saved ? <><CheckCircle size={16} />Tersimpan!</> : <><Save size={16} />Simpan Pengaturan</>}
        </button>
      </div>
    </div>
  );
}
