import React, { useState, useEffect, useRef } from "react";
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  Search, 
  Bell, 
  Plus, 
  Pencil, 
  Trash2, 
  Upload, 
  ChevronLeft, 
  LogOut, 
  Filter, 
  Check, 
  Clock, 
  ImageIcon, 
  Instagram, 
  Facebook, 
  MapPin, 
  Lock, 
  User,
  X
} from "lucide-react";
import { Page, Activity } from "../types";
import { Tiktok } from "../components/Tiktok";
import { ToastContainer } from "../components/ToastContainer";

type AdminSection = "dashboard" | "docs" | "add-doc" | "settings";

interface AdminPageProps {
  nav: (p: Page) => void;
  onLogout: () => void;
  settings: any;
  onUpdateSettings: (newSettings: any) => void;
  activities: Activity[];
  onUpdateActivities: (newActivities: any[]) => void;
  token: string;
}

export function AdminPage({ 
  nav, 
  onLogout, 
  settings, 
  onUpdateSettings, 
  activities, 
  onUpdateActivities, 
  token 
}: AdminPageProps) {
  const [section, setSection] = useState<AdminSection>("dashboard");
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [submittingDoc, setSubmittingDoc] = useState(false);

  // Doc Input States
  const [editingDocId, setEditingDocId] = useState<number | null>(null);
  const [titleInput, setTitleInput] = useState("");
  const [descInput, setDescInput] = useState("");

  // Toast Notification States
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
  };
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Settings states
  const [villageNameInput, setVillageNameInput] = useState(settings?.village_name || "");
  const [logoUrlInput, setLogoUrlInput] = useState(settings?.logo_url || "");
  const [heroImageUrlInput, setHeroImageUrlInput] = useState(settings?.hero_image_url || "");
  const [phoneNumberInput, setPhoneNumberInput] = useState(settings?.phone_number || "");
  const [instagramUrlInput, setInstagramUrlInput] = useState(settings?.instagram_url || "");
  const [tiktokUrlInput, setTiktokUrlInput] = useState(settings?.tiktok_url || "");
  const [savingSettings, setSavingSettings] = useState(false);
  const [logoDragOver, setLogoDragOver] = useState(false);
  const [heroDragOver, setHeroDragOver] = useState(false);

  const logoFileRef = useRef<HTMLInputElement>(null);
  const heroFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (settings) {
      setVillageNameInput(settings.village_name || "");
      setLogoUrlInput(settings.logo_url || "");
      setHeroImageUrlInput(settings.hero_image_url || "");
      setPhoneNumberInput(settings.phone_number || "");
      setInstagramUrlInput(settings.instagram_url || "");
      setTiktokUrlInput(settings.tiktok_url || "");
    }
  }, [settings]);

  const sideNav: { icon: React.ElementType; label: string; key: AdminSection }[] = [
    { icon: LayoutDashboard, label: "Dashboard", key: "dashboard" },
    { icon: FileText, label: "Dokumentasi", key: "docs" },
    { icon: Settings, label: "Pengaturan Website", key: "settings" },
  ];

  const uploadMedia = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const res = await fetch(`${baseUrl}/upload`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Gagal mengunggah file");
    }

    const data = await res.json();
    return data.url || data.fileUrl;
  };

  const handleFileUploadClick = (ref: React.RefObject<HTMLInputElement | null>) => {
    ref.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, target: "logo" | "hero" | "doc") => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      showToast("Sedang mengunggah gambar...");
      const fileUrl = await uploadMedia(file);

      if (target === "logo") {
        setLogoUrlInput(fileUrl);
        showToast("Logo berhasil diunggah!");
      } else if (target === "hero") {
        setHeroImageUrlInput(fileUrl);
        showToast("Hero image berhasil diunggah!");
      } else if (target === "doc") {
        setUploadedFile(fileUrl);
        setRawFile(file);
        showToast("Gambar dokumentasi berhasil diunggah!");
      }
    } catch (err: any) {
      showToast(err.message || "Gagal mengunggah gambar", "error");
    }
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const payload = {
        village_name: villageNameInput,
        logo_url: logoUrlInput,
        hero_image_url: heroImageUrlInput,
        phone_number: phoneNumberInput,
        instagram_url: instagramUrlInput,
        tiktok_url: tiktokUrlInput
      };

      const res = await fetch(`${baseUrl}/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Gagal memperbarui pengaturan");
      }

      onUpdateSettings(payload);
      showToast("Pengaturan berhasil disimpan!");
    } catch (err: any) {
      showToast(err.message || "Gagal menyimpan pengaturan", "error");
    } finally {
      setSavingSettings(false);
    }
  };

  // Drag and Drop docs handlers
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };
  const onDragLeave = () => {
    setDragOver(false);
  };
  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      try {
        showToast("Sedang mengunggah gambar...");
        const fileUrl = await uploadMedia(file);
        setUploadedFile(fileUrl);
        setRawFile(file);
        showToast("Gambar berhasil diunggah!");
      } catch (err: any) {
        showToast(err.message || "Gagal mengunggah gambar", "error");
      }
    }
  };

  // Drag and Drop logo handlers
  const onLogoDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setLogoDragOver(true);
  };
  const onLogoDragLeave = () => {
    setLogoDragOver(false);
  };
  const onLogoDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setLogoDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      try {
        showToast("Sedang mengunggah logo...");
        const fileUrl = await uploadMedia(file);
        setLogoUrlInput(fileUrl);
        showToast("Logo berhasil diunggah!");
      } catch (err: any) {
        showToast(err.message || "Gagal mengunggah logo", "error");
      }
    }
  };

  // Drag and Drop hero handlers
  const onHeroDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setHeroDragOver(true);
  };
  const onHeroDragLeave = () => {
    setHeroDragOver(false);
  };
  const onHeroDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setHeroDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      try {
        showToast("Sedang mengunggah foto banner...");
        const fileUrl = await uploadMedia(file);
        setHeroImageUrlInput(fileUrl);
        showToast("Foto banner berhasil diunggah!");
      } catch (err: any) {
        showToast(err.message || "Gagal mengunggah foto banner", "error");
      }
    }
  };

  const handleSaveDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim() || !descInput.trim() || !uploadedFile) {
      showToast("Judul, deskripsi, dan gambar wajib diisi", "error");
      return;
    }

    setSubmittingDoc(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const payload = {
        title: titleInput,
        description: descInput,
        image_url: uploadedFile
      };

      let res;
      if (editingDocId) {
        // Edit existing doc
        res = await fetch(`${baseUrl}/activities/${editingDocId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        // Create new doc
        res = await fetch(`${baseUrl}/activities`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      if (!res.ok) {
        throw new Error(editingDocId ? "Gagal mengubah dokumentasi" : "Gagal menambahkan dokumentasi");
      }

      const savedAct = await res.json();
      if (editingDocId) {
        onUpdateActivities(activities.map(act => act.id === editingDocId ? savedAct : act));
        showToast("Dokumentasi berhasil diubah!");
      } else {
        onUpdateActivities([savedAct, ...activities]);
        showToast("Dokumentasi berhasil ditambahkan!");
      }

      // Reset
      setTitleInput("");
      setDescInput("");
      setUploadedFile(null);
      setRawFile(null);
      setEditingDocId(null);
      setSection("docs");
    } catch (err: any) {
      showToast(err.message || "Gagal menyimpan dokumentasi", "error");
    } finally {
      setSubmittingDoc(false);
    }
  };

  const handleEditClick = (doc: any) => {
    setEditingDocId(doc.id);
    setTitleInput(doc.title);
    setDescInput(doc.description);
    setUploadedFile(doc.image_url);
    setSection("add-doc");
  };

  const handleDelete = async (id: number) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/activities/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Gagal menghapus dokumentasi");
      }

      onUpdateActivities(activities.filter(act => act.id !== id));
      showToast("Dokumentasi berhasil dihapus!");
      setDeleteId(null);
    } catch (err: any) {
      showToast(err.message || "Gagal menghapus dokumentasi", "error");
    }
  };

  const filteredDocs = (activities as any[]).filter((d: any) => 
    d?.title && (
      d.title.toLowerCase().includes(search.toLowerCase()) || 
      (d.description || "").toLowerCase().includes(search.toLowerCase())
    )
  );

  const last7DaysCount = (activities as any[]).filter((doc: any) => {
    if (!doc?.title) return false;
    const dateStr = doc.uploaded_at || doc.date || doc.created_at;
    if (!dateStr) return false;
    const docDate = new Date(dateStr);
    const diffTime = new Date().getTime() - docDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 7;
  }).length;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} className="min-h-screen bg-[#FAF9F5] flex">
      {toast && <ToastContainer toast={toast} setToast={setToast} />}

      {/* Hidden file inputs for settings uploads */}
      <input type="file" ref={logoFileRef} accept="image/*" className="hidden" onChange={e => handleFileChange(e, "logo")} />
      <input type="file" ref={heroFileRef} accept="image/*" className="hidden" onChange={e => handleFileChange(e, "hero")} />

      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-black/[0.06] bg-white flex flex-col justify-between shrink-0 h-screen sticky top-0">
        <div>
          {/* Logo brand */}
          <div className="h-[73px] border-b border-black/[0.06] px-6 flex items-center gap-2.5">
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt="Logo" className="w-7 h-7 rounded-full object-cover border border-black/5" />
            ) : (
              <span className="w-7 h-7 rounded-full bg-[#3A6520]/10 flex items-center justify-center">
                <MapPin className="w-3.5 h-3.5 text-[#3A6520]" strokeWidth={2.2} />
              </span>
            )}
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="font-extrabold text-[14px] text-[#2C2C2A] tracking-tight">
              {settings?.village_name || "Dusun Petung"}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 flex flex-col gap-1.5">
            {sideNav.map(({ icon: Icon, label, key }) => (
              <button
                key={key}
                onClick={() => {
                  setSection(key);
                  setEditingDocId(null);
                  setTitleInput("");
                  setDescInput("");
                  setUploadedFile(null);
                  setRawFile(null);
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-[13px] font-semibold transition-all ${
                  section === key || (key === "docs" && section === "add-doc")
                    ? "bg-[#3A6520] text-white shadow-sm"
                    : "text-[#7A7065] hover:text-[#2C2C2A] hover:bg-[#F0EBE3]"
                }`}
              >
                <Icon className="w-[18px] h-[18px]" strokeWidth={1.75} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer logout */}
        <div className="p-4 border-t border-black/[0.06]">
          <button onClick={onLogout} className="w-full flex items-center gap-3.5 px-4 py-3 text-[13px] font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-all">
            <LogOut className="w-[18px] h-[18px]" strokeWidth={1.75} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header bar */}
        <header className="h-[73px] border-b border-black/[0.06] bg-white px-8 flex items-center justify-between shrink-0 sticky top-0 z-30">
          <div>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[17px] font-extrabold text-[#2C2C2A]">
              {section === "dashboard" && "Dashboard"}
              {section === "docs" && "Manajemen Dokumentasi"}
              {section === "add-doc" && (editingDocId ? "Ubah Dokumentasi" : "Tambah Dokumentasi Baru")}
              {section === "settings" && "Pengaturan Website"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => nav("home")} className="px-4 py-2 border border-black/[0.09] text-[12px] font-semibold text-[#5A5550] rounded-full hover:bg-[#FAF9F5] transition">
              Lihat Website
            </button>
            <div className="w-px h-6 bg-black/8" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#3A6520]/8 flex items-center justify-center text-[#3A6520] font-bold text-[12px]">
                AD
              </div>
              <span className="text-[12.5px] font-semibold text-[#2C2C2A]">Administrator</span>
            </div>
          </div>
        </header>

        {/* Dashboard Panels */}
        <main className="flex-1 p-8 overflow-y-auto">

          {/* Section: Dashboard Overview */}
          {section === "dashboard" && (
            <div className="flex flex-col gap-8">
              
              {/* Statistic widgets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {label: "Jumlah Kegiatan", value: activities.length, icon: FileText, desc: "Total dokumentasi terbit"},
                  { label: "Kegiatan (7 Hari Terakhir)", value: last7DaysCount, icon: Clock, desc: "Dokumentasi baru minggu ini" },
                ].map(({ label, value, icon: Icon, desc }) => (
                  <div key={label} className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-sm flex items-start justify-between">
                    <div>
                      <span className="text-[11.5px] font-bold text-[#7A7065] uppercase tracking-wider">{label}</span>
                      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-2xl font-extrabold text-[#2C2C2A] mt-2 mb-1">
                        {value}
                      </div>
                      <span className="text-[12px] text-[#B8AFA3]">{desc}</span>
                    </div>
                    <span className="w-10 h-10 rounded-lg bg-[#3A6520]/8 text-[#3A6520] flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" strokeWidth={1.75} />
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSection("add-doc")}
                  className="flex items-center gap-2 px-5 py-3 bg-[#3A6520] hover:bg-[#2D5016] text-white text-[12.5px] font-semibold rounded-xl shadow-sm transition"
                >
                  <Plus className="w-4 h-4" />
                  Buat Kegiatan Baru
                </button>
                <button
                  onClick={() => setSection("settings")}
                  className="flex items-center gap-2 px-5 py-3 border border-black/[0.09] text-[#5A5550] text-[12.5px] font-semibold rounded-xl hover:bg-[#FAF9F5] transition"
                >
                  <Settings className="w-4 h-4" />
                  Pengaturan Website
                </button>
              </div>

              {/* All Documents List */}
              <div className="bg-white border border-black/[0.06] rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-5 border-b border-black/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[15px] font-bold text-[#2C2C2A]">
                    Daftar Dokumentasi
                  </h3>
                  <div className="relative w-full sm:w-80">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="w-4 h-4 text-[#B8AFA3]" />
                    </span>
                    <input
                      type="text"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Cari dokumentasi..."
                      className="w-full pl-9 pr-4 py-2 bg-[#FAF9F5] border border-black/[0.08] rounded-lg text-[13px] text-[#2C2C2A] placeholder:text-[#B8AFA3] outline-none focus:ring-1 focus:ring-[#3A6520]/25 transition"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#FAF9F5] border-b border-black/[0.06] text-[11.5px] font-bold text-[#7A7065] uppercase tracking-wider">
                        <th className="py-4 px-6">Gambar</th>
                        <th className="py-4 px-6">Dokumentasi</th>
                        <th className="py-4 px-6 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/[0.05]">
                      {filteredDocs.map((doc, idx) => (
                        <tr key={doc.id || idx} className="hover:bg-black/[0.01] transition-colors text-[13px] text-[#2C2C2A]">
                          <td className="py-4 px-6 shrink-0">
                            <img src={doc.image_url} alt="" className="w-14 h-11 object-cover bg-[#D4C9B5] rounded" />
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-bold text-[#2C2C2A] block mb-0.5">{doc.title}</span>
                            <span className="text-[12px] text-[#7A7065] block max-w-md md:max-w-xl truncate">{doc.description}</span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => handleEditClick(doc)} className="p-2 border border-black/[0.08] hover:bg-[#FAF9F5] rounded text-[#7A7065] hover:text-[#2C2C2A] transition" title="Ubah">
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button onClick={() => setDeleteId(doc.id)} className="p-2 border border-black/[0.08] hover:bg-red-50 rounded text-red-500 hover:text-red-700 transition" title="Hapus">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredDocs.length === 0 && (
                        <tr>
                          <td colSpan={3} className="text-center py-12 text-[#7A7065]">
                            Tidak ada dokumentasi kegiatan ditemukan.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* Section: Manage activities list */}
          {section === "docs" && (
            <div className="bg-white border border-black/[0.06] rounded-xl shadow-sm overflow-hidden flex flex-col">
              
              {/* Toolbar */}
              <div className="p-5 border-b border-black/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-[#B8AFA3]" />
                  </span>
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Cari dokumentasi..."
                    className="w-full pl-9 pr-4 py-2 bg-[#FAF9F5] border border-black/[0.08] rounded-lg text-[13px] text-[#2C2C2A] placeholder:text-[#B8AFA3] outline-none focus:ring-1 focus:ring-[#3A6520]/25 transition"
                  />
                </div>

                <button onClick={() => setSection("add-doc")} className="flex items-center gap-1.5 px-4 py-2 bg-[#3A6520] hover:bg-[#2D5016] text-white text-[12.5px] font-semibold rounded-full shadow-sm transition">
                  <Plus className="w-4 h-4" />
                  Tambah Dokumentasi
                </button>
              </div>

              {/* Table list */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FAF9F5] border-b border-black/[0.06] text-[11.5px] font-bold text-[#7A7065] uppercase tracking-wider">
                      <th className="py-4 px-6">Gambar</th>
                      <th className="py-4 px-6">Dokumentasi</th>
                      <th className="py-4 px-6 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/[0.05]">
                    {filteredDocs.map((doc, idx) => (
                      <tr key={doc.id || idx} className="hover:bg-black/[0.01] transition-colors text-[13px] text-[#2C2C2A]">
                        <td className="py-4 px-6 shrink-0">
                          <img src={doc.image_url} alt="" className="w-14 h-11 object-cover bg-[#D4C9B5] rounded" />
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-bold text-[#2C2C2A] block mb-0.5">{doc.title}</span>
                          <span className="text-[12px] text-[#7A7065] block max-w-md md:max-w-xl truncate">{doc.description}</span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleEditClick(doc)} className="p-2 border border-black/[0.08] hover:bg-[#FAF9F5] rounded text-[#7A7065] hover:text-[#2C2C2A] transition" title="Ubah">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => setDeleteId(doc.id)} className="p-2 border border-black/[0.08] hover:bg-red-50 rounded text-red-500 hover:text-red-700 transition" title="Hapus">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredDocs.length === 0 && (
                      <tr>
                        <td colSpan={3} className="text-center py-12 text-[#7A7065]">
                          Tidak ada dokumentasi kegiatan ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* Section: Add/Edit documentation */}
          {section === "add-doc" && (
            <div className="bg-white border border-black/[0.06] rounded-xl shadow-sm p-8 max-w-3xl">
              
              {/* Back button */}
              <button onClick={() => { setSection("docs"); setEditingDocId(null); }} className="flex items-center gap-1 text-[#7A7065] hover:text-[#2C2C2A] text-[12.5px] font-semibold mb-6 transition">
                <ChevronLeft className="w-4 h-4" />
                Kembali ke Daftar
              </button>

              <form onSubmit={handleSaveDoc} className="space-y-6">
                <div>
                  <label className="block text-[13px] font-semibold text-[#2C2C2A] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Judul Dokumentasi
                  </label>
                  <input
                    type="text"
                    required
                    value={titleInput}
                    onChange={e => setTitleInput(e.target.value)}
                    placeholder="Masukkan judul kegiatan"
                    className="w-full px-4 py-3 bg-[#FAF9F5] border border-black/[0.08] rounded-lg text-[13px] text-[#2C2C2A] placeholder:text-[#B8AFA3] outline-none focus:ring-1 focus:ring-[#3A6520]/25 transition"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#2C2C2A] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Deskripsi Singkat
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={descInput}
                    onChange={e => setDescInput(e.target.value)}
                    placeholder="Tulis ringkasan singkat kegiatan..."
                    className="w-full px-4 py-3 bg-[#FAF9F5] border border-black/[0.08] rounded-lg text-[13px] text-[#2C2C2A] placeholder:text-[#B8AFA3] outline-none focus:ring-1 focus:ring-[#3A6520]/25 transition resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#2C2C2A] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Gambar Dokumentasi
                  </label>
                  
                  {/* File input (hidden) */}
                  <input type="file" ref={fileRef} accept="image/*" className="hidden" onChange={e => handleFileChange(e, "doc")} />

                  {/* Uploader Box */}
                  <div
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onClick={() => handleFileUploadClick(fileRef)}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                      dragOver
                        ? "border-[#3A6520] bg-[#3A6520]/5"
                        : "border-black/[0.09] bg-[#FAF9F5] hover:border-black/20"
                    }`}
                  >
                    {uploadedFile ? (
                      <div className="flex flex-col items-center gap-4 w-full">
                        <img src={uploadedFile} alt="Unggahan dokumentasi" className="max-h-60 max-w-full object-contain rounded bg-white shadow-sm border border-black/[0.05]" />
                        <span className="text-[12px] text-[#3A6520] font-semibold">Klik atau seret gambar lain untuk mengganti</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-[#B8AFA3] mb-3" strokeWidth={1.5} />
                        <span className="text-[13px] font-bold text-[#2C2C2A] block mb-1">Pilih File Gambar</span>
                        <span className="text-[11.5px] text-[#7A7065]">Seret & lepas berkas di sini, atau klik untuk merambah folder</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <button type="submit" disabled={submittingDoc} className="px-6 py-2.5 bg-[#3A6520] hover:bg-[#2D5016] text-white text-[12.5px] font-semibold rounded-full shadow transition disabled:opacity-50">
                    {submittingDoc ? "Menyimpan..." : (editingDocId ? "Simpan Perubahan" : "Upload Dokumentasi")}
                  </button>
                  <button type="button" onClick={() => { setSection("docs"); setEditingDocId(null); }} className="px-6 py-2.5 border border-black/[0.09] text-[#5A5550] text-[12.5px] font-medium rounded-full hover:bg-[#FAF9F5] transition">
                    Batal
                  </button>
                </div>

              </form>

            </div>
          )}

          {/* Section: Website configuration */}
          {section === "settings" && (
            <div className="max-w-6xl flex flex-col gap-6">
              
              {/* Cards Grid: Side-by-side on large screens, stacked on small screens */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                
                {/* Card 1: Informasi Umum */}
                <div className="bg-white border border-black/[0.06] rounded-xl shadow-sm p-8 flex flex-col gap-6">
                  
                  {/* Header */}
                  <div className="flex items-center gap-3 border-l-4 border-[#3A6520] pl-3.5">
                    <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[15px] font-extrabold text-[#2C2C2A]">
                      Informasi Umum
                    </h2>
                  </div>

                  {/* Form Fields */}
                  <div className="flex flex-col gap-5 mt-2">
                    
                    {/* Nama Dusun */}
                    <div>
                      <label className="block text-[13px] font-semibold text-[#5A5550] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        Nama Dusun
                      </label>
                      <input 
                        type="text" 
                        value={villageNameInput} 
                        onChange={e => setVillageNameInput(e.target.value)} 
                        placeholder="Nama Dusun" 
                        className="w-full px-4 py-3 bg-[#FAF9F5] border border-black/[0.08] rounded-lg text-[13px] text-[#2C2C2A] outline-none focus:ring-1 focus:ring-[#3A6520]/30 transition" 
                      />
                    </div>

                    {/* Logo & Hero upload side by side */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
                      
                      {/* Logo */}
                      <div>
                        <label className="block text-[13px] font-semibold text-[#5A5550] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          Logo Dusun
                        </label>
                        <div 
                          onDragOver={onLogoDragOver}
                          onDragLeave={onLogoDragLeave}
                          onDrop={onLogoDrop}
                          onClick={() => handleFileUploadClick(logoFileRef)}
                          className={`h-36 rounded-xl border-2 transition-all flex items-center justify-center overflow-hidden cursor-pointer relative ${
                            logoDragOver 
                              ? "border-[#3A6520] bg-[#3A6520]/5 border-dashed" 
                              : "border-black/[0.08] bg-[#FAF9F5] hover:border-black/20 border-dashed"
                          }`}
                        >
                          {logoUrlInput ? (
                            <div className="relative w-full h-full group">
                              <img src={logoUrlInput} alt="Logo" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-medium">
                                Klik untuk mengganti
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setLogoUrlInput("");
                                }}
                                className="w-6 h-6 rounded-full bg-white border border-black/[0.1] text-[#5A5550] hover:text-red-600 flex items-center justify-center absolute top-2.5 right-2.5 transition z-10 cursor-pointer shadow-sm"
                                title="Hapus Logo"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center p-5 text-center gap-1">
                              <ImageIcon className="w-6 h-6 text-[#B8AFA3] mb-1.5" />
                              <span className="text-[11px] text-[#7A7065] leading-relaxed">PNG atau SVG · Maks 2 MB</span>
                              <span className="text-[#3A6520] font-bold text-[12.5px] hover:underline mt-1">Pilih file</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Hero Banner */}
                      <div>
                        <label className="block text-[13px] font-semibold text-[#5A5550] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          Foto Hero Halaman Utama
                        </label>
                        <div 
                          onDragOver={onHeroDragOver}
                          onDragLeave={onHeroDragLeave}
                          onDrop={onHeroDrop}
                          onClick={() => handleFileUploadClick(heroFileRef)}
                          className={`h-36 rounded-xl border-2 transition-all flex items-center justify-center overflow-hidden cursor-pointer relative ${
                            heroDragOver 
                              ? "border-[#3A6520] bg-[#3A6520]/5 border-dashed" 
                              : "border-black/[0.08] bg-[#FAF9F5] hover:border-black/20 border-dashed"
                          }`}
                        >
                          {heroImageUrlInput ? (
                            <div className="relative w-full h-full group">
                              <img src={heroImageUrlInput} alt="Hero Banner" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-medium">
                                Klik untuk mengganti
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setHeroImageUrlInput("");
                                }}
                                className="w-6 h-6 rounded-full bg-white border border-black/[0.1] text-[#5A5550] hover:text-red-600 flex items-center justify-center absolute top-2.5 right-2.5 transition z-10 cursor-pointer shadow-sm"
                                title="Hapus Banner"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center p-5 text-center gap-1">
                              <ImageIcon className="w-6 h-6 text-[#B8AFA3] mb-1.5" />
                              <span className="text-[11px] text-[#7A7065] leading-relaxed">JPG atau WEBP · Min 1920×1080</span>
                              <span className="text-[#3A6520] font-bold text-[12.5px] hover:underline mt-1">Pilih file</span>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>

                  </div>

                </div>

                {/* Card 2: Kontak & Media Sosial */}
                <div className="bg-white border border-black/[0.06] rounded-xl shadow-sm p-8 flex flex-col gap-6">
                  
                  {/* Header */}
                  <div className="flex items-center gap-3 border-l-4 border-[#3A6520] pl-3.5">
                    <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[15px] font-extrabold text-[#2C2C2A]">
                      Kontak & Media Sosial
                    </h2>
                  </div>

                  {/* Form Fields */}
                  <div className="flex flex-col gap-5 mt-2">
                    
                    {/* WhatsApp */}
                    <div>
                      <label className="block text-[13px] font-semibold text-[#5A5550] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        Nomor WhatsApp
                      </label>
                      <input 
                        type="tel" 
                        value={phoneNumberInput} 
                        onChange={e => setPhoneNumberInput(e.target.value)} 
                        placeholder="+62 851 3809 7972" 
                        className="w-full px-4 py-3 bg-[#FAF9F5] border border-black/[0.08] rounded-lg text-[13px] text-[#2C2C2A] outline-none focus:ring-1 focus:ring-[#3A6520]/30 transition" 
                      />
                    </div>

                    {/* Instagram */}
                    <div>
                      <label className="block text-[13px] font-semibold text-[#5A5550] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        Instagram (opsional)
                      </label>
                      <input 
                        type="text" 
                        value={instagramUrlInput} 
                        onChange={e => setInstagramUrlInput(e.target.value)} 
                        placeholder="https://instagram.com/dusunpetung" 
                        className="w-full px-4 py-3 bg-[#FAF9F5] border border-black/[0.08] rounded-lg text-[13px] text-[#2C2C2A] outline-none focus:ring-1 focus:ring-[#3A6520]/30 transition" 
                      />
                    </div>

                    {/* TikTok */}
                    <div>
                      <label className="block text-[13px] font-semibold text-[#5A5550] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        TikTok (opsional)
                      </label>
                      <input 
                        type="text" 
                        value={tiktokUrlInput} 
                        onChange={e => setTiktokUrlInput(e.target.value)} 
                        placeholder="https://tiktok.com/@dusunpetung" 
                        className="w-full px-4 py-3 bg-[#FAF9F5] border border-black/[0.08] rounded-lg text-[13px] text-[#2C2C2A] outline-none focus:ring-1 focus:ring-[#3A6520]/30 transition" 
                      />
                    </div>

                  </div>

                </div>

              </div>

              {/* Save/Reset panel */}
              <div className="flex items-center gap-3 bg-white border border-black/[0.06] rounded-xl shadow-sm p-6">
                <button 
                  onClick={handleSaveSettings} 
                  disabled={savingSettings} 
                  className="px-6 py-2.5 bg-[#3A6520] hover:bg-[#2D5016] text-white text-[13px] font-semibold rounded-full shadow-sm transition disabled:opacity-50 cursor-pointer"
                >
                  {savingSettings ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (settings) {
                      setVillageNameInput(settings.village_name || "");
                      setLogoUrlInput(settings.logo_url || "");
                      setHeroImageUrlInput(settings.hero_image_url || "");
                      setPhoneNumberInput(settings.phone_number || "");
                      setInstagramUrlInput(settings.instagram_url || "");
                      setTiktokUrlInput(settings.tiktok_url || "");
                    }
                  }}
                  className="px-6 py-2.5 border border-black/[0.12] text-[#5A5550] text-[13px] font-medium rounded-full hover:bg-[#FAF9F5] transition cursor-pointer"
                >
                  Reset
                </button>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* Delete confirmation modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl border border-black/[0.08] shadow-lg p-7 w-80 flex flex-col gap-5">
            <div>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[16px] font-bold text-[#2C2C2A] mb-1.5">Hapus Dokumentasi?</h3>
              <p className="text-[13px] text-[#7A7065] leading-relaxed">Tindakan ini tidak dapat dibatalkan. Dokumentasi akan dihapus permanen dari sistem.</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 bg-red-500 text-white text-[13px] font-semibold rounded-full hover:bg-red-600 transition-colors">
                Ya, Hapus
              </button>
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 border border-black/[0.12] text-[#5A5550] text-[13px] font-medium rounded-full hover:bg-[#F0EBE3] transition-colors">
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function PhoneInputIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
