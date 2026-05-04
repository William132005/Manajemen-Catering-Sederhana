import { useState } from "react";
import { Plus, Edit, Trash2, Eye, Search, Lock, ShieldCheck, Phone, Mail, MapPin, User } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

interface Customer {
  id: string; name: string; phone: string; email: string; address: string;
  totalOrders: number; joinDate: string;
}

const init: Customer[] = [
  { id: "PLG-001", name: "Budi Santoso", phone: "0812-3456-7890", email: "budi@email.com", address: "Jl. Merdeka No. 12, Jakarta Selatan", totalOrders: 3, joinDate: "2025-08-10" },
  { id: "PLG-002", name: "Siti Rahma", phone: "0813-9876-5432", email: "siti@gmail.com", address: "Jl. Sudirman No. 45, Jakarta Pusat", totalOrders: 2, joinDate: "2025-10-22" },
  { id: "PLG-003", name: "PT Maju Jaya", phone: "0215-5544-3322", email: "admin@majujaya.co.id", address: "Gedung Menara, Jl. Gatot Subroto Lt.5", totalOrders: 7, joinDate: "2025-03-15" },
  { id: "PLG-004", name: "Ahmad Fauzi", phone: "0856-1122-3344", email: "ahmad.f@email.com", address: "Jl. Ahmad Yani No. 78, Bandung", totalOrders: 1, joinDate: "2026-01-05" },
  { id: "PLG-005", name: "CV Barokah", phone: "0217-7788-9900", email: "barokah@cv.com", address: "Jl. Raya Bogor Km. 23, Depok", totalOrders: 5, joinDate: "2025-06-30" },
  { id: "PLG-006", name: "Rina Amelia", phone: "0878-3344-5566", email: "rina.a@mail.com", address: "Jl. Pahlawan No. 5, Bekasi", totalOrders: 2, joinDate: "2026-02-14" },
];

const ENC = () => (
  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "#d1fae5", color: "#065f46" }}>
    <Lock size={9} />ENCRYPTED
  </span>
);
const CHA = () => (
  <span className="inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded" style={{ background: "#dbeafe", color: "#1d4ed8" }}>
    <Lock size={9} />ChaCha20
  </span>
);

const inputCls = "w-full px-3 py-2.5 border rounded-lg text-sm outline-none transition-all bg-white";
const inputStyle = { borderColor: "#e2e8f0" };
const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => e.target.style.borderColor = "#3b82f6";
const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => e.target.style.borderColor = "#e2e8f0";

export function Customers() {
  const [customers, setCustomers] = useState<Customer[]>(init);
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "" });

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) || c.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    const n: Customer = { id: `PLG-${String(customers.length + 1).padStart(3, "0")}`, ...form, totalOrders: 0, joinDate: new Date().toISOString().split("T")[0] };
    setCustomers([...customers, n]);
    setForm({ name: "", phone: "", email: "", address: "" });
    setIsAddOpen(false);
  };
  const handleEdit = () => {
    if (!selected) return;
    setCustomers(customers.map(c => c.id === selected.id ? { ...c, ...form } : c));
    setIsEditOpen(false); setSelected(null); setForm({ name: "", phone: "", email: "", address: "" });
  };
  const handleDelete = (id: string) => {
    if (confirm("Hapus data pelanggan ini?")) setCustomers(customers.filter(c => c.id !== id));
  };
  const openEdit = (c: Customer) => {
    setSelected(c); setForm({ name: c.name, phone: c.phone, email: c.email, address: c.address }); setIsEditOpen(true);
  };

  const FormContent = ({ title, onSave, onClose }: { title: string; onSave: () => void; onClose: () => void }) => (
    <>
      <Dialog.Title className="text-lg font-bold text-gray-800 mb-1">{title}</Dialog.Title>
      <div className="flex items-center gap-2 p-3 rounded-xl mb-4 mt-2" style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}>
        <ShieldCheck size={14} style={{ color: "#2563eb" }} />
        <p className="text-xs font-medium" style={{ color: "#1d4ed8" }}>Field bertanda <CHA /> akan dienkripsi otomatis dengan ChaCha20</p>
      </div>
      <div className="space-y-3">
        <div>
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Nama Lengkap <CHA /></label>
          <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls} style={inputStyle} onFocus={onFocus} onBlur={onBlur} placeholder="Nama pelanggan / perusahaan" />
        </div>
        <div>
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Nomor Telepon <CHA /></label>
          <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={inputCls} style={inputStyle} onFocus={onFocus} onBlur={onBlur} placeholder="08xx-xxxx-xxxx" />
        </div>
        <div>
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Email <CHA /></label>
          <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={inputCls} style={inputStyle} onFocus={onFocus} onBlur={onBlur} placeholder="email@contoh.com" />
        </div>
        <div>
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Alamat <CHA /></label>
          <textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className={inputCls} style={{ ...inputStyle, resize: "none" }} rows={2} placeholder="Alamat lengkap" onFocus={onFocus} onBlur={onBlur} />
        </div>
      </div>
      <div className="flex gap-3 mt-5">
        <button onClick={onClose} className="flex-1 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-all font-medium" style={{ borderColor: "#e2e8f0" }}>Batal</button>
        <button onClick={onSave} className="flex-1 py-2 rounded-lg text-sm text-white font-semibold flex items-center justify-center gap-2" style={{ background: "#2563eb" }}>
          <ShieldCheck size={14} />{title.includes("Edit") ? "Update" : "Simpan"} & Enkripsi
        </button>
      </div>
    </>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-gray-800">Data Pelanggan</h2>
            <ENC />
          </div>
          <p className="text-sm text-gray-500 mt-0.5">Kelola data pelanggan dengan perlindungan enkripsi otomatis</p>
        </div>
        <button onClick={() => setIsAddOpen(true)} className="flex items-center gap-2 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all" style={{ background: "#2563eb" }}>
          <Plus size={16} />Tambah Pelanggan
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm" style={{ border: "1px solid #e2e8f0" }}>
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Cari pelanggan berdasarkan nama, telepon, atau ID..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg text-sm outline-none border" style={{ borderColor: "#e2e8f0" }} onFocus={onFocus as any} onBlur={onBlur as any} />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: "1px solid #e2e8f0" }}>
        <table className="w-full">
          <thead style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
            <tr>
              {["ID Pelanggan", "Nama", "No. Telepon", "Email", "Alamat", "Total Order", "Status Enkripsi", "Aksi"].map(h => (
                <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase" style={{ color: "#94a3b8" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: "#f1f5f9" }}>
                <td className="px-5 py-3.5 text-xs font-mono font-semibold text-gray-600">{c.id}</td>
                <td className="px-5 py-3.5 text-sm font-semibold text-gray-800">{c.name}</td>
                <td className="px-5 py-3.5 text-sm text-gray-600">{c.phone}</td>
                <td className="px-5 py-3.5 text-sm text-gray-600">{c.email}</td>
                <td className="px-5 py-3.5 text-sm text-gray-600 max-w-[200px] truncate">{c.address}</td>
                <td className="px-5 py-3.5 text-sm text-center font-semibold text-gray-700">{c.totalOrders}</td>
                <td className="px-5 py-3.5"><ENC /></td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1">
                    <button onClick={() => { setSelected(c); setIsDetailOpen(true); }} className="p-1.5 rounded-lg transition-all hover:bg-blue-50 text-blue-600" title="Detail"><Eye size={15} /></button>
                    <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg transition-all hover:bg-green-50 text-green-600" title="Edit"><Edit size={15} /></button>
                    <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg transition-all hover:bg-red-50 text-red-500" title="Hapus"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="py-16 text-center text-gray-400 text-sm">Tidak ada data pelanggan ditemukan</div>}
      </div>

      {/* Add Modal */}
      <Dialog.Root open={isAddOpen} onOpenChange={setIsAddOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg">
            <FormContent title="Tambah Pelanggan Baru" onSave={handleAdd} onClose={() => setIsAddOpen(false)} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Edit Modal */}
      <Dialog.Root open={isEditOpen} onOpenChange={setIsEditOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg">
            <FormContent title="Edit Data Pelanggan" onSave={handleEdit} onClose={() => setIsEditOpen(false)} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Detail Modal */}
      <Dialog.Root open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <Dialog.Title className="text-lg font-bold text-gray-800 mb-4">Detail Pelanggan</Dialog.Title>
            {selected && (
              <div className="space-y-3">
                <div className="p-4 rounded-xl text-center" style={{ background: "#0c1830" }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2" style={{ background: "rgba(59,130,246,0.2)" }}>
                    <User size={22} style={{ color: "#3b82f6" }} />
                  </div>
                  <p className="text-white font-bold">{selected.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#475569" }}>{selected.id} · Bergabung {new Date(selected.joinDate).toLocaleDateString("id-ID", { month: "long", year: "numeric" })}</p>
                </div>
                {[
                  { icon: Phone, label: "No. Telepon", value: selected.phone },
                  { icon: Mail, label: "Email", value: selected.email },
                  { icon: MapPin, label: "Alamat", value: selected.address },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                    <Icon size={15} className="text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-xs text-gray-500">{label}</p>
                        <ENC />
                      </div>
                      <p className="text-sm font-medium text-gray-800">{value}</p>
                    </div>
                  </div>
                ))}
                <div className="p-3 rounded-xl text-center" style={{ background: "#dbeafe", border: "1px solid #bfdbfe" }}>
                  <p className="text-xs text-blue-600">Total Pesanan</p>
                  <p className="text-2xl font-bold text-blue-700">{selected.totalOrders}</p>
                </div>
              </div>
            )}
            <button onClick={() => setIsDetailOpen(false)} className="w-full mt-4 py-2.5 rounded-xl text-white text-sm font-semibold" style={{ background: "#2563eb" }}>Tutup</button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
