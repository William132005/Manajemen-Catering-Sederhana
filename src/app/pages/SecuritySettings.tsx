import { useState, useEffect, useCallback } from "react";
import { Shield, Wifi, Key, RefreshCw, Eye, Lock, CheckCircle, Database, Globe, Server, Fingerprint, Activity, Copy, Hash, ChevronRight, Table } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { generateNetworkData, generateHex, chacha20Encrypt, shortCipher, STABLE_KEY_DISPLAY } from "../utils/encryption";

const FLOW_STEPS = [
  { icon: Wifi, label: "Komponen Jaringan", desc: "IPv4 · IPv6 · MAC · Provider · Hostname", color: "#3b82f6", bg: "#dbeafe" },
  { icon: Hash, label: "Enkripsi IP", desc: "ChaCha20(IPv4) → IP terenkripsi", color: "#8b5cf6", bg: "#ede9fe" },
  { icon: Key, label: "Pembentukan Key", desc: "SHA-256(fingerprint) → 256-bit key", color: "#0891b2", bg: "#cffafe" },
  { icon: Lock, label: "Enkripsi Data", desc: "ChaCha20 stream cipher", color: "#059669", bg: "#d1fae5" },
  { icon: Database, label: "Simpan ke SQLite", desc: "Data + metadata kunci disimpan", color: "#d97706", bg: "#fef3c7" },
];

interface KeyRecord {
  keyId: string; orderId: string; encFingerprint: string; encIp: string; keyHash: string; algorithm: string; createdAt: string;
}

export function SecuritySettings() {
  const [net, setNet] = useState(generateNetworkData());
  const [key, setKey] = useState("");
  const [keyGenerated, setKeyGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [keyRecords] = useState<KeyRecord[]>([
    { keyId: "KEY-001", orderId: "CAT-001", encFingerprint: shortCipher("fe80::192.168.1.5"), encIp: shortCipher("192.168.1.5"), keyHash: generateHex(32), algorithm: "ChaCha20", createdAt: "2026-04-20 09:31" },
    { keyId: "KEY-002", orderId: "CAT-002", encFingerprint: shortCipher("fe80::192.168.1.8"), encIp: shortCipher("192.168.1.8"), keyHash: generateHex(32), algorithm: "ChaCha20", createdAt: "2026-04-25 14:05" },
    { keyId: "KEY-003", orderId: "CAT-003", encFingerprint: shortCipher("fe80::192.168.2.1"), encIp: shortCipher("192.168.2.1"), keyHash: generateHex(32), algorithm: "ChaCha20", createdAt: "2026-04-28 11:22" },
  ]);

  const runGenKey = useCallback(() => {
    setLoading(true);
    FLOW_STEPS.forEach((_, i) => {
      setTimeout(() => {
        setActiveStep(i);
        if (i === FLOW_STEPS.length - 1) {
          const newKey = generateHex(64);
          setKey(newKey);
          setKeyGenerated(true);
          setLoading(false);
          setTimeout(() => setActiveStep(null), 800);
        }
      }, i * 700);
    });
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => { setNet(generateNetworkData()); setKeyGenerated(false); setKey(""); setLoading(false); }, 800);
  };

  useEffect(() => { runGenKey(); }, []);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-0.5">
            <h2 className="text-xl font-bold text-gray-800">Keamanan & Enkripsi</h2>
            <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "#d1fae5", color: "#065f46" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />Sistem Aktif
            </span>
          </div>
          <p className="text-sm text-gray-500">Manajemen kunci enkripsi ChaCha20 berbasis komponen jaringan perangkat</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl" style={{ background: "#0c1830", color: "#3b82f6" }}>
          <Shield size={15} />ChaCha20 · 256-bit
        </div>
      </div>

      {/* Top banner */}
      <div className="rounded-2xl p-5 text-white flex items-center gap-5" style={{ background: "linear-gradient(135deg, #0c1830 0%, #1e3a5f 100%)", border: "1px solid rgba(59,130,246,0.2)" }}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)" }}>
          <Shield size={28} style={{ color: "#60a5fa" }} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg">ChaCha20 Stream Cipher Aktif</h3>
          <p className="text-sm mt-0.5" style={{ color: "#94a3b8" }}>Data sensitif pada setiap pemesanan catering dienkripsi otomatis menggunakan kunci unik yang dibentuk dari identitas jaringan perangkat ini.</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs" style={{ color: "#64748b" }}>Algoritma</p>
          <p className="font-bold text-xl" style={{ color: "#60a5fa" }}>ChaCha20</p>
          <p className="text-xs" style={{ color: "#64748b" }}>256-bit Symmetric Key</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-2 gap-5">
        {/* Network Info */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: "1px solid #e2e8f0" }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#dbeafe" }}><Wifi size={16} style={{ color: "#2563eb" }} /></div>
              <h3 className="font-bold text-gray-800">Informasi Jaringan Perangkat</h3>
            </div>
            <button onClick={handleRefresh} disabled={loading} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50" style={{ borderColor: "#e2e8f0" }}>
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />Refresh
            </button>
          </div>
          <div className="p-5 space-y-3">
            {[
              { icon: Globe, label: "IPv4 Address", value: net.ipv4, mono: true },
              { icon: Globe, label: "IPv6 Address", value: net.ipv6, mono: true },
              { icon: Fingerprint, label: "MAC Address", value: net.mac, mono: true },
              { icon: Wifi, label: "Provider Jaringan", value: net.provider, mono: false },
              { icon: Server, label: "Hostname Perangkat", value: net.hostname, mono: true },
              { icon: Server, label: "Network Interface", value: net.interfaceId, mono: true },
            ].map(({ icon: Icon, label, value, mono }) => (
              <div key={label} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid #f8fafc" }}>
                <div className="flex items-center gap-2.5">
                  <Icon size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-500">{label}</span>
                </div>
                <span className={`text-sm font-medium text-gray-800 ${mono ? "font-mono" : ""}`}>{value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2.5"><Activity size={14} className="text-gray-400" /><span className="text-sm text-gray-500">Status Koneksi</span></div>
              <span className="flex items-center gap-1.5 text-sm font-semibold text-green-600"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />{net.status}</span>
            </div>
            <p className="text-xs text-gray-400">Terakhir diperbarui: {net.updatedAt}</p>
          </div>
        </div>

        {/* Key Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: "1px solid #e2e8f0" }}>
          <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#ede9fe" }}><Key size={16} style={{ color: "#7c3aed" }} /></div>
            <h3 className="font-bold text-gray-800">Kunci Enkripsi ChaCha20</h3>
          </div>
          <div className="p-5 space-y-4">
            {/* Status badges */}
            <div className="grid grid-cols-3 gap-2">
              {[["Status", "Aktif", "#d1fae5", "#065f46"], ["Algoritma", "ChaCha20", "#dbeafe", "#1d4ed8"], ["Sumber", "Jaringan", "#ede9fe", "#6d28d9"]].map(([l, v, bg, c]) => (
                <div key={l} className="p-3 rounded-xl text-center" style={{ background: bg, border: `1px solid ${bg}` }}>
                  <p className="text-xs" style={{ color: c, opacity: 0.7 }}>{l}</p>
                  <p className="text-sm font-bold mt-0.5" style={{ color: c }}>{v}</p>
                </div>
              ))}
            </div>
            {/* Formula */}
            <div className="p-3 rounded-xl" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <p className="text-xs font-semibold text-gray-500 mb-1">Formula Pembentukan Kunci:</p>
              <p className="text-xs font-mono" style={{ color: "#7c3aed" }}>Key = SHA-256(IPv4 + IPv6 + MAC + Provider + Hostname)</p>
            </div>
            {/* Key display */}
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1.5">Encryption Key (256-bit / 64 hex chars):</p>
              <div className="rounded-xl p-3 flex items-start justify-between gap-2" style={{ background: "#0c1830" }}>
                <p className="text-xs font-mono break-all leading-relaxed flex-1" style={{ color: "#4ade80" }}>
                  {keyGenerated ? key.match(/.{1,8}/g)?.join(" ") : <span className="text-gray-600 italic">Belum digenerate...</span>}
                </p>
                {keyGenerated && (
                  <button onClick={() => { navigator.clipboard.writeText(key).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="shrink-0 p-1.5 rounded hover:bg-white/10 text-gray-500 hover:text-white transition-all">
                    {copied ? <CheckCircle size={13} style={{ color: "#4ade80" }} /> : <Copy size={13} />}
                  </button>
                )}
              </div>
            </div>
            {/* Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button onClick={runGenKey} disabled={loading} className="flex flex-col items-center gap-1.5 py-3 rounded-xl text-white text-xs font-semibold transition-all disabled:opacity-60" style={{ background: "#2563eb" }}>
                <Key size={16} />Generate Key
              </button>
              <button onClick={handleRefresh} disabled={loading} className="flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-semibold transition-all disabled:opacity-60" style={{ background: "#f1f5f9", color: "#475569" }}>
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />Refresh
              </button>
              <button onClick={() => setIsDetailOpen(true)} disabled={!keyGenerated} className="flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-semibold transition-all disabled:opacity-40" style={{ background: "#ede9fe", color: "#6d28d9" }}>
                <Eye size={16} />Detail Key
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Flow Visualization */}
      <div className="bg-white rounded-2xl shadow-sm" style={{ border: "1px solid #e2e8f0" }}>
        <div className="flex items-center gap-2 px-6 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#d1fae5" }}><Shield size={16} style={{ color: "#059669" }} /></div>
          <h3 className="font-bold text-gray-800">Visualisasi Alur Keamanan</h3>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between gap-2">
            {FLOW_STEPS.map((step, i) => {
              const Icon = step.icon;
              const isA = activeStep === i;
              const isDone = activeStep !== null && activeStep > i || (keyGenerated && activeStep === null);
              return (
                <div key={i} className="flex items-center flex-1">
                  <div className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-400 ${isA ? "scale-105 shadow-md" : ""}`}
                    style={{ background: isA ? step.bg : isDone ? "#f0fdf4" : "#f8fafc", borderColor: isA ? step.color : isDone ? "#bbf7d0" : "#e2e8f0" }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: isA ? step.bg : isDone ? "#d1fae5" : "#f1f5f9", border: `2px solid ${isA ? step.color : isDone ? "#86efac" : "#e2e8f0"}` }}>
                      {isDone && !isA ? <CheckCircle size={18} style={{ color: "#059669" }} /> : <Icon size={18} style={{ color: isA ? step.color : "#94a3b8" }} />}
                    </div>
                    <p className="text-xs font-bold text-center" style={{ color: isA ? step.color : isDone ? "#065f46" : "#475569" }}>{step.label}</p>
                    <p className="text-xs text-center" style={{ color: isA ? step.color : "#94a3b8", opacity: 0.8 }}>{step.desc}</p>
                    {isA && <div className="flex gap-1">{[0,1,2].map(d => <span key={d} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: step.color, animationDelay: `${d*0.15}s` }} />)}</div>}
                  </div>
                  {i < FLOW_STEPS.length - 1 && (
                    <div className="flex items-center shrink-0 px-1">
                      <div className="h-0.5 w-6" style={{ background: isDone ? "#86efac" : "#e2e8f0" }} />
                      <ChevronRight size={14} style={{ color: isDone ? "#059669" : "#cbd5e1" }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-5 flex justify-center">
            <button onClick={runGenKey} disabled={loading} className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold text-sm disabled:opacity-60" style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)" }}>
              {loading ? <RefreshCw size={15} className="animate-spin" /> : <Shield size={15} />}
              {loading ? "Memproses..." : "Simulasikan Alur Keamanan"}
            </button>
          </div>
        </div>
      </div>

      {/* encryption_keys table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: "1px solid #e2e8f0" }}>
        <div className="flex items-center gap-2 px-6 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#fef3c7" }}><Table size={16} style={{ color: "#d97706" }} /></div>
          <div>
            <h3 className="font-bold text-gray-800">Tabel: <code className="font-mono text-sm bg-gray-100 px-1.5 py-0.5 rounded">encryption_keys</code></h3>
            <p className="text-xs text-gray-400">Metadata kunci enkripsi tersimpan di SQLite</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              <tr>
                {["key_id", "order_id", "encrypted_network_fingerprint", "encrypted_ip_address", "derived_key_hash", "algorithm", "created_at"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-mono font-semibold" style={{ color: "#3b82f6" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {keyRecords.map(r => (
                <tr key={r.keyId} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: "#f1f5f9" }}>
                  <td className="px-4 py-3 text-xs font-mono font-bold text-gray-700">{r.keyId}</td>
                  <td className="px-4 py-3 text-xs font-mono text-gray-600">{r.orderId}</td>
                  <td className="px-4 py-3 text-xs font-mono max-w-[160px] truncate" style={{ color: "#059669" }}>{r.encFingerprint}</td>
                  <td className="px-4 py-3 text-xs font-mono max-w-[140px] truncate" style={{ color: "#059669" }}>{r.encIp}</td>
                  <td className="px-4 py-3 text-xs font-mono max-w-[160px] truncate text-gray-500">{r.keyHash}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "#dbeafe", color: "#1d4ed8" }}>{r.algorithm}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{r.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Detail Modal */}
      <Dialog.Root open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xl">
            <Dialog.Title className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2"><Key size={18} style={{ color: "#7c3aed" }} />Detail Pembentukan Kunci Enkripsi</Dialog.Title>
            <p className="text-sm text-gray-500 mb-5">Proses hash dari komponen jaringan perangkat aktif</p>
            <div className="space-y-3">
              <div className="p-4 rounded-xl" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Input Komponen Jaringan</p>
                {[["IPv4", net.ipv4], ["IPv6", net.ipv6], ["MAC", net.mac], ["Provider", net.provider], ["Hostname", net.hostname]].map(([k, v]) => (
                  <div key={k} className="flex gap-3 mb-2">
                    <span className="text-xs text-gray-400 w-16 shrink-0">{k}</span>
                    <span className="text-xs font-mono text-gray-800 bg-white px-2 py-0.5 rounded border flex-1 truncate" style={{ borderColor: "#e2e8f0" }}>{v}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="h-px flex-1" style={{ background: "#e2e8f0" }} />
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium" style={{ background: "#ede9fe", color: "#7c3aed" }}><Hash size={11} />SHA-256 Hash Function</div>
                <div className="h-px flex-1" style={{ background: "#e2e8f0" }} />
              </div>
              <div className="rounded-xl p-4" style={{ background: "#0c1830" }}>
                <p className="text-xs font-semibold mb-2" style={{ color: "#475569" }}>Output: Encryption Key (256-bit)</p>
                <p className="text-xs font-mono break-all leading-relaxed" style={{ color: "#4ade80" }}>{key.match(/.{1,8}/g)?.join(" ")}</p>
                <div className="mt-2 flex gap-4 text-xs" style={{ color: "#475569" }}>
                  <span>256-bit / 32-byte / 64 hex chars</span>
                  <span>·</span>
                  <span>ChaCha20 Stream Cipher</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsDetailOpen(false)} className="w-full mt-4 py-2.5 rounded-xl text-white text-sm font-semibold" style={{ background: "#7c3aed" }}>Tutup</button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
