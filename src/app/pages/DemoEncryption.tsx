import { useState } from "react";
import { Lock, Unlock, ArrowRight, Copy, CheckCircle, Shield, Zap, FlaskConical, RefreshCw, Info } from "lucide-react";
import { chacha20Encrypt, chacha20Decrypt, STABLE_KEY_DISPLAY } from "../utils/encryption";

const SAMPLE_TEXTS = [
  "Budi Santoso",
  "0812-3456-7890",
  "budi@email.com",
  "Jl. Merdeka No. 12, Jakarta Selatan",
  "Gedung Serbaguna, Jakarta",
];

export function DemoEncryption() {
  const [plaintext, setPlaintext] = useState("");
  const [ciphertext, setCiphertext] = useState("");
  const [decryptInput, setDecryptInput] = useState("");
  const [decryptOutput, setDecryptOutput] = useState("");
  const [copiedEnc, setCopiedEnc] = useState(false);
  const [copiedDec, setCopiedDec] = useState(false);

  const handleEncrypt = () => {
    if (!plaintext.trim()) return;
    setCiphertext(chacha20Encrypt(plaintext));
  };

  const handleDecrypt = () => {
    if (!decryptInput.trim()) return;
    setDecryptOutput(chacha20Decrypt(decryptInput));
  };

  const copy = (text: string, type: "enc" | "dec") => {
    navigator.clipboard.writeText(text).catch(() => {});
    if (type === "enc") { setCopiedEnc(true); setTimeout(() => setCopiedEnc(false), 2000); }
    else { setCopiedDec(true); setTimeout(() => setCopiedDec(false), 2000); }
  };

  const moveToDecrypt = () => { setDecryptInput(ciphertext); setDecryptOutput(""); };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5 mb-0.5">
          <h2 className="text-xl font-bold text-gray-800">Demo ChaCha20</h2>
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "#ede9fe", color: "#6d28d9" }}>
            <FlaskConical size={11} />Simulasi Interaktif
          </span>
        </div>
        <p className="text-sm text-gray-500">Demonstrasi enkripsi dan dekripsi data menggunakan ChaCha20 Stream Cipher</p>
      </div>

      {/* Encryptor + Decryptor */}
      <div className="grid grid-cols-2 gap-5">
        {/* Encryptor */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: "1px solid #e2e8f0" }}>
          <div className="flex items-center gap-2.5 px-5 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#ede9fe" }}>
              <Lock size={17} style={{ color: "#7c3aed" }} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Text Encryptor</h3>
              <p className="text-xs text-gray-400">Plaintext → Ciphertext (Base64)</p>
            </div>
          </div>
          <div className="p-5 space-y-4">
            {/* Sample buttons */}
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Contoh Data Catering:</p>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_TEXTS.map(t => (
                  <button key={t} onClick={() => setPlaintext(t)} className="text-xs px-2.5 py-1 rounded-lg border transition-all hover:bg-purple-50" style={{ borderColor: "#e2e8f0", color: "#475569" }}>
                    {t.length > 20 ? t.substring(0, 20) + "..." : t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Input Plaintext</label>
              <textarea value={plaintext} onChange={e => setPlaintext(e.target.value)} rows={5} className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none resize-none" style={{ borderColor: "#e2e8f0" }} onFocus={e => e.target.style.borderColor = "#7c3aed"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} placeholder="Masukkan teks untuk dienkripsi..." />
            </div>
            <button onClick={handleEncrypt} disabled={!plaintext.trim()} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-40 transition-all" style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
              <Lock size={14} />Enkripsi dengan ChaCha20 <ArrowRight size={14} />
            </button>
            {ciphertext && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Output Ciphertext (Base64)</label>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => copy(ciphertext, "enc")} className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg hover:bg-gray-100 text-gray-500 transition-all">
                      {copiedEnc ? <CheckCircle size={11} style={{ color: "#059669" }} /> : <Copy size={11} />}
                      {copiedEnc ? "Copied!" : "Copy"}
                    </button>
                    <button onClick={moveToDecrypt} className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg hover:bg-purple-50 transition-all" style={{ color: "#7c3aed" }}>
                      Coba Decrypt →
                    </button>
                  </div>
                </div>
                <div className="rounded-xl p-3 font-mono text-xs break-all leading-relaxed" style={{ background: "#0c1830", color: "#4ade80" }}>
                  {ciphertext}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Decryptor */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: "1px solid #e2e8f0" }}>
          <div className="flex items-center gap-2.5 px-5 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#d1fae5" }}>
              <Unlock size={17} style={{ color: "#059669" }} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Data Decryptor</h3>
              <p className="text-xs text-gray-400">Ciphertext (Base64) → Plaintext</p>
            </div>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-start gap-2.5 p-3 rounded-xl" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
              <Info size={14} style={{ color: "#059669" }} className="mt-0.5 shrink-0" />
              <p className="text-xs text-green-700">Paste hasil enkripsi dari Text Encryptor, atau gunakan tombol "Coba Decrypt →" untuk langsung mencobanya.</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Input Ciphertext (Base64)</label>
              <textarea value={decryptInput} onChange={e => setDecryptInput(e.target.value)} rows={5} className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none resize-none font-mono" style={{ borderColor: "#e2e8f0" }} onFocus={e => e.target.style.borderColor = "#059669"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} placeholder="Paste kode Base64 di sini..." />
            </div>
            <button onClick={handleDecrypt} disabled={!decryptInput.trim()} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-40" style={{ background: "linear-gradient(135deg,#059669,#0d9488)" }}>
              <Unlock size={14} />Dekripsi ke Plaintext <ArrowRight size={14} />
            </button>
            {decryptOutput && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Output Plaintext</label>
                  <button onClick={() => copy(decryptOutput, "dec")} className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg hover:bg-gray-100 text-gray-500 transition-all">
                    {copiedDec ? <CheckCircle size={11} style={{ color: "#059669" }} /> : <Copy size={11} />}
                    {copiedDec ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div className="p-3 rounded-xl" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                  <p className="text-sm text-green-800 font-medium break-all">{decryptOutput}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Deep Audit - Dark Panel */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "#0c1830", border: "1px solid rgba(59,130,246,0.15)" }}>
        <div className="flex items-center gap-2.5 px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <Zap size={16} style={{ color: "#fbbf24" }} />
          <h3 className="font-bold text-white">Deep Audit: ChaCha20 Internal</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4 mb-5">
            {[
              { label: "Stable Server Key", value: STABLE_KEY_DISPLAY, mono: true, color: "#4ade80" },
              { label: "Algoritma", value: "ChaCha20 Stream Cipher", mono: false, color: "#60a5fa", badge: true },
              { label: "Key Size", value: "256-bit / 32-byte", mono: false, color: "#a78bfa" },
            ].map(({ label, value, mono, color, badge }) => (
              <div key={label} className="rounded-xl p-4" style={{ background: "#1e3a5f", border: "1px solid rgba(59,130,246,0.1)" }}>
                <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "#475569" }}>{label}</p>
                {badge ? (
                  <div className="flex items-center gap-1.5">
                    <Shield size={14} style={{ color }} />
                    <span className="text-sm font-bold" style={{ color }}>{value}</span>
                  </div>
                ) : (
                  <p className={`text-sm font-medium break-all leading-relaxed ${mono ? "font-mono" : ""}`} style={{ color }}>{value}</p>
                )}
              </div>
            ))}
          </div>

          <div className="rounded-xl p-4 mb-4" style={{ background: "#1e3a5f", border: "1px solid rgba(59,130,246,0.1)" }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded" style={{ background: "#4ade80" }} />
              <p className="text-sm font-bold text-white">Cara Kerja Simulasi</p>
            </div>
            <div className="space-y-2">
              {[
                ["Enkripsi", "Plaintext di-XOR dengan keystream dari Key + Random 12-byte Nonce. Nonce digabung di depan ciphertext, lalu di-encode ke Base64."],
                ["Dekripsi", "Data Base64 di-decode → 12 byte pertama = Nonce, sisanya = Ciphertext. Di-XOR dengan Key yang sama menggunakan Nonce untuk mendapat plaintext asli."],
                ["Konsistensi", "Karena menggunakan Key yang sama, encrypt → decrypt selalu mengembalikan teks asli. Setiap enkripsi menghasilkan Base64 yang berbeda (karena Nonce acak)."],
              ].map(([title, desc]) => (
                <div key={title}>
                  <span className="text-xs font-bold text-white">{title}: </span>
                  <span className="text-xs" style={{ color: "#64748b" }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-4" style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.04)" }}>
            <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "#334155" }}>Active Encryption Key (256-bit)</p>
            <p className="font-mono text-xs break-all leading-relaxed" style={{ color: "#4ade80" }}>
              {STABLE_KEY_DISPLAY.match(/.{8}/g)?.join(" ")}
            </p>
          </div>
        </div>
      </div>

      {/* Integration info */}
      <div className="flex items-start gap-3 p-4 rounded-2xl" style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}>
        <Shield size={18} style={{ color: "#2563eb" }} className="shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-blue-800">Integrasi dengan Pemesanan Catering</p>
          <p className="text-xs text-blue-700 mt-0.5">Demo di atas menunjukkan cara sistem mengenkripsi data sensitif — nama pelanggan, nomor telepon, email, alamat, lokasi acara, catatan khusus, informasi alergi, nama penerima, kontak penerima, dan alamat pengiriman — sebelum disimpan ke database SQLite. Kunci enkripsi dibentuk secara unik dari komponen jaringan perangkat (lihat halaman Keamanan & Enkripsi).</p>
        </div>
      </div>
    </div>
  );
}
