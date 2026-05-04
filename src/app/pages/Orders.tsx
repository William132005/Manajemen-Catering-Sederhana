import { useState } from "react";
import { Plus, Eye, Edit, Trash2, Search, ShieldCheck, Lock, CheckCircle, Wifi, Key, Database, Server, Fingerprint, ChevronRight } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { chacha20Encrypt, generateNetworkData, generateHex, shortCipher } from "../utils/encryption";

interface Order {
  id: string; customerId: string; customerName: string; phone: string; email: string; address: string;
  eventName: string; eventType: string; eventDate: string; eventLocation: string; guestCount: number;
  pkg: string; menuList: string; notes: string; allergyInfo: string;
  receiverName: string; receiverPhone: string; deliveryAddress: string;
  status: string; totalCost: number; paymentStatus: string; createdAt: string;
}

const PACKAGES = [
  { name: "Paket Silver", price: 45000 },
  { name: "Paket Gold", price: 75000 },
  { name: "Paket Platinum", price: 120000 },
  { name: "Paket Premium", price: 180000 },
];

const EVENT_TYPES = ["Pernikahan", "Ulang Tahun", "Seminar / Workshop", "Rapat Perusahaan", "Wisuda", "Gathering", "Arisan", "Acara Keluarga", "Lainnya"];
const STATUSES = ["Draft", "Dikonfirmasi", "Diproses", "Selesai", "Dibatalkan"];

const CUSTOMERS = [
  { id: "PLG-001", name: "Budi Santoso" }, { id: "PLG-002", name: "Siti Rahma" },
  { id: "PLG-003", name: "PT Maju Jaya" }, { id: "PLG-004", name: "Ahmad Fauzi" },
  { id: "PLG-005", name: "CV Barokah" }, { id: "PLG-006", name: "Rina Amelia" },
];

const init: Order[] = [
  { id: "CAT-001", customerId: "PLG-001", customerName: "Budi Santoso", phone: "0812-3456-7890", email: "budi@email.com", address: "Jl. Merdeka No. 12", eventName: "Pernikahan Putri", eventType: "Pernikahan", eventDate: "2026-05-10", eventLocation: "Gedung Serbaguna Jakarta", guestCount: 300, pkg: "Paket Platinum", menuList: "Nasi, Ayam Bakar, Rendang, Sayur", notes: "Dekorasi bunga segar", allergyInfo: "Alergi kacang", receiverName: "Ani Santoso", receiverPhone: "0813-1111-2222", deliveryAddress: "Gedung Serbaguna, Jakarta Selatan", status: "Dikonfirmasi", totalCost: 36000000, paymentStatus: "DP 50%", createdAt: "2026-04-20" },
  { id: "CAT-002", customerId: "PLG-002", customerName: "Siti Rahma", phone: "0813-9876-5432", email: "siti@gmail.com", address: "Jl. Sudirman No. 45", eventName: "Ulang Tahun ke-50", eventType: "Ulang Tahun", eventDate: "2026-05-08", eventLocation: "Rumah Pribadi, Kebayoran Baru", guestCount: 150, pkg: "Paket Gold", menuList: "Nasi Kotak, Rendang, Sate", notes: "", allergyInfo: "", receiverName: "Siti Rahma", receiverPhone: "0813-9876-5432", deliveryAddress: "Jl. Sudirman No. 45, Jakarta", status: "Diproses", totalCost: 11250000, paymentStatus: "Lunas", createdAt: "2026-04-25" },
  { id: "CAT-003", customerId: "PLG-003", customerName: "PT Maju Jaya", phone: "0215-5544-3322", email: "admin@majujaya.co.id", address: "Gedung Menara Lt.5", eventName: "Seminar Tahunan", eventType: "Seminar / Workshop", eventDate: "2026-05-06", eventLocation: "Ballroom Hotel Grand, Jakarta", guestCount: 200, pkg: "Paket Silver", menuList: "Snack Box, Nasi Kotak, Air Mineral", notes: "Meja VIP untuk direksi", allergyInfo: "Tidak ada", receiverName: "Pak Hendra", receiverPhone: "0217-7788-9900", deliveryAddress: "Hotel Grand Ballroom, Jl. Thamrin", status: "Selesai", totalCost: 9000000, paymentStatus: "Lunas", createdAt: "2026-04-28" },
];

const statusStyle: Record<string, { bg: string; color: string }> = {
  "Draft": { bg: "#f1f5f9", color: "#475569" },
  "Dikonfirmasi": { bg: "#dbeafe", color: "#1d4ed8" },
  "Diproses": { bg: "#fef3c7", color: "#d97706" },
  "Selesai": { bg: "#d1fae5", color: "#065f46" },
  "Dibatalkan": { bg: "#fee2e2", color: "#991b1b" },
};

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

const inputCls = "w-full px-3 py-2.5 border rounded-lg text-sm outline-none bg-white transition-all";
const iStyle = { borderColor: "#e2e8f0" };
const onF = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => e.target.style.borderColor = "#3b82f6";
const onB = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => e.target.style.borderColor = "#e2e8f0";

const EMPTY_FORM = {
  customerId: "", customerName: "", phone: "", email: "", address: "",
  eventName: "", eventType: "", eventDate: "", eventLocation: "", guestCount: 0,
  pkg: "", menuList: "", notes: "", allergyInfo: "",
  receiverName: "", receiverPhone: "", deliveryAddress: "", status: "Draft",
};

// Encryption simulation steps
const ENC_STEPS = [
  { icon: Wifi, label: "Mendeteksi Komponen Jaringan", desc: "Memindai antarmuka jaringan perangkat..." },
  { icon: Server, label: "Mengambil Data Identitas Jaringan", desc: "IPv4, IPv6, MAC Address, Provider, Hostname" },
  { icon: Fingerprint, label: "Mengenkripsi Fingerprint Jaringan", desc: "ChaCha20 → Network fingerprint terenkripsi" },
  { icon: Key, label: "Membentuk Kunci Enkripsi Unik", desc: "SHA-256(IPv4 + MAC + Hostname) → 256-bit key" },
  { icon: Lock, label: "Mengenkripsi Field Sensitif", desc: "Nama, telepon, email, alamat, lokasi, catatan..." },
  { icon: Database, label: "Menyimpan Data ke SQLite", desc: "INSERT INTO catering_orders (encrypted fields)" },
  { icon: ShieldCheck, label: "Menyimpan Metadata Kunci", desc: "INSERT INTO encryption_keys (key_id, fingerprint...)" },
];

export function Orders() {
  const [orders, setOrders] = useState<Order[]>(init);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEncOpen, setIsEncOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<Order | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [encStep, setEncStep] = useState(0);
  const [encDone, setEncDone] = useState(false);
  const [netData, setNetData] = useState(generateNetworkData());
  const [encryptedFields, setEncryptedFields] = useState<Record<string, string>>({});
  const [pendingOrder, setPendingOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const filtered = orders.filter(o =>
    o.customerName.toLowerCase().includes(search.toLowerCase()) ||
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    o.eventName.toLowerCase().includes(search.toLowerCase())
  );

  const calcCost = (pkg: string, guests: number) => {
    const p = PACKAGES.find(x => x.name === pkg);
    return p ? p.price * guests : 0;
  };

  const openAdd = () => {
    setEditMode(false); setForm(EMPTY_FORM); setActiveTab(0); setIsFormOpen(true);
  };
  const openEdit = (o: Order) => {
    setEditMode(true); setSelected(o);
    setForm({ customerId: o.customerId, customerName: o.customerName, phone: o.phone, email: o.email, address: o.address, eventName: o.eventName, eventType: o.eventType, eventDate: o.eventDate, eventLocation: o.eventLocation, guestCount: o.guestCount, pkg: o.pkg, menuList: o.menuList, notes: o.notes, allergyInfo: o.allergyInfo, receiverName: o.receiverName, receiverPhone: o.receiverPhone, deliveryAddress: o.deliveryAddress, status: o.status });
    setActiveTab(0); setIsFormOpen(true);
  };
  const handleDelete = (id: string) => { if (confirm("Hapus pesanan ini?")) setOrders(orders.filter(o => o.id !== id)); };

  const handlePreviewEncryption = () => {
    const fields: Record<string, string> = {};
    const sensitiveFields = [
      ["Nama Pelanggan", form.customerName], ["Nomor Telepon", form.phone],
      ["Email", form.email], ["Alamat", form.address],
      ["Lokasi Acara", form.eventLocation], ["Catatan Khusus", form.notes || "-"],
      ["Info Alergi", form.allergyInfo || "-"], ["Nama Penerima", form.receiverName],
      ["Kontak Penerima", form.receiverPhone], ["Alamat Pengiriman", form.deliveryAddress],
    ];
    sensitiveFields.forEach(([k, v]) => { fields[k] = v ? shortCipher(v) : "-"; });
    setEncryptedFields(fields);
    setIsPreviewOpen(true);
  };

  const buildNewOrder = (): Order => ({
    id: `CAT-${String(orders.length + 1).padStart(3, "0")}`,
    ...form,
    guestCount: Number(form.guestCount),
    totalCost: calcCost(form.pkg, Number(form.guestCount)),
    paymentStatus: "Belum Bayar",
    createdAt: new Date().toISOString().split("T")[0],
    status: form.status || "Draft",
  });

  const runEncryptionSim = () => {
    const nd = generateNetworkData();
    setNetData(nd);
    const enc: Record<string, string> = {};
    [["Nama Pelanggan", form.customerName], ["Nomor Telepon", form.phone], ["Email", form.email], ["Alamat", form.address], ["Lokasi Acara", form.eventLocation], ["Catatan", form.notes || "-"], ["Info Alergi", form.allergyInfo || "-"], ["Nama Penerima", form.receiverName], ["Kontak Penerima", form.receiverPhone], ["Alamat Pengiriman", form.deliveryAddress]].forEach(([k, v]) => { enc[k] = v ? shortCipher(v) : "-"; });
    setEncryptedFields(enc);
    const newOrder = buildNewOrder();
    setPendingOrder(newOrder);
    setEncStep(0); setEncDone(false);
    setIsFormOpen(false);
    setIsEncOpen(true);
    ENC_STEPS.forEach((_, i) => {
      setTimeout(() => {
        setEncStep(i + 1);
        if (i === ENC_STEPS.length - 1) setEncDone(true);
      }, (i + 1) * 1100);
    });
  };

  const confirmSave = () => {
    if (!pendingOrder) return;
    if (editMode && selected) {
      setOrders(orders.map(o => o.id === selected.id ? { ...pendingOrder, id: selected.id } : o));
    } else {
      setOrders([...orders, pendingOrder]);
    }
    setIsEncOpen(false); setPendingOrder(null); setEncStep(0); setEncDone(false);
    setSelected(null); setForm(EMPTY_FORM);
  };

  const tabs = ["Informasi Pelanggan", "Detail Acara", "Paket & Menu", "Pengiriman"];

  const Tab0 = () => (
    <div className="space-y-3">
      <div>
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Pilih Pelanggan</label>
        <select value={form.customerId} onChange={e => { const c = CUSTOMERS.find(x => x.id === e.target.value); setForm({ ...form, customerId: e.target.value, customerName: c?.name ?? "" }); }} className={inputCls} style={iStyle} onFocus={onF as any} onBlur={onB as any}>
          <option value="">-- Pilih Pelanggan --</option>
          {CUSTOMERS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      {[
        { key: "customerName", label: "Nama Pelanggan", placeholder: "Nama atau perusahaan", enc: true },
        { key: "phone", label: "Nomor Telepon", placeholder: "08xx-xxxx-xxxx", enc: true },
        { key: "email", label: "Email", placeholder: "email@contoh.com", enc: true },
      ].map(f => (
        <div key={f.key}>
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{f.label} {f.enc && <CHA />}</label>
          <input type="text" value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} className={inputCls} style={iStyle} onFocus={onF as any} onBlur={onB as any} placeholder={f.placeholder} />
        </div>
      ))}
      <div>
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Alamat <CHA /></label>
        <textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className={inputCls} style={{ ...iStyle, resize: "none" }} rows={2} onFocus={onF as any} onBlur={onB as any} placeholder="Alamat pelanggan" />
      </div>
    </div>
  );

  const Tab1 = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide block">Nama Acara</label>
          <input type="text" value={form.eventName} onChange={e => setForm({ ...form, eventName: e.target.value })} className={inputCls} style={iStyle} onFocus={onF as any} onBlur={onB as any} placeholder="Nama acara" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide block">Jenis Acara</label>
          <select value={form.eventType} onChange={e => setForm({ ...form, eventType: e.target.value })} className={inputCls} style={iStyle} onFocus={onF as any} onBlur={onB as any}>
            <option value="">-- Pilih --</option>
            {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide block">Tanggal Acara</label>
          <input type="date" value={form.eventDate} onChange={e => setForm({ ...form, eventDate: e.target.value })} className={inputCls} style={iStyle} onFocus={onF as any} onBlur={onB as any} />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide block">Jumlah Tamu</label>
          <input type="number" min={1} value={form.guestCount || ""} onChange={e => setForm({ ...form, guestCount: parseInt(e.target.value) || 0 })} className={inputCls} style={iStyle} onFocus={onF as any} onBlur={onB as any} placeholder="0" />
        </div>
      </div>
      <div>
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Lokasi Acara <CHA /></label>
        <input type="text" value={form.eventLocation} onChange={e => setForm({ ...form, eventLocation: e.target.value })} className={inputCls} style={iStyle} onFocus={onF as any} onBlur={onB as any} placeholder="Nama gedung / tempat acara" />
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide block">Status Pesanan</label>
        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className={inputCls} style={iStyle} onFocus={onF as any} onBlur={onB as any}>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
    </div>
  );

  const Tab2 = () => (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide block">Paket Catering</label>
        <select value={form.pkg} onChange={e => setForm({ ...form, pkg: e.target.value })} className={inputCls} style={iStyle} onFocus={onF as any} onBlur={onB as any}>
          <option value="">-- Pilih Paket --</option>
          {PACKAGES.map(p => <option key={p.name} value={p.name}>{p.name} – Rp {p.price.toLocaleString("id-ID")}/orang</option>)}
        </select>
      </div>
      {form.pkg && (
        <div className="p-3 rounded-xl flex items-center justify-between" style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}>
          <div>
            <p className="text-xs text-blue-600">Estimasi Total Biaya</p>
            <p className="font-bold text-blue-800 text-lg">Rp {calcCost(form.pkg, form.guestCount).toLocaleString("id-ID")}</p>
          </div>
          <div className="text-right text-xs text-blue-500">
            <p>{form.guestCount || 0} tamu</p>
            <p>× Rp {(PACKAGES.find(p => p.name === form.pkg)?.price || 0).toLocaleString("id-ID")}</p>
          </div>
        </div>
      )}
      <div>
        <label className="text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide block">Daftar Menu</label>
        <textarea value={form.menuList} onChange={e => setForm({ ...form, menuList: e.target.value })} className={inputCls} style={{ ...iStyle, resize: "none" }} rows={3} onFocus={onF as any} onBlur={onB as any} placeholder="Contoh: Nasi, Ayam Bakar, Rendang, Sayuran, Dessert..." />
      </div>
      <div>
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Catatan Khusus <CHA /></label>
        <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className={inputCls} style={{ ...iStyle, resize: "none" }} rows={2} onFocus={onF as any} onBlur={onB as any} placeholder="Permintaan khusus dari pelanggan..." />
      </div>
      <div>
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Informasi Alergi <CHA /></label>
        <input type="text" value={form.allergyInfo} onChange={e => setForm({ ...form, allergyInfo: e.target.value })} className={inputCls} style={iStyle} onFocus={onF as any} onBlur={onB as any} placeholder="Contoh: Alergi kacang, tidak makan seafood..." />
      </div>
    </div>
  );

  const Tab3 = () => (
    <div className="space-y-3">
      {[
        { key: "receiverName", label: "Nama Penerima", enc: true, placeholder: "Nama penerima di lokasi" },
        { key: "receiverPhone", label: "Nomor Kontak Penerima", enc: true, placeholder: "08xx-xxxx-xxxx" },
      ].map(f => (
        <div key={f.key}>
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{f.label} {f.enc && <CHA />}</label>
          <input type="text" value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} className={inputCls} style={iStyle} onFocus={onF as any} onBlur={onB as any} placeholder={f.placeholder} />
        </div>
      ))}
      <div>
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Alamat Pengiriman <CHA /></label>
        <textarea value={form.deliveryAddress} onChange={e => setForm({ ...form, deliveryAddress: e.target.value })} className={inputCls} style={{ ...iStyle, resize: "none" }} rows={3} onFocus={onF as any} onBlur={onB as any} placeholder="Alamat lengkap pengiriman / lokasi acara" />
      </div>
      <div className="p-3 rounded-xl" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
        <p className="text-xs font-semibold text-green-700 mb-1.5">Field yang Akan Dienkripsi (ChaCha20)</p>
        <div className="grid grid-cols-2 gap-1">
          {["Nama Pelanggan", "Nomor Telepon", "Email", "Alamat", "Lokasi Acara", "Catatan Khusus", "Info Alergi", "Nama Penerima", "Kontak Penerima", "Alamat Pengiriman"].map(f => (
            <p key={f} className="flex items-center gap-1.5 text-xs text-green-700"><Lock size={9} />{f}</p>
          ))}
        </div>
      </div>
    </div>
  );

  const tabContent = [<Tab0 key={0} />, <Tab1 key={1} />, <Tab2 key={2} />, <Tab3 key={3} />];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-gray-800">Pemesanan Catering</h2>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "#d1fae5", color: "#065f46" }}>
              <ShieldCheck size={9} />ChaCha20 Protected
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">Kelola pemesanan catering dengan enkripsi data otomatis</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm" style={{ background: "#2563eb" }}>
          <Plus size={16} />Tambah Pesanan
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm" style={{ border: "1px solid #e2e8f0" }}>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Cari pesanan berdasarkan ID, pelanggan, atau nama acara..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg text-sm border outline-none" style={{ borderColor: "#e2e8f0" }} onFocus={onF as any} onBlur={onB as any} />
          </div>
          <div className="text-sm text-gray-500">{filtered.length} pesanan</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: "1px solid #e2e8f0" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              <tr>
                {["ID Pesanan", "Nama Pelanggan", "Nama Acara", "Tanggal Acara", "Tamu", "Paket", "Total Biaya", "Status", "Enkripsi", "Aksi"].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase whitespace-nowrap" style={{ color: "#94a3b8" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: "#f1f5f9" }}>
                  <td className="px-5 py-3.5 text-xs font-mono font-semibold text-gray-600">{o.id}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-gray-800 whitespace-nowrap">{o.customerName}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600 max-w-[160px] truncate">{o.eventName}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">{new Date(o.eventDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{o.guestCount.toLocaleString("id-ID")}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-700 font-medium whitespace-nowrap">{o.pkg}</td>
                  <td className="px-5 py-3.5 text-sm font-bold text-gray-800 whitespace-nowrap">Rp {o.totalCost.toLocaleString("id-ID")}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap" style={{ background: statusStyle[o.status]?.bg, color: statusStyle[o.status]?.color }}>{o.status}</span>
                  </td>
                  <td className="px-5 py-3.5"><ENC /></td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setSelected(o); setIsDetailOpen(true); }} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600" title="Detail"><Eye size={15} /></button>
                      <button onClick={() => openEdit(o)} className="p-1.5 rounded-lg hover:bg-green-50 text-green-600" title="Edit"><Edit size={15} /></button>
                      <button onClick={() => handleDelete(o.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500" title="Hapus"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="py-16 text-center text-gray-400 text-sm">Tidak ada data pesanan</div>}
        </div>
      </div>

      {/* Form Modal */}
      <Dialog.Root open={isFormOpen} onOpenChange={setIsFormOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 pt-6 pb-0 shrink-0">
              <div className="flex items-start justify-between mb-3">
                <Dialog.Title className="text-lg font-bold text-gray-800">{editMode ? "Edit Pesanan Catering" : "Tambah Pesanan Catering"}</Dialog.Title>
                <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">✕</button>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl mb-4" style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}>
                <ShieldCheck size={14} style={{ color: "#2563eb" }} />
                <p className="text-xs" style={{ color: "#1d4ed8" }}>Field <strong>bertanda ChaCha20</strong> akan dienkripsi otomatis sebelum disimpan ke database</p>
              </div>
              {/* Tabs */}
              <div className="flex gap-1 p-1 rounded-xl mb-4" style={{ background: "#f1f5f9" }}>
                {tabs.map((t, i) => (
                  <button key={i} onClick={() => setActiveTab(i)} className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all" style={{ background: activeTab === i ? "#fff" : "transparent", color: activeTab === i ? "#1d4ed8" : "#94a3b8", boxShadow: activeTab === i ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto px-6 pb-2">{tabContent[activeTab]}</div>
            {/* Footer */}
            <div className="px-6 py-4 shrink-0" style={{ borderTop: "1px solid #e2e8f0" }}>
              <div className="flex items-center gap-3">
                <button onClick={handlePreviewEncryption} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all" style={{ borderColor: "#e2e8f0", color: "#475569" }}>
                  <Eye size={14} />Preview Enkripsi
                </button>
                <div className="flex-1" />
                {activeTab > 0 && <button onClick={() => setActiveTab(a => a - 1)} className="px-4 py-2 rounded-lg border text-sm font-medium text-gray-600 hover:bg-gray-50" style={{ borderColor: "#e2e8f0" }}>← Kembali</button>}
                {activeTab < tabs.length - 1
                  ? <button onClick={() => setActiveTab(a => a + 1)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: "#2563eb" }}>Lanjut <ChevronRight size={14} /></button>
                  : <button onClick={runEncryptionSim} className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: "#059669" }}>
                      <ShieldCheck size={14} />Simpan & Enkripsi
                    </button>
                }
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Preview Encryption Modal */}
      <Dialog.Root open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xl max-h-[85vh] overflow-y-auto">
            <Dialog.Title className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
              <Eye size={18} className="text-blue-600" />Preview Enkripsi Data
            </Dialog.Title>
            <p className="text-sm text-gray-500 mb-4">Pratinjau transformasi data sebelum disimpan ke database</p>
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #e2e8f0" }}>
              <div className="grid grid-cols-3 px-4 py-2.5 text-xs font-semibold uppercase" style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#94a3b8" }}>
                <span>Field</span><span>Plaintext</span><span>Ciphertext (ChaCha20)</span>
              </div>
              {Object.entries(encryptedFields).map(([field, cipher]) => (
                <div key={field} className="grid grid-cols-3 px-4 py-3 border-t text-sm items-center" style={{ borderColor: "#f1f5f9" }}>
                  <span className="text-xs font-medium text-gray-600">{field}</span>
                  <span className="text-xs text-gray-800 font-medium truncate pr-2">{(form as any)[Object.keys(form).find(k => k.toLowerCase().includes(field.toLowerCase().replace(" ", "").substring(0, 4))) ?? ""] || "-"}</span>
                  <span className="text-xs font-mono" style={{ color: "#059669" }}>{cipher}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setIsPreviewOpen(false)} className="w-full mt-4 py-2.5 rounded-xl text-white text-sm font-semibold" style={{ background: "#2563eb" }}>Tutup Preview</button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Encryption Simulation Modal */}
      <Dialog.Root open={isEncOpen} onOpenChange={() => {}}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-md" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#dbeafe" }}>
                  <ShieldCheck size={20} style={{ color: "#2563eb" }} />
                </div>
                <div>
                  <Dialog.Title className="font-bold text-gray-800">Proses Enkripsi ChaCha20</Dialog.Title>
                  <p className="text-xs text-gray-500">Mengamankan data sebelum disimpan ke SQLite...</p>
                </div>
              </div>

              {/* Network data (step 2) */}
              {encStep >= 2 && (
                <div className="mt-4 p-3 rounded-xl text-xs" style={{ background: "#0c1830", border: "1px solid rgba(59,130,246,0.2)" }}>
                  <p className="font-semibold text-blue-400 mb-2">Komponen Jaringan Terdetekti</p>
                  <div className="grid grid-cols-2 gap-y-1">
                    {[["IPv4", netData.ipv4], ["IPv6", netData.ipv6.substring(0, 20) + "..."], ["MAC", netData.mac], ["Provider", netData.provider], ["Hostname", netData.hostname]].map(([k, v]) => (
                      <div key={k} className="flex gap-2">
                        <span style={{ color: "#475569" }}>{k}:</span>
                        <span className="font-mono" style={{ color: "#94a3b8" }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Steps */}
              <div className="mt-4 space-y-2">
                {ENC_STEPS.map((step, i) => {
                  const Icon = step.icon;
                  const done = encStep > i + 1;
                  const active = encStep === i + 1;
                  const pending = encStep <= i;
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl transition-all duration-500" style={{
                      background: done ? "#f0fdf4" : active ? "#eff6ff" : "#f8fafc",
                      border: `1px solid ${done ? "#bbf7d0" : active ? "#bfdbfe" : "#e2e8f0"}`,
                      opacity: pending ? 0.4 : 1
                    }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all" style={{ background: done ? "#059669" : active ? "#2563eb" : "#e2e8f0" }}>
                        {done ? <CheckCircle size={15} className="text-white" /> : <Icon size={15} style={{ color: done ? "white" : active ? "white" : "#94a3b8" }} />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold" style={{ color: done ? "#065f46" : active ? "#1d4ed8" : "#64748b" }}>{step.label}</p>
                        <p className="text-xs" style={{ color: done ? "#059669" : active ? "#3b82f6" : "#94a3b8" }}>{step.desc}</p>
                      </div>
                      {active && <div className="flex gap-1">{[0,1,2].map(d => <span key={d} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "#3b82f6", animationDelay: `${d*0.15}s` }} />)}</div>}
                      {done && <CheckCircle size={14} style={{ color: "#059669" }} />}
                    </div>
                  );
                })}
              </div>

              {/* Plaintext → Ciphertext at step 5 */}
              {encStep >= 5 && (
                <div className="mt-4 rounded-xl overflow-hidden" style={{ border: "1px solid #e2e8f0" }}>
                  <div className="px-4 py-2.5 text-xs font-semibold" style={{ background: "#0c1830", color: "#3b82f6" }}>Transformasi Data: Plaintext → Ciphertext</div>
                  <div className="divide-y" style={{ divideColor: "#f1f5f9" }}>
                    {Object.entries(encryptedFields).slice(0, 5).map(([field, cipher]) => (
                      <div key={field} className="grid grid-cols-3 px-4 py-2.5 items-center gap-2">
                        <span className="text-xs text-gray-500 font-medium">{field}</span>
                        <span className="text-xs text-gray-700 truncate">{"••••••••"}</span>
                        <span className="text-xs font-mono truncate" style={{ color: "#059669" }}>{cipher}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Success */}
              {encDone && (
                <div className="mt-4 flex items-center gap-3 p-4 rounded-xl" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                  <CheckCircle size={20} style={{ color: "#059669" }} />
                  <div>
                    <p className="font-semibold text-green-800">Enkripsi Berhasil!</p>
                    <p className="text-xs text-green-600">Data siap disimpan ke database SQLite</p>
                  </div>
                </div>
              )}

              <button onClick={confirmSave} disabled={!encDone} className="w-full mt-4 py-2.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all" style={{ background: encDone ? "#059669" : "#94a3b8" }}>
                {encDone ? <><Database size={15} />Konfirmasi & Simpan ke Database</> : <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Memproses Enkripsi...</>}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Detail Modal */}
      <Dialog.Root open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <Dialog.Title className="text-lg font-bold text-gray-800 mb-4">Detail Pesanan Catering</Dialog.Title>
            {selected && (
              <div className="space-y-3">
                <div className="p-4 rounded-xl" style={{ background: "#0c1830" }}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-mono font-bold text-blue-400 text-sm">{selected.id}</p>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: statusStyle[selected.status]?.bg, color: statusStyle[selected.status]?.color }}>{selected.status}</span>
                  </div>
                  <p className="text-white font-bold text-lg">{selected.eventName}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>{selected.eventType} · {new Date(selected.eventDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[["Pelanggan", selected.customerName, true], ["No. Telepon", selected.phone, true], ["Lokasi", selected.eventLocation, true], ["Jumlah Tamu", `${selected.guestCount} orang`, false], ["Paket", selected.pkg, false], ["Status Bayar", selected.paymentStatus, false]].map(([label, value, enc]) => (
                    <div key={label as string} className="p-3 rounded-xl" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <p className="text-xs text-gray-500">{label as string}</p>
                        {enc && <ENC />}
                      </div>
                      <p className="text-sm font-semibold text-gray-800">{value as string}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-xl" style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}>
                  <p className="text-xs text-blue-600">Total Biaya</p>
                  <p className="text-2xl font-bold text-blue-800">Rp {selected.totalCost.toLocaleString("id-ID")}</p>
                </div>
                {selected.notes && (
                  <div className="p-3 rounded-xl" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                    <div className="flex items-center gap-1.5 mb-1"><p className="text-xs text-gray-500">Catatan Khusus</p><ENC /></div>
                    <p className="text-sm text-gray-700">{selected.notes}</p>
                  </div>
                )}
              </div>
            )}
            <button onClick={() => setIsDetailOpen(false)} className="w-full mt-4 py-2.5 rounded-xl text-white text-sm font-semibold" style={{ background: "#2563eb" }}>Tutup</button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}