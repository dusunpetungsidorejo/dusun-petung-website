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
  X,
  Home,
  Building2,
  Users,
  Eye,
  EyeOff,
  DollarSign,
  AlertCircle
} from "lucide-react";
import { Page, Activity, LiveInHouse } from "../types";
import { ToastContainer } from "../components/ToastContainer";

type AdminSection = "dashboard" | "docs" | "add-doc" | "settings" | "livein" | "add-livein";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  // Live In States
  const [liveinHouses, setLiveinHouses] = useState<LiveInHouse[]>([]);
  const [loadingLivein, setLoadingLivein] = useState(false);
  const [submittingLivein, setSubmittingLivein] = useState(false);
  const [editingLiveinId, setEditingLiveinId] = useState<number | null>(null);
  const [deleteLiveinId, setDeleteLiveinId] = useState<number | null>(null);
  const [liveinSearch, setLiveinSearch] = useState("");
  const [liveinFilterStatus, setLiveinFilterStatus] = useState<string>("all");

  // Live In Form States
  const [liveinName, setLiveinName] = useState("");
  const [liveinOwner, setLiveinOwner] = useState("");
  const [liveinCoverImage, setLiveinCoverImage] = useState("");
  const [liveinGallery, setLiveinGallery] = useState<string[]>([]);
  const [liveinDescription, setLiveinDescription] = useState("");
  const [liveinHighlight, setLiveinHighlight] = useState("");
  const [liveinOvernightActive, setLiveinOvernightActive] = useState(false);
  const [liveinOvernightPrice, setLiveinOvernightPrice] = useState("");
  const [liveinOvernightCheckin, setLiveinOvernightCheckin] = useState("");
  const [liveinOvernightCheckout, setLiveinOvernightCheckout] = useState("");
  const [liveinHour24Active, setLiveinHour24Active] = useState(false);
  const [liveinHour24Price, setLiveinHour24Price] = useState("");
  const [liveinHour24Description, setLiveinHour24Description] = useState("");
  const [liveinPricingType, setLiveinPricingType] = useState<'house' | 'person'>("house");
  const [liveinMinGuests, setLiveinMinGuests] = useState("");
  const [liveinMaxGuests, setLiveinMaxGuests] = useState("");
  
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [facilitiesOther, setFacilitiesOther] = useState("");
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([]);
  const [experiencesOther, setExperiencesOther] = useState("");
  const [liveinStatus, setLiveinStatus] = useState<'Available' | 'Unavailable' | 'Inactive'>("Available");

  const liveinCoverFileRef = useRef<HTMLInputElement>(null);
  const liveinGalleryFileRef = useRef<HTMLInputElement>(null);

  // Fetch settings effect
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

  // Fetch Live In Houses
  const fetchLiveinHouses = async () => {
    setLoadingLivein(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/livein`);
      if (res.ok) {
        const data = await res.json();
        setLiveinHouses(data);
      }
    } catch (err) {
      console.error("Failed to fetch Live In houses:", err);
    } finally {
      setLoadingLivein(false);
    }
  };

  useEffect(() => {
    fetchLiveinHouses();
  }, []);

  const sideNav = [
    { icon: LayoutDashboard, label: "Dashboard", key: "dashboard" as AdminSection },
    { icon: Home, label: "Live In", key: "livein" as AdminSection },
    { icon: FileText, label: "Dokumentasi", key: "docs" as AdminSection },
    { icon: Settings, label: "Pengaturan Website", key: "settings" as AdminSection },
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, target: "logo" | "hero" | "doc" | "livein-cover" | "livein-gallery") => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      if (target === "livein-gallery") {
        showToast(`Sedang mengunggah ${files.length} gambar galeri...`);
        const uploadedUrls: string[] = [];
        for (let i = 0; i < files.length; i++) {
          const url = await uploadMedia(files[i]);
          uploadedUrls.push(url);
        }
        setLiveinGallery(prev => [...prev, ...uploadedUrls]);
        showToast("Galeri berhasil diperbarui!");
        return;
      }

      const file = files[0];
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
      } else if (target === "livein-cover") {
        setLiveinCoverImage(fileUrl);
        showToast("Gambar cover Live In berhasil diunggah!");
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

  // Drag and drop handlers for documentation
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

  // Drag and drop for Settings Logo
  const onLogoDragOver = (e: React.DragEvent) => { e.preventDefault(); setLogoDragOver(true); };
  const onLogoDragLeave = () => { setLogoDragOver(false); };
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

  // Drag and drop for Settings Hero
  const onHeroDragOver = (e: React.DragEvent) => { e.preventDefault(); setHeroDragOver(true); };
  const onHeroDragLeave = () => { setHeroDragOver(false); };
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

  // Save Documentation
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
        res = await fetch(`${baseUrl}/activities/${editingDocId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
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

  const handleEditDocClick = (doc: any) => {
    setEditingDocId(doc.id);
    setTitleInput(doc.title);
    setDescInput(doc.description);
    setUploadedFile(doc.image_url);
    setSection("add-doc");
  };

  const handleDeleteDoc = async (id: number) => {
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

  // Save Live In House
  const handleSaveLivein = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveinName.trim() || !liveinOwner.trim()) {
      showToast("Nama rumah dan pemilik wajib diisi", "error");
      return;
    }

    setSubmittingLivein(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const payload = {
        name: liveinName,
        owner: liveinOwner,
        cover_image: liveinCoverImage,
        gallery: liveinGallery,
        description: liveinDescription,
        highlight: liveinHighlight,
        overnight_active: liveinOvernightActive,
        overnight_price: liveinOvernightActive ? Number(liveinOvernightPrice) || 0 : null,
        overnight_checkin: liveinOvernightActive ? liveinOvernightCheckin : null,
        overnight_checkout: liveinOvernightActive ? liveinOvernightCheckout : null,
        hour24_active: liveinHour24Active,
        hour24_price: liveinHour24Active ? Number(liveinHour24Price) || 0 : null,
        hour24_description: liveinHour24Active ? liveinHour24Description : null,
        pricing_type: liveinPricingType,
        min_guests: Number(liveinMinGuests) || 1,
        max_guests: Number(liveinMaxGuests) || 10,
        facilities: selectedFacilities,
        facilities_other: selectedFacilities.includes("Others") ? facilitiesOther : null,
        experiences: selectedExperiences,
        experiences_other: selectedExperiences.includes("Others") ? experiencesOther : null,
        status: liveinStatus
      };

      let res;
      if (editingLiveinId) {
        res = await fetch(`${baseUrl}/livein/${editingLiveinId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`${baseUrl}/livein`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Gagal menyimpan Rumah Live In");
      }

      showToast(editingLiveinId ? "Rumah Live In berhasil diperbarui!" : "Rumah Live In berhasil ditambahkan!");
      fetchLiveinHouses();
      handleResetLiveinForm();
      setSection("livein");
    } catch (err: any) {
      showToast(err.message || "Gagal menyimpan Rumah Live In", "error");
    } finally {
      setSubmittingLivein(false);
    }
  };

  const handleEditLiveinClick = (house: LiveInHouse) => {
    setEditingLiveinId(house.id || null);
    setLiveinName(house.name);
    setLiveinOwner(house.owner);
    setLiveinCoverImage(house.cover_image || "");
    setLiveinGallery(house.gallery || []);
    setLiveinDescription(house.description || "");
    setLiveinHighlight(house.highlight || "");
    setLiveinOvernightActive(!!house.overnight_active);
    setLiveinOvernightPrice(house.overnight_price ? String(house.overnight_price) : "");
    setLiveinOvernightCheckin(house.overnight_checkin || "");
    setLiveinOvernightCheckout(house.overnight_checkout || "");
    setLiveinHour24Active(!!house.hour24_active);
    setLiveinHour24Price(house.hour24_price ? String(house.hour24_price) : "");
    setLiveinHour24Description(house.hour24_description || "");
    setLiveinPricingType(house.pricing_type || "house");
    setLiveinMinGuests(house.min_guests ? String(house.min_guests) : "");
    setLiveinMaxGuests(house.max_guests ? String(house.max_guests) : "");
    setSelectedFacilities(house.facilities || []);
    setFacilitiesOther(house.facilities_other || "");
    setSelectedExperiences(house.experiences || []);
    setExperiencesOther(house.experiences_other || "");
    setLiveinStatus(house.status || "Available");
    
    setSection("add-livein");
  };

  const handleDeleteLivein = async (id: number) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/livein/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Gagal menghapus Rumah Live In");
      }

      setLiveinHouses(prev => prev.filter(h => h.id !== id));
      showToast("Rumah Live In berhasil dihapus!");
      setDeleteLiveinId(null);
    } catch (err: any) {
      showToast(err.message || "Gagal menghapus Rumah Live In", "error");
    }
  };

  const handleResetLiveinForm = () => {
    setEditingLiveinId(null);
    setLiveinName("");
    setLiveinOwner("");
    setLiveinCoverImage("");
    setLiveinGallery([]);
    setLiveinDescription("");
    setLiveinHighlight("");
    setLiveinOvernightActive(false);
    setLiveinOvernightPrice("");
    setLiveinOvernightCheckin("");
    setLiveinOvernightCheckout("");
    setLiveinHour24Active(false);
    setLiveinHour24Price("");
    setLiveinHour24Description("");
    setLiveinPricingType("house");
    setLiveinMinGuests("");
    setLiveinMaxGuests("");
    setSelectedFacilities([]);
    setFacilitiesOther("");
    setSelectedExperiences([]);
    setExperiencesOther("");
    setLiveinStatus("Available");
  };

  const toggleFacility = (facility: string) => {
    setSelectedFacilities(prev => 
      prev.includes(facility) 
        ? prev.filter(f => f !== facility) 
        : [...prev, facility]
    );
  };

  const toggleExperience = (experience: string) => {
    setSelectedExperiences(prev => 
      prev.includes(experience) 
        ? prev.filter(e => e !== experience) 
        : [...prev, experience]
    );
  };

  const removeGalleryImage = (indexToRemove: number) => {
    setLiveinGallery(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Filters and searches
  const filteredDocs = (activities as any[]).filter((d: any) => 
    d?.title && (
      d.title.toLowerCase().includes(search.toLowerCase()) || 
      (d.description || "").toLowerCase().includes(search.toLowerCase())
    )
  );

  const filteredLivein = liveinHouses.filter(house => {
    const matchesSearch = 
      house.name.toLowerCase().includes(liveinSearch.toLowerCase()) ||
      house.owner.toLowerCase().includes(liveinSearch.toLowerCase()) ||
      (house.description || "").toLowerCase().includes(liveinSearch.toLowerCase());
    
    const matchesStatus = 
      liveinFilterStatus === "all" || 
      house.status.toLowerCase() === liveinFilterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const last7DaysCount = (activities as any[]).filter((doc: any) => {
    if (!doc?.title) return false;
    const dateStr = doc.uploaded_at || doc.date || doc.created_at;
    if (!dateStr) return false;
    const docDate = new Date(dateStr);
    const diffTime = new Date().getTime() - docDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 7;
  }).length;

  // Live in statistics
  const totalLiveinCount = liveinHouses.length;
  const availableLiveinCount = liveinHouses.filter(h => h.status === "Available").length;
  const unavailableLiveinCount = liveinHouses.filter(h => h.status === "Unavailable").length;
  const inactiveLiveinCount = liveinHouses.filter(h => h.status === "Inactive").length;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} className="min-h-screen bg-[#FAF9F5] flex w-full">
      {toast && <ToastContainer toast={toast} setToast={setToast} />}

      {/* Hidden inputs for uploads */}
      <input type="file" ref={logoFileRef} accept="image/*" className="hidden" onChange={e => handleFileChange(e, "logo")} />
      <input type="file" ref={heroFileRef} accept="image/*" className="hidden" onChange={e => handleFileChange(e, "hero")} />
      <input type="file" ref={liveinCoverFileRef} accept="image/*" className="hidden" onChange={e => handleFileChange(e, "livein-cover")} />
      <input type="file" ref={liveinGalleryFileRef} accept="image/*" multiple className="hidden" onChange={e => handleFileChange(e, "livein-gallery")} />

      {/* Backdrop overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-35 md:hidden transition-opacity" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-black/[0.06] bg-white flex flex-col justify-between shrink-0 h-screen transition-transform duration-300 transform md:sticky md:top-0 md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div>
          {/* Logo brand */}
          <div className="h-[73px] border-b border-black/[0.06] px-6 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
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
            <button 
              onClick={() => setIsSidebarOpen(false)} 
              className="p-1 text-[#7A7065] hover:text-[#2C2C2A] md:hidden"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 flex flex-col gap-1.5">
            {sideNav.map(({ icon: Icon, label, key }) => (
              <button
                key={key}
                onClick={() => {
                  setSection(key);
                  setIsSidebarOpen(false);
                  handleResetLiveinForm();
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-[13px] font-semibold transition-all ${
                  section === key || 
                  (key === "livein" && section === "add-livein") ||
                  (key === "docs" && section === "add-doc")
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
          <button 
            onClick={() => {
              setIsSidebarOpen(false);
              onLogout();
            }} 
            className="w-full flex items-center gap-3.5 px-4 py-3 text-[13px] font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <LogOut className="w-[18px] h-[18px]" strokeWidth={1.75} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#FAF9F5]">
        
        {/* Header bar */}
        <header className="h-[73px] border-b border-black/[0.06] bg-white px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="p-2 -ml-2 text-[#7A7065] hover:text-[#2C2C2A] md:hidden flex items-center justify-center"
              aria-label="Open menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[15px] sm:text-[17px] font-extrabold text-[#2C2C2A] truncate">
              {section === "dashboard" && "Dashboard Overview"}
              {section === "livein" && "Manajemen Live In"}
              {section === "add-livein" && (editingLiveinId ? "Ubah Rumah Live In" : "Tambah Rumah Live In Baru")}
              {section === "docs" && "Manajemen Dokumentasi"}
              {section === "add-doc" && (editingDocId ? "Ubah Dokumentasi" : "Tambah Dokumentasi Baru")}
              {section === "settings" && "Pengaturan Website"}
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button onClick={() => nav("home")} className="px-3 sm:px-4 py-1.5 sm:py-2 border border-black/[0.09] text-[11px] sm:text-[12px] font-semibold text-[#5A5550] rounded-full hover:bg-[#FAF9F5] transition">
              Lihat Website
            </button>
            <div className="w-px h-6 bg-black/8" />
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#3A6520]/8 flex items-center justify-center text-[#3A6520] font-bold text-[11px] sm:text-[12px]">
                AD
              </div>
              <span className="text-[11.5px] sm:text-[12.5px] font-semibold text-[#2C2C2A] hidden xs:inline">Administrator</span>
            </div>
          </div>
        </header>

        {/* Dashboard Panels */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full">

          {/* Section: Dashboard Overview */}
          {section === "dashboard" && (
            <div className="flex flex-col gap-8 w-full max-w-7xl">
              
              {/* Live In Statistics Row */}
              <div>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[13px] font-bold text-[#7A7065] uppercase tracking-wider mb-4">Statistik Live In</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {[
                    { label: "Total Rumah Live In", value: totalLiveinCount, icon: Home, desc: "Seluruh rumah terdaftar", color: "text-[#3A6520] bg-[#3A6520]/8" },
                    { label: "Tersedia (Available)", value: availableLiveinCount, icon: Check, desc: "Siap disewa pengunjung", color: "text-emerald-600 bg-emerald-50" },
                    { label: "Penuh (Unavailable)", value: unavailableLiveinCount, icon: X, desc: "Sedang tidak tersedia", color: "text-amber-600 bg-amber-50" },
                    { label: "Tidak Aktif (Inactive)", value: inactiveLiveinCount, icon: EyeOff, desc: "Disembunyikan dari publik", color: "text-gray-500 bg-gray-100" }
                  ].map(({ label, value, icon: Icon, desc, color }) => (
                    <div key={label} className="bg-white border border-black/[0.06] rounded-xl p-5 shadow-sm flex items-start justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-[#7A7065] uppercase tracking-wider">{label}</span>
                        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-2xl font-extrabold text-[#2C2C2A] mt-1.5 mb-0.5">
                          {value}
                        </div>
                        <span className="text-[11px] text-[#B8AFA3]">{desc}</span>
                      </div>
                      <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                        <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documentation Stats */}
              <div>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[13px] font-bold text-[#7A7065] uppercase tracking-wider mb-4">Statistik Kegiatan & Dokumentasi</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { label: "Jumlah Kegiatan", value: activities.length, icon: FileText, desc: "Total dokumentasi terbit", color: "text-[#3A6520] bg-[#3A6520]/8" },
                    { label: "Kegiatan (7 Hari Terakhir)", value: last7DaysCount, icon: Clock, desc: "Dokumentasi baru minggu ini", color: "text-[#3A6520] bg-[#3A6520]/8" },
                  ].map(({ label, value, icon: Icon, desc, color }) => (
                    <div key={label} className="bg-white border border-black/[0.06] rounded-xl p-5 shadow-sm flex items-start justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-[#7A7065] uppercase tracking-wider">{label}</span>
                        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-2xl font-extrabold text-[#2C2C2A] mt-1.5 mb-0.5">
                          {value}
                        </div>
                        <span className="text-[11px] text-[#B8AFA3]">{desc}</span>
                      </div>
                      <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                        <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[13px] font-bold text-[#7A7065] uppercase tracking-wider mb-4">Tindakan Cepat</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => { handleResetLiveinForm(); setSection("add-livein"); }}
                    className="flex items-center gap-2 px-5 py-3 bg-[#3A6520] hover:bg-[#2D5016] text-white text-[12.5px] font-semibold rounded-xl shadow-sm transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Rumah Live In Baru
                  </button>
                  <button
                    onClick={() => { setEditingDocId(null); setTitleInput(""); setDescInput(""); setUploadedFile(null); setSection("add-doc"); }}
                    className="flex items-center gap-2 px-5 py-3 bg-white border border-black/[0.09] hover:bg-[#FAF9F5] text-[#2C2C2A] text-[12.5px] font-semibold rounded-xl shadow-sm transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Buat Kegiatan Baru
                  </button>
                  <button
                    onClick={() => setSection("settings")}
                    className="flex items-center gap-2 px-5 py-3 bg-white border border-black/[0.09] hover:bg-[#FAF9F5] text-[#2C2C2A] text-[12.5px] font-semibold rounded-xl shadow-sm transition cursor-pointer"
                  >
                    <Settings className="w-4 h-4" />
                    Pengaturan Website
                  </button>
                </div>
              </div>

              {/* Recent Activity Side-by-Side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Recently Added Live In */}
                <div className="bg-white border border-black/[0.06] rounded-xl p-5 shadow-sm flex flex-col gap-4">
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[14px] font-bold text-[#2C2C2A]">
                    Rumah Live In Baru
                  </h3>
                  <div className="divide-y divide-black/[0.04]">
                    {liveinHouses.slice(0, 3).map((house, idx) => (
                      <div key={house.id || idx} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          {house.cover_image ? (
                            <img src={house.cover_image} alt="" className="w-10 h-10 object-cover rounded bg-[#FAF9F5] border border-black/[0.05]" />
                          ) : (
                            <span className="w-10 h-10 rounded bg-[#FAF9F5] border border-black/[0.05] flex items-center justify-center text-[#B8AFA3]">
                              <Home className="w-4 h-4" />
                            </span>
                          )}
                          <div>
                            <span className="text-[13px] font-bold text-[#2C2C2A] block">{house.name}</span>
                            <span className="text-[11.5px] text-[#7A7065] block">Pemilik: {house.owner}</span>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                          house.status === "Available" ? "bg-emerald-50 text-emerald-700" :
                          house.status === "Unavailable" ? "bg-amber-50 text-amber-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {house.status === "Available" ? "Tersedia" :
                           house.status === "Unavailable" ? "Penuh" : "Tidak Aktif"}
                        </span>
                      </div>
                    ))}
                    {liveinHouses.length === 0 && (
                      <p className="text-center py-6 text-[12.5px] text-[#7A7065]">Belum ada data Live In.</p>
                    )}
                  </div>
                </div>

                {/* Recently Added Activities */}
                <div className="bg-white border border-black/[0.06] rounded-xl p-5 shadow-sm flex flex-col gap-4">
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[14px] font-bold text-[#2C2C2A]">
                    Kegiatan Dokumentasi Terbaru
                  </h3>
                  <div className="divide-y divide-black/[0.04]">
                    {activities.slice(0, 3).map((act, idx) => (
                      <div key={act.id || idx} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          {act.image_url ? (
                            <img src={act.image_url} alt="" className="w-10 h-10 object-cover rounded bg-[#FAF9F5] border border-black/[0.05]" />
                          ) : (
                            <span className="w-10 h-10 rounded bg-[#FAF9F5] border border-black/[0.05] flex items-center justify-center text-[#B8AFA3]">
                              <FileText className="w-4 h-4" />
                            </span>
                          )}
                          <div>
                            <span className="text-[13px] font-bold text-[#2C2C2A] block truncate max-w-[200px]">{act.title}</span>
                            <span className="text-[11.5px] text-[#7A7065] block">{act.date || act.uploaded_at}</span>
                          </div>
                        </div>
                        <button onClick={() => handleEditDocClick(act)} className="p-1.5 border border-black/[0.08] hover:bg-[#FAF9F5] rounded text-[#7A7065] hover:text-[#2C2C2A]">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    {activities.length === 0 && (
                      <p className="text-center py-6 text-[12.5px] text-[#7A7065]">Belum ada data kegiatan.</p>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* Section: Live In List */}
          {section === "livein" && (
            <div className="bg-white border border-black/[0.06] rounded-xl shadow-sm overflow-hidden flex flex-col w-full max-w-7xl">
              
              {/* Toolbar */}
              <div className="p-5 border-b border-black/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                  
                  {/* Search */}
                  <div className="relative w-full sm:w-64">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="w-4 h-4 text-[#B8AFA3]" />
                    </span>
                    <input
                      type="text"
                      value={liveinSearch}
                      onChange={e => setLiveinSearch(e.target.value)}
                      placeholder="Cari nama rumah / pemilik..."
                      className="w-full pl-9 pr-4 py-2 bg-[#FAF9F5] border border-black/[0.08] rounded-lg text-[13px] text-[#2C2C2A] placeholder:text-[#B8AFA3] outline-none focus:ring-1 focus:ring-[#3A6520]/25 transition"
                    />
                  </div>

                  {/* Filter */}
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[#7A7065] shrink-0" />
                    <select
                      value={liveinFilterStatus}
                      onChange={e => setLiveinFilterStatus(e.target.value)}
                      className="px-3 py-2 bg-[#FAF9F5] border border-black/[0.08] rounded-lg text-[12.5px] text-[#5A5550] outline-none focus:ring-1 focus:ring-[#3A6520]/25"
                    >
                      <option value="all">Semua Status</option>
                      <option value="available">Tersedia</option>
                      <option value="unavailable">Penuh</option>
                      <option value="inactive">Tidak Aktif</option>
                    </select>
                  </div>

                </div>

                <button 
                  onClick={() => { handleResetLiveinForm(); setSection("add-livein"); }}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-[#3A6520] hover:bg-[#2D5016] text-white text-[12.5px] font-semibold rounded-full shadow-sm transition shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Rumah Live In
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-[#FAF9F5] border-b border-black/[0.06] text-[11px] font-bold text-[#7A7065] uppercase tracking-wider">
                      <th className="py-4 px-5">Foto</th>
                      <th className="py-4 px-5">Nama Rumah</th>
                      <th className="py-4 px-5">Pemilik</th>
                      <th className="py-4 px-5">Kapasitas</th>
                      <th className="py-4 px-5">Status</th>
                      <th className="py-4 px-5">Terakhir Update</th>
                      <th className="py-4 px-5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/[0.04]">
                    {filteredLivein.map((house, idx) => (
                      <tr key={house.id || idx} className="hover:bg-black/[0.01] transition-colors text-[13px] text-[#2C2C2A]">
                        <td className="py-4 px-5">
                          {house.cover_image ? (
                            <img src={house.cover_image} alt="" className="w-14 h-11 object-cover rounded border border-black/[0.05] bg-[#FAF9F5]" />
                          ) : (
                            <div className="w-14 h-11 rounded border border-black/[0.05] bg-[#FAF9F5] flex items-center justify-center text-[#B8AFA3]">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-5 font-bold text-[#2C2C2A]">{house.name}</td>
                        <td className="py-4 px-5 text-[#5A5550]">{house.owner}</td>
                        <td className="py-4 px-5 text-[#5A5550]">{house.min_guests || 1} - {house.max_guests || 10} Orang</td>
                        <td className="py-4 px-5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            house.status === "Available" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                            house.status === "Unavailable" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                            "bg-gray-100 text-gray-700 border border-gray-200"
                          }`}>
                            {house.status === "Available" ? "Tersedia" :
                             house.status === "Unavailable" ? "Penuh" : "Tidak Aktif"}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-[#7A7065]">{house.updated_at}</td>
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleEditLiveinClick(house)} className="p-2 border border-black/[0.08] hover:bg-[#FAF9F5] rounded text-[#7A7065] hover:text-[#2C2C2A] transition" title="Ubah">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => setDeleteLiveinId(house.id || null)} className="p-2 border border-black/[0.08] hover:bg-red-50 rounded text-red-500 hover:text-red-700 transition" title="Hapus">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredLivein.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-[#7A7065]">
                          Tidak ada rumah Live In ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* Section: Add/Edit Live In Form */}
          {section === "add-livein" && (
            <div className="bg-white border border-black/[0.06] rounded-xl shadow-sm p-5 sm:p-8 max-w-4xl w-full">
              
              {/* Back button */}
              <button 
                onClick={() => { setSection("livein"); handleResetLiveinForm(); }} 
                className="flex items-center gap-1 text-[#7A7065] hover:text-[#2C2C2A] text-[12.5px] font-semibold mb-8 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                Kembali ke Daftar Live In
              </button>

              <form onSubmit={handleSaveLivein} className="space-y-10">
                
                {/* 1. Basic Info Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-l-4 border-[#3A6520] pl-3">
                    <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[15px] font-bold text-[#2C2C2A]">
                      Informasi Dasar
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[12.5px] font-semibold text-[#5A5550] mb-2">Nama Rumah</label>
                      <input
                        type="text"
                        required
                        value={liveinName}
                        onChange={e => setLiveinName(e.target.value)}
                        placeholder="Contoh: Joglo Mbah Siswo"
                        className="w-full px-4 py-2.5 bg-[#FAF9F5] border border-black/[0.08] rounded-lg text-[13px] text-[#2C2C2A] placeholder:text-[#B8AFA3] outline-none focus:ring-1 focus:ring-[#3A6520]/25 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[12.5px] font-semibold text-[#5A5550] mb-2">Nama Pemilik</label>
                      <input
                        type="text"
                        required
                        value={liveinOwner}
                        onChange={e => setLiveinOwner(e.target.value)}
                        placeholder="Contoh: Siswosuharto"
                        className="w-full px-4 py-2.5 bg-[#FAF9F5] border border-black/[0.08] rounded-lg text-[13px] text-[#2C2C2A] placeholder:text-[#B8AFA3] outline-none focus:ring-1 focus:ring-[#3A6520]/25 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12.5px] font-semibold text-[#5A5550] mb-2">Deskripsi Singkat</label>
                    <textarea
                      required
                      rows={4}
                      value={liveinDescription}
                      onChange={e => setLiveinDescription(e.target.value)}
                      placeholder="Gambarkan suasana rumah, keramahtamahan pemilik, atau keunikan menginap di sini..."
                      className="w-full px-4 py-2.5 bg-[#FAF9F5] border border-black/[0.08] rounded-lg text-[13px] text-[#2C2C2A] placeholder:text-[#B8AFA3] outline-none focus:ring-1 focus:ring-[#3A6520]/25 transition resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[12.5px] font-semibold text-[#5A5550] mb-2">Highlight Keunikan (Opsional)</label>
                    <input
                      type="text"
                      value={liveinHighlight}
                      onChange={e => setLiveinHighlight(e.target.value)}
                      placeholder="Contoh: Dekat sungai alami, pemandangan langsung ke Merapi"
                      className="w-full px-4 py-2.5 bg-[#FAF9F5] border border-black/[0.08] rounded-lg text-[13px] text-[#2C2C2A] placeholder:text-[#B8AFA3] outline-none focus:ring-1 focus:ring-[#3A6520]/25 transition"
                    />
                  </div>

                  {/* Image uploads side-by-side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    
                    {/* Cover image uploader */}
                    <div>
                      <label className="block text-[12.5px] font-semibold text-[#5A5550] mb-2">Foto Cover Utama</label>
                      <div 
                        onClick={() => handleFileUploadClick(liveinCoverFileRef)}
                        className="border-2 border-dashed border-black/[0.09] bg-[#FAF9F5] hover:border-black/20 rounded-xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center h-44"
                      >
                        {liveinCoverImage ? (
                          <div className="relative w-full h-full">
                            <img src={liveinCoverImage} alt="" className="w-full h-full object-cover rounded" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center text-white text-[11px] font-medium rounded">
                              Klik untuk mengganti gambar
                            </div>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-[#B8AFA3] mb-2" />
                            <span className="text-[12px] font-bold text-[#2C2C2A] block">Unggah Gambar Cover</span>
                            <span className="text-[11px] text-[#7A7065] mt-1">Satu gambar resolusi tinggi landscape</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Gallery uploader */}
                    <div>
                      <label className="block text-[12.5px] font-semibold text-[#5A5550] mb-2">Galeri Foto Rumah</label>
                      <div 
                        onClick={() => handleFileUploadClick(liveinGalleryFileRef)}
                        className="border-2 border-dashed border-black/[0.09] bg-[#FAF9F5] hover:border-black/20 rounded-xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center h-44"
                      >
                        <Upload className="w-6 h-6 text-[#B8AFA3] mb-2" />
                        <span className="text-[12px] font-bold text-[#2C2C2A] block">Unggah Galeri Foto</span>
                        <span className="text-[11px] text-[#7A7065] mt-1">Pilih satu atau beberapa gambar suasana dalam rumah</span>
                      </div>
                    </div>

                  </div>

                  {/* Gallery thumbnails rendering */}
                  {liveinGallery.length > 0 && (
                    <div className="pt-2">
                      <span className="block text-[12px] font-semibold text-[#7A7065] mb-2">Foto Galeri Terunggah ({liveinGallery.length}):</span>
                      <div className="flex flex-wrap gap-3">
                        {liveinGallery.map((url, idx) => (
                          <div key={idx} className="relative w-20 h-16 group border border-black/[0.08] rounded overflow-hidden shadow-sm">
                            <img src={url} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(idx)}
                              className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                              title="Hapus"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                {/* 2. Package Section */}
                <div className="space-y-6 pt-4 border-t border-black/[0.06]">
                  <div className="flex items-center gap-3 border-l-4 border-[#3A6520] pl-3">
                    <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[15px] font-bold text-[#2C2C2A]">
                      Paket Live In
                    </h3>
                  </div>

                  <div className="space-y-6">
                    {/* Overnight Package */}
                    <div className="bg-[#FAF9F5] p-5 border border-black/[0.06] rounded-xl space-y-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={liveinOvernightActive}
                          onChange={e => setLiveinOvernightActive(e.target.checked)}
                          className="w-4 h-4 rounded text-[#3A6520] border-black/[0.12] focus:ring-[#3A6520]/20"
                        />
                        <span className="text-[13px] font-bold text-[#2C2C2A]">Paket Menginap (Overnight)</span>
                      </label>

                      {liveinOvernightActive && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                          <div>
                            <label className="block text-[11.5px] font-semibold text-[#5A5550] mb-1.5">Harga per malam (Rp)</label>
                            <input
                              type="number"
                              value={liveinOvernightPrice}
                              onChange={e => setLiveinOvernightPrice(e.target.value)}
                              placeholder="150000"
                              className="w-full px-3 py-2 bg-white border border-black/[0.08] rounded-lg text-[13px] outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[11.5px] font-semibold text-[#5A5550] mb-1.5">Waktu Check-in</label>
                            <input
                              type="text"
                              value={liveinOvernightCheckin}
                              onChange={e => setLiveinOvernightCheckin(e.target.value)}
                              placeholder="14:00 WIB"
                              className="w-full px-3 py-2 bg-white border border-black/[0.08] rounded-lg text-[13px] outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[11.5px] font-semibold text-[#5A5550] mb-1.5">Waktu Check-out</label>
                            <input
                              type="text"
                              value={liveinOvernightCheckout}
                              onChange={e => setLiveinOvernightCheckout(e.target.value)}
                              placeholder="12:00 WIB"
                              className="w-full px-3 py-2 bg-white border border-black/[0.08] rounded-lg text-[13px] outline-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 24 Hour Package */}
                    <div className="bg-[#FAF9F5] p-5 border border-black/[0.06] rounded-xl space-y-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={liveinHour24Active}
                          onChange={e => setLiveinHour24Active(e.target.checked)}
                          className="w-4 h-4 rounded text-[#3A6520] border-black/[0.12] focus:ring-[#3A6520]/20"
                        />
                        <span className="text-[13px] font-bold text-[#2C2C2A]">Paket 24 Jam (Menginap + Aktivitas)</span>
                      </label>

                      {liveinHour24Active && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                          <div>
                            <label className="block text-[11.5px] font-semibold text-[#5A5550] mb-1.5">Harga paket (Rp)</label>
                            <input
                              type="number"
                              value={liveinHour24Price}
                              onChange={e => setLiveinHour24Price(e.target.value)}
                              placeholder="250000"
                              className="w-full px-3 py-2 bg-white border border-black/[0.08] rounded-lg text-[13px] outline-none"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-[11.5px] font-semibold text-[#5A5550] mb-1.5">Deskripsi Paket</label>
                            <input
                              type="text"
                              value={liveinHour24Description}
                              onChange={e => setLiveinHour24Description(e.target.value)}
                              placeholder="Contoh: Menginap 1 malam + Makan 3x + Aktivitas Bertani"
                              className="w-full px-3 py-2 bg-white border border-black/[0.08] rounded-lg text-[13px] outline-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Pricing & Capacity Section */}
                <div className="space-y-6 pt-4 border-t border-black/[0.06]">
                  <div className="flex items-center gap-3 border-l-4 border-[#3A6520] pl-3">
                    <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[15px] font-bold text-[#2C2C2A]">
                      Metode Penentuan Harga & Kapasitas
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Pricing Type */}
                    <div>
                      <span className="block text-[12.5px] font-semibold text-[#5A5550] mb-3">Tipe Perhitungan Biaya</span>
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="radio"
                            name="pricing_type"
                            checked={liveinPricingType === "house"}
                            onChange={() => setLiveinPricingType("house")}
                            className="w-4 h-4 text-[#3A6520] focus:ring-[#3A6520]/20 border-black/10"
                          />
                          <span className="text-[13px] text-[#2C2C2A]">Per Rumah</span>
                        </label>
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="radio"
                            name="pricing_type"
                            checked={liveinPricingType === "person"}
                            onChange={() => setLiveinPricingType("person")}
                            className="w-4 h-4 text-[#3A6520] focus:ring-[#3A6520]/20 border-black/10"
                          />
                          <span className="text-[13px] text-[#2C2C2A]">Per Orang / Tamu</span>
                        </label>
                      </div>
                    </div>

                    {/* Guests Capacity */}
                    <div>
                      <span className="block text-[12.5px] font-semibold text-[#5A5550] mb-3">Kapasitas Tamu</span>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] text-[#7A7065] mb-1">Minimal (Orang)</label>
                          <input
                            type="number"
                            value={liveinMinGuests}
                            onChange={e => setLiveinMinGuests(e.target.value)}
                            placeholder="1"
                            className="w-full px-3 py-2 bg-[#FAF9F5] border border-black/[0.08] rounded-lg text-[13px] outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-[#7A7065] mb-1">Maksimal (Orang)</label>
                          <input
                            type="number"
                            value={liveinMaxGuests}
                            onChange={e => setLiveinMaxGuests(e.target.value)}
                            placeholder="8"
                            className="w-full px-3 py-2 bg-[#FAF9F5] border border-black/[0.08] rounded-lg text-[13px] outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Facilities Checkboxes */}
                <div className="space-y-6 pt-4 border-t border-black/[0.06]">
                  <div className="flex items-center gap-3 border-l-4 border-[#3A6520] pl-3">
                    <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[15px] font-bold text-[#2C2C2A]">
                      Fasilitas Rumah
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {[
                      "Kamar Tidur", "Kamar Mandi", "Dapur", "Welcome Drink",
                      "Sarapan", "WiFi", "Air Panas", "Area Parkir",
                      "Mushola", "Alat Mandi", "Handuk", "Others"
                    ].map(facility => (
                      <label key={facility} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFacilities.includes(facility)}
                          onChange={() => toggleFacility(facility)}
                          className="w-4 h-4 rounded text-[#3A6520] border-black/[0.12] focus:ring-[#3A6520]/20"
                        />
                        <span className="text-[12.5px] text-[#2C2C2A]">{facility === "Others" ? "Lainnya" : facility}</span>
                      </label>
                    ))}
                  </div>

                  {selectedFacilities.includes("Others") && (
                    <div className="pt-2">
                      <label className="block text-[11.5px] font-semibold text-[#5A5550] mb-1.5">Fasilitas Lainnya (pisahkan dengan koma)</label>
                      <input
                        type="text"
                        value={facilitiesOther}
                        onChange={e => setFacilitiesOther(e.target.value)}
                        placeholder="Contoh: Kipas Angin, TV, Mesin Cuci"
                        className="w-full px-4 py-2.5 bg-[#FAF9F5] border border-black/[0.08] rounded-lg text-[13px] outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* 5. Experience Checkboxes */}
                <div className="space-y-6 pt-4 border-t border-black/[0.06]">
                  <div className="flex items-center gap-3 border-l-4 border-[#3A6520] pl-3">
                    <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[15px] font-bold text-[#2C2C2A]">
                      Pengalaman & Aktivitas Dusun
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {[
                      "Farming", "Gardening", "Cooking Traditional Food", "Livestock Activities",
                      "Village Activities", "Trekking", "Sunrise Experience", "Harvesting", "Others"
                    ].map(exp => (
                      <label key={exp} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedExperiences.includes(exp)}
                          onChange={() => toggleExperience(exp)}
                          className="w-4 h-4 rounded text-[#3A6520] border-black/[0.12] focus:ring-[#3A6520]/20"
                        />
                        <span className="text-[12.5px] text-[#2C2C2A]">{exp === "Others" ? "Lainnya" : exp}</span>
                      </label>
                    ))}
                  </div>

                  {selectedExperiences.includes("Others") && (
                    <div className="pt-2">
                      <label className="block text-[11.5px] font-semibold text-[#5A5550] mb-1.5">Aktivitas Lainnya (pisahkan dengan koma)</label>
                      <input
                        type="text"
                        value={experiencesOther}
                        onChange={e => setExperiencesOther(e.target.value)}
                        placeholder="Contoh: Membuat Gerabah, Membatik"
                        className="w-full px-4 py-2.5 bg-[#FAF9F5] border border-black/[0.08] rounded-lg text-[13px] outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* 6. Status Section */}
                <div className="space-y-6 pt-4 border-t border-black/[0.06]">
                  <div className="flex items-center gap-3 border-l-4 border-[#3A6520] pl-3">
                    <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[15px] font-bold text-[#2C2C2A]">
                      Status Publikasi
                    </h3>
                  </div>

                  <div className="flex items-center gap-6">
                    {[
                      { value: "Available", label: "Tersedia (Available)" },
                      { value: "Unavailable", label: "Penuh (Unavailable)" },
                      { value: "Inactive", label: "Tidak Aktif (Inactive)" }
                    ].map(opt => (
                      <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="radio"
                          name="livein_status"
                          checked={liveinStatus === opt.value}
                          onChange={() => setLiveinStatus(opt.value as any)}
                          className="w-4 h-4 text-[#3A6520] focus:ring-[#3A6520]/20 border-black/10"
                        />
                        <span className="text-[13px] text-[#2C2C2A]">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Submit panel */}
                <div className="pt-8 border-t border-black/[0.06] flex items-center gap-3">
                  <button 
                    type="submit" 
                    disabled={submittingLivein} 
                    className="px-8 py-3 bg-[#3A6520] hover:bg-[#2D5016] text-white text-[12.5px] font-bold rounded-full shadow transition disabled:opacity-50 cursor-pointer"
                  >
                    {submittingLivein ? "Menyimpan..." : (editingLiveinId ? "Simpan Perubahan" : "Tambah Rumah Live In")}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setSection("livein"); handleResetLiveinForm(); }} 
                    className="px-8 py-3 border border-black/[0.09] text-[#5A5550] text-[12.5px] font-semibold rounded-full hover:bg-[#FAF9F5] transition cursor-pointer"
                  >
                    Batal
                  </button>
                </div>

              </form>

            </div>
          )}

          {/* Section: Manage activities list */}
          {section === "docs" && (
            <div className="bg-white border border-black/[0.06] rounded-xl shadow-sm overflow-hidden flex flex-col w-full max-w-7xl">
              
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
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FAF9F5] border-b border-black/[0.06] text-[11.5px] font-bold text-[#7A7065] uppercase tracking-wider">
                      <th className="py-4 px-4 sm:px-6">Gambar</th>
                      <th className="py-4 px-4 sm:px-6">Dokumentasi</th>
                      <th className="py-4 px-4 sm:px-6 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/[0.05]">
                    {filteredDocs.map((doc, idx) => (
                      <tr key={doc.id || idx} className="hover:bg-black/[0.01] transition-colors text-[13px] text-[#2C2C2A]">
                        <td className="py-4 px-4 sm:px-6 shrink-0">
                          <img src={doc.image_url} alt="" className="w-14 h-11 object-cover bg-[#D4C9B5] rounded shrink-0" />
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <span className="font-bold text-[#2C2C2A] block mb-0.5">{doc.title}</span>
                          <span className="text-[12px] text-[#7A7065] block max-w-[120px] xs:max-w-xs sm:max-w-md md:max-w-xl truncate">{doc.description}</span>
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleEditDocClick(doc)} className="p-2 border border-black/[0.08] hover:bg-[#FAF9F5] rounded text-[#7A7065] hover:text-[#2C2C2A] transition" title="Ubah">
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
            <div className="bg-white border border-black/[0.06] rounded-xl shadow-sm p-5 sm:p-8 max-w-3xl w-full">
              
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
            <div className="max-w-6xl flex flex-col gap-6 w-full">
              
              {/* Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                
                {/* Card 1: Informasi Umum */}
                <div className="bg-white border border-black/[0.06] rounded-xl shadow-sm p-5 sm:p-8 flex flex-col gap-6">
                  
                  <div className="flex items-center gap-3 border-l-4 border-[#3A6520] pl-3.5">
                    <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[15px] font-extrabold text-[#2C2C2A]">
                      Informasi Umum
                    </h2>
                  </div>

                  <div className="flex flex-col gap-5 mt-2">
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
                <div className="bg-white border border-black/[0.06] rounded-xl shadow-sm p-5 sm:p-8 flex flex-col gap-6">
                  
                  <div className="flex items-center gap-3 border-l-4 border-[#3A6520] pl-3.5">
                    <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[15px] font-extrabold text-[#2C2C2A]">
                      Kontak & Media Sosial
                    </h2>
                  </div>

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
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white border border-black/[0.06] rounded-xl shadow-sm p-5 sm:p-6">
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

      {/* Delete documentation modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-sm">
          <div className="bg-white rounded-xl border border-black/[0.08] shadow-lg p-7 w-80 flex flex-col gap-5">
            <div>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[16px] font-bold text-[#2C2C2A] mb-1.5">Hapus Dokumentasi?</h3>
              <p className="text-[13px] text-[#7A7065] leading-relaxed">Tindakan ini tidak dapat dibatalkan. Dokumentasi akan dihapus permanen dari sistem.</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => handleDeleteDoc(deleteId)} className="flex-1 py-2.5 bg-red-500 text-white text-[13px] font-semibold rounded-full hover:bg-red-600 transition-colors cursor-pointer">
                Ya, Hapus
              </button>
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 border border-black/[0.12] text-[#5A5550] text-[13px] font-medium rounded-full hover:bg-[#F0EBE3] transition-colors cursor-pointer">
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Live In modal */}
      {deleteLiveinId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-sm">
          <div className="bg-white rounded-xl border border-black/[0.08] shadow-lg p-7 w-80 flex flex-col gap-5">
            <div>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[16px] font-bold text-[#2C2C2A] mb-1.5">Hapus Rumah Live In?</h3>
              <p className="text-[13px] text-[#7A7065] leading-relaxed">Tindakan ini tidak dapat dibatalkan. Data rumah Live In akan dihapus secara permanen.</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => handleDeleteLivein(deleteLiveinId)} className="flex-1 py-2.5 bg-red-500 text-white text-[13px] font-semibold rounded-full hover:bg-red-600 transition-colors cursor-pointer">
                Ya, Hapus
              </button>
              <button onClick={() => setDeleteLiveinId(null)} className="flex-1 py-2.5 border border-black/[0.12] text-[#5A5550] text-[13px] font-medium rounded-full hover:bg-[#F0EBE3] transition-colors cursor-pointer">
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
