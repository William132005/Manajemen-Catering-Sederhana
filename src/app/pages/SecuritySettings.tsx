import { useState, useEffect, useCallback } from "react";
import {
  Shield, Wifi, Key, RefreshCw, Eye, Lock, CheckCircle,
  Database, Server, Network, Cpu, Copy, ChevronRight,
  AlertCircle, Globe, Hash, Fingerprint, Activity
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

interface NetworkData {
  ipv4: string;
  ipv6: string;
  mac: string;
  provider: string;
  hostname: string;
  interfaceId: string;
  status: "Terhubung" | "Terputus";
  lastUpdated: string;
}

const generateRandomHex = (len: number) =>
  Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16)).join("");

const generateNetworkData = (): NetworkData => {
  const octet = () => Math.floor(Math.random() * 254) + 1;
  const hexByte = () => Math.floor(Math.random() * 256).toString(16).padStart(2, "0").toUpperCase();
  const hexWord = () => Math.floor(Math.random() * 65536).toString(16).padStart(4, "0");
  return {
    ipv4: `192.168.${octet()}.${octet()}`,
    ipv6: `fe80::${hexWord()}:${hexWord()}:${hexWord()}:${hexWord()}`,
    mac: `${hexByte()}:${hexByte()}:${hexByte()}:${hexByte()}:${hexByte()}:${hexByte()}`,
    provider: "Telkom Indonesia (AS7713)",
    hostname: `DESKTOP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    interfaceId: `eth${Math.floor(Math.random() * 3)}`,
    status: "Terhubung",
    lastUpdated: new Date().toLocaleTimeString("id-ID"),
  };
};

const generateKey = (net: NetworkData): string => generateRandomHex(64);

const flowSteps = [
  { icon: Wifi, label: "Komponen Jaringan", desc: "IPv4 · IPv6 · MAC · Provider · Hostname", color: "blue" },
  { icon: Hash, label: "SHA-256 Hashing", desc: "Pembentukan kunci 256-bit unik", color: "purple" },
  { icon: Lock, label: "ChaCha20 Stream Cipher", desc: "Enkripsi data sensitif", color: "indigo" },
  { icon: Database, label: "SQLite Storage", desc: "Penyimpanan data terenkripsi", color: "green" },
];

export function SecuritySettings() {
  const [networkData, setNetworkData] = useState<NetworkData>(generateNetworkData());
  const [encryptionKey, setEncryptionKey] = useState<string>("");
  const [keyGenerated, setKeyGenerated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [keyHistory, setKeyHistory] = useState<{ key: string; time: string }[]>([]);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const handleGenerateKey = useCallback(() => {
    setIsLoading(true);
    setActiveStep(0);
    const steps = [0, 1, 2, 3];
    steps.forEach((step, i) => {
      setTimeout(() => {
        setActiveStep(step);
        if (i === steps.length - 1) {
          const newKey = generateKey(networkData);
          setEncryptionKey(newKey);
          setKeyGenerated(true);
          setKeyHistory(prev => [{ key: newKey, time: new Date().toLocaleTimeString("id-ID") }, ...prev.slice(0, 4)]);
          setIsLoading(false);
          setTimeout(() => setActiveStep(null), 800);
        }
      }, i * 600);
    });
  }, [networkData]);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newNet = generateNetworkData();
      setNetworkData(newNet);
      setKeyGenerated(false);
      setEncryptionKey("");
      setIsLoading(false);
    }, 1000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(encryptionKey).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => { handleGenerateKey(); }, []);

  const colorMap: Record<string, string> = {
    blue: "bg-blue-100 text-blue-600 border-blue-200",
    purple: "bg-purple-100 text-purple-600 border-purple-200",
    indigo: "bg-indigo-100 text-indigo-600 border-indigo-200",
    green: "bg-green-100 text-green-600 border-green-200",
  };
  const ringMap: Record<string, string> = {
    blue: "ring-blue-400",
    purple: "ring-purple-400",
    indigo: "ring-indigo-400",
    green: "ring-green-400",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-bold text-gray-800">Pengaturan Keamanan</h2>
            <span className="flex items-center gap-1.5 bg-green-100 text-green-700 border border-green-200 px-3 py-1 rounded-full text-xs font-medium">
              <Shield size={12} />
              Sistem Aktif
            </span>
          </div>
          <p className="text-gray-500">Manajemen kunci enkripsi ChaCha20 berbasis komponen jaringan perangkat</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-gray-600">Enkripsi Aktif</span>
        </div>
      </div>

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-5 text-white flex items-center gap-4 shadow-lg">
        <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          <Shield size={30} className="text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">ChaCha20 Stream Cipher Aktif</h3>
          <p className="text-blue-100 text-sm mt-0.5">
            Data sensitif pada modul Manajemen Order dienkripsi secara otomatis menggunakan kunci yang dihasilkan dari identitas jaringan unik perangkat ini.
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs text-blue-200">Algoritma</p>
          <p className="font-bold text-lg">ChaCha20</p>
          <p className="text-xs text-blue-200">256-bit Key</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Network Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <Network size={18} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Informasi Jaringan Perangkat</h3>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 transition-all disabled:opacity-50"
            >
              <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
          <div className="p-5 space-y-3">
            {[
              { icon: Globe, label: "IPv4 Address", value: networkData.ipv4, mono: true },
              { icon: Globe, label: "IPv6 Address", value: networkData.ipv6, mono: true },
              { icon: Fingerprint, label: "MAC Address", value: networkData.mac, mono: true },
              { icon: Wifi, label: "Provider Jaringan", value: networkData.provider, mono: false },
              { icon: Server, label: "Hostname Perangkat", value: networkData.hostname, mono: true },
              { icon: Cpu, label: "Network Interface ID", value: networkData.interfaceId, mono: true },
            ].map(({ icon: Icon, label, value, mono }) => (
              <div key={label} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2.5">
                  <Icon size={15} className="text-gray-400" />
                  <span className="text-sm text-gray-500">{label}</span>
                </div>
                <span className={`text-sm font-medium text-gray-800 ${mono ? "font-mono" : ""}`}>{value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-2.5">
                <Activity size={15} className="text-gray-400" />
                <span className="text-sm text-gray-500">Status Koneksi</span>
              </div>
              <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                {networkData.status}
              </span>
            </div>
            <p className="text-xs text-gray-400 pt-1">Terakhir diperbarui: {networkData.lastUpdated}</p>
          </div>
        </div>

        {/* Encryption Key Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-2 p-5 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Key size={18} className="text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Kunci Enkripsi ChaCha20</h3>
          </div>

          <div className="p-5 space-y-4">
            {/* Status Badges */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                <CheckCircle size={20} className="text-green-600 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Status</p>
                <p className="text-sm font-semibold text-green-700">Aktif</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                <Lock size={20} className="text-blue-600 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Algoritma</p>
                <p className="text-sm font-semibold text-blue-700">ChaCha20</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                <Network size={20} className="text-purple-600 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Sumber Kunci</p>
                <p className="text-sm font-semibold text-purple-700">Jaringan</p>
              </div>
            </div>

            {/* Formula */}
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-gray-500 mb-1.5 font-medium">Formula Pembentukan Kunci:</p>
              <p className="text-xs font-mono text-indigo-700 leading-relaxed">
                Key = SHA-256(IPv4 + IPv6 + MAC + Provider + Hostname)
              </p>
            </div>

            {/* Key Display */}
            <div>
              <p className="text-xs text-gray-500 mb-1.5 font-medium">Encryption Key (256-bit / 32-byte):</p>
              <div className="bg-gray-900 rounded-lg p-3 flex items-center justify-between gap-2">
                <p className="text-xs font-mono text-green-400 break-all flex-1">
                  {keyGenerated
                    ? encryptionKey.match(/.{1,8}/g)?.join(" ")
                    : <span className="text-gray-500 italic">Belum digenerate...</span>}
                </p>
                {keyGenerated && (
                  <button onClick={handleCopy} className="shrink-0 p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-all">
                    {copied ? <CheckCircle size={14} className="text-green-400" /> : <Copy size={14} />}
                  </button>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={handleGenerateKey}
                disabled={isLoading}
                className="flex flex-col items-center gap-1.5 px-3 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all disabled:opacity-60 text-center"
              >
                <Key size={16} />
                <span className="text-xs font-medium">Generate Key</span>
              </button>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex flex-col items-center gap-1.5 px-3 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all disabled:opacity-60"
              >
                <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                <span className="text-xs font-medium">Refresh Key</span>
              </button>
              <button
                onClick={() => setIsDetailOpen(true)}
                disabled={!keyGenerated}
                className="flex flex-col items-center gap-1.5 px-3 py-3 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition-all disabled:opacity-40"
              >
                <Eye size={16} />
                <span className="text-xs font-medium">Lihat Detail</span>
              </button>
            </div>

            {/* Key History */}
            {keyHistory.length > 1 && (
              <div>
                <p className="text-xs text-gray-500 mb-2 font-medium">Riwayat Key (5 terakhir):</p>
                <div className="space-y-1">
                  {keyHistory.slice(1).map((h, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-50 rounded px-2 py-1">
                      <span className="text-xs font-mono text-gray-500 truncate flex-1">{h.key.substring(0, 20)}...</span>
                      <span className="text-xs text-gray-400 ml-2 shrink-0">{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Security Flow Visualization */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
            <Shield size={18} className="text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-800">Visualisasi Alur Keamanan Data</h3>
        </div>

        <div className="flex items-center justify-between gap-2">
          {flowSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = activeStep === index;
            return (
              <div key={index} className="flex items-center flex-1">
                <div className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 ${
                  isActive
                    ? `${colorMap[step.color]} ring-2 ${ringMap[step.color]} shadow-md scale-105`
                    : "border-gray-100 bg-gray-50"
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isActive ? "bg-white shadow-sm" : "bg-white border border-gray-200"
                  }`}>
                    <Icon size={20} className={isActive ? `text-${step.color}-600` : "text-gray-500"} />
                  </div>
                  <div className="text-center">
                    <p className={`text-sm font-semibold ${isActive ? "" : "text-gray-700"}`}>{step.label}</p>
                    <p className={`text-xs mt-0.5 ${isActive ? "opacity-80" : "text-gray-500"}`}>{step.desc}</p>
                  </div>
                  {isActive && (
                    <div className="flex gap-1">
                      {[0, 1, 2].map(d => (
                        <span key={d} className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />
                      ))}
                    </div>
                  )}
                </div>
                {index < flowSteps.length - 1 && (
                  <div className="flex items-center px-1">
                    <div className={`h-0.5 w-8 transition-all duration-300 ${
                      activeStep !== null && activeStep > index ? "bg-blue-500" : "bg-gray-200"
                    }`} />
                    <ChevronRight size={16} className={`transition-colors duration-300 ${
                      activeStep !== null && activeStep > index ? "text-blue-500" : "text-gray-300"
                    }`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Trigger Button */}
        <div className="mt-5 flex justify-center">
          <button
            onClick={handleGenerateKey}
            disabled={isLoading}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-lg shadow-md transition-all disabled:opacity-60"
          >
            {isLoading ? <RefreshCw size={16} className="animate-spin" /> : <Shield size={16} />}
            {isLoading ? "Memproses Alur Keamanan..." : "Simulasikan Alur Keamanan"}
          </button>
        </div>
      </div>

      {/* Integration Info */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={18} className="text-blue-600" />
            <h4 className="font-semibold text-blue-800">Data Pelanggan</h4>
          </div>
          <p className="text-sm text-blue-700 mb-3">Field yang dienkripsi ChaCha20:</p>
          <ul className="text-sm text-blue-600 space-y-1">
            {["Nama Pelanggan", "Nomor Telepon", "Alamat Lengkap"].map(f => (
              <li key={f} className="flex items-center gap-2">
                <Lock size={11} />
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={18} className="text-indigo-600" />
            <h4 className="font-semibold text-indigo-800">Manajemen Order</h4>
          </div>
          <p className="text-sm text-indigo-700 mb-3">Field yang dienkripsi ChaCha20:</p>
          <ul className="text-sm text-indigo-600 space-y-1">
            {["Detail Layanan", "Total Biaya", "Catatan Order"].map(f => (
              <li key={f} className="flex items-center gap-2">
                <Lock size={11} />
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Database size={18} className="text-green-600" />
            <h4 className="font-semibold text-green-800">Penyimpanan SQLite</h4>
          </div>
          <p className="text-sm text-green-700 mb-3">Keamanan database:</p>
          <ul className="text-sm text-green-600 space-y-1">
            {["Data terenkripsi AES+ChaCha20", "Key unik per perangkat", "Rotasi kunci otomatis"].map(f => (
              <li key={f} className="flex items-center gap-2">
                <CheckCircle size={11} />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Key Detail Modal */}
      <Dialog.Root open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <Dialog.Title className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
              <Key size={20} className="text-indigo-600" />
              Detail Pembentukan Kunci Enkripsi
            </Dialog.Title>
            <p className="text-sm text-gray-500 mb-5">Proses hash dari komponen jaringan perangkat aktif</p>

            <div className="space-y-4">
              {/* Input Components */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-xs font-semibold text-gray-600 uppercase mb-3">Input Komponen Jaringan</p>
                <div className="space-y-2">
                  {[
                    { label: "IPv4", value: networkData.ipv4 },
                    { label: "IPv6", value: networkData.ipv6 },
                    { label: "MAC", value: networkData.mac },
                    { label: "Provider", value: networkData.provider },
                    { label: "Hostname", value: networkData.hostname },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex gap-3">
                      <span className="text-xs text-gray-500 w-16 shrink-0 pt-0.5">{label}</span>
                      <span className="text-xs font-mono text-gray-800 bg-white px-2 py-0.5 rounded border border-gray-200 flex-1 break-all">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center gap-2">
                <div className="h-px flex-1 bg-gray-200" />
                <div className="flex items-center gap-1.5 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                  <Hash size={12} /> SHA-256 Hash Function
                </div>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              {/* Output Key */}
              <div className="bg-gray-900 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-400 mb-2">Output: Encryption Key (256-bit)</p>
                <p className="font-mono text-xs text-green-400 break-all leading-relaxed">
                  {encryptionKey.match(/.{1,8}/g)?.join(" ")}
                </p>
                <div className="mt-3 flex gap-4 text-xs text-gray-500">
                  <span>Panjang: 256 bit / 32 byte / 64 hex</span>
                  <span>•</span>
                  <span>Algoritma: ChaCha20</span>
                </div>
              </div>

              {/* Security Notes */}
              <div className="flex items-start gap-2.5 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <AlertCircle size={16} className="text-yellow-600 shrink-0 mt-0.5" />
                <div className="text-xs text-yellow-700">
                  <p className="font-medium mb-0.5">Catatan Keamanan</p>
                  <p>Kunci enkripsi ini bersifat unik per perangkat dan sesi. Kunci tidak pernah disimpan dalam bentuk plaintext. Setiap kali sistem restart atau jaringan berubah, kunci akan diregenerasi secara otomatis.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsDetailOpen(false)}
              className="w-full mt-5 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
            >
              Tutup
            </button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
