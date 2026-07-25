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
import { Page, Activity, LiveInHouse, LiveInPackage } from "../types";
import { ToastContainer } from "../components/ToastContainer";

type AdminSection = "dashboard" | "docs" | "add-doc" | "settings" | "livein" | "add-livein" | "add-livein-package";

const DEFAULT_PACKAGES: LiveInPackage[] = [
  {
    id: 1,
    name: "Paket Menginap Semalam (Overnight)",
    price: 150000,
    pricing_type: "per orang",
    description: "Paket menginap semalam (check-out pagi/siang berikutnya). Cocok untuk istirahat dan berburu sunrise di Gumuk Petung Camp.",
    facilities: [
      "Kamar tidur pribadi bersih",
      "Kamar mandi & air bersih",
      "Sprei & selimut hangat",
      "Teh jahe hangat / kopi",
      "Welcome snack lokal",
      "Area parkir kendaraan aman"
    ],
    icon: "sun",
    active: true
  },
  {
    id: 2,
    name: "Paket 24 Jam (Full Day)",
    price: 250000,
    pricing_type: "per orang",
    description: "Pengalaman 24 jam membaur dengan warga. Ikuti langsung aktivitas keseharian seperti bertani, berkebun, dan beternak.",
    facilities: [
      "Kamar tidur pribadi bersih",
      "Makan 3x sehari bersama warga",
      "Ikut aktivitas berkebun/ternak",
      "Air bersih pegunungan",
      "Welcome drink & jajanan lokal",
      "Area parkir kendaraan aman"
    ],
    icon: "clock",
    active: true
  }
];

interface AdminPageProps {
  nav: (p: Page) => void;
  onLogout: () => void;
  settings: any;
  onUpdateSettings: (newSettings: any) => void;
  activities: Activity[];
  onUpdateActivities: (newActivities: any[]) => void;
  token: string;
  showToast: (message: string, type?: "success" | "error") => void;
}

export function AdminPage({ 
  nav, 
  onLogout, 
  settings, 
  onUpdateSettings, 
  activities, 
  onUpdateActivities, 
  token,
  showToast
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [liveinSearch, setLiveinSearch] = useState("");
  const [liveinFilterStatus, setLiveinFilterStatus] = useState<string>("all");

  // Tab & Package States
  const [liveinTab, setLiveinTab] = useState<"homes" | "packages">("homes");
  const [liveinPackages, setLiveinPackages] = useState<LiveInPackage[]>(DEFAULT_PACKAGES);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [submittingPackage, setSubmittingPackage] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState<number | null>(null);
  const [deletePackageId, setDeletePackageId] = useState<number | null>(null);

  // Package Form States
  const [packageName, setPackageName] = useState("");
  const [packagePrice, setPackagePrice] = useState("");
  const [packagePricingType, setPackagePricingType] = useState("per orang");
  const [packageDescription, setPackageDescription] = useState("");
  const [packageFacilities, setPackageFacilities] = useState<string[]>([]);
  const [newFacilityInput, setNewFacilityInput] = useState("");
  const [packageIcon, setPackageIcon] = useState("clock");
  const [packageActive, setPackageActive] = useState(true);


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

  // Fetch Live In Packages
  const fetchLiveinPackages = async () => {
    setLoadingPackages(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/livein/packages`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setLiveinPackages(data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch Live In packages:", err);
    } finally {
      setLoadingPackages(false);
    }
  };

  useEffect(() => {
    fetchLiveinHouses();
    fetchLiveinPackages();
  }, []);


  const sideNav = [
    { icon: LayoutDashboard, label: "Dashboard", key: "dashboard" as AdminSection },
    { icon: Home, label: "Live In", key: "livein" as AdminSection },
    { icon: FileText, label: "Dokumentasi", key: "docs" as AdminSection },
    { icon: Settings, label: "Pengaturan Website", key: "settings" as AdminSection },
  ];

  const compressImage = (file: File, maxWidth = 1600, quality = 0.85): Promise<File> => {
    return new Promise((resolve) => {
      // Skip if not an image or is SVG
      if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
        return resolve(file);
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          // Resize only if wider than maxWidth
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            return resolve(file);
          }
          ctx.drawImage(img, 0, 0, width, height);

          // Force PNG/HEIC/etc. to JPEG for compression efficiency unless it is WEBP/GIF
          const outputType = (file.type === "image/png" || file.type === "image/heic" || file.type === "image/heif") ? "image/jpeg" : file.type;
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                return resolve(file);
              }
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + (outputType === "image/jpeg" ? ".jpg" : ""), {
                type: outputType,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            outputType,
            quality
          );
        };
        img.onload = img.onload;
        img.onerror = () => resolve(file);
      };
      reader.onerror = () => resolve(file);
    });
  };

  const uploadMedia = async (file: File): Promise<string> => {
    let fileToUpload = file;
    try {
      fileToUpload = await compressImage(file);
    } catch (e) {
      console.error("Gagal melakukan kompresi gambar, menggunakan file asli", e);
    }

    const formData = new FormData();
    formData.append("image", fileToUpload);

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
    if (!villageNameInput.trim()) {
      showToast("Nama dusun wajib diisi", "error");
      return;
    }
    const cleanPhone = phoneNumberInput.replace(/[^0-9+]/g, "");
    if (!cleanPhone || cleanPhone.length < 9) {
      showToast("Nomor telepon tidak valid (minimal 9 digit)", "error");
      return;
    }

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
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Gagal memperbarui pengaturan");
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
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || (editingDocId ? "Gagal mengubah dokumentasi" : "Gagal menambahkan dokumentasi"));
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
    setIsDeleting(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/activities/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Gagal menghapus dokumentasi");
      }

      onUpdateActivities(activities.filter(act => act.id !== id));
      showToast("Dokumentasi berhasil dihapus!");
      setDeleteId(null);
    } catch (err: any) {
      showToast(err.message || "Gagal menghapus dokumentasi", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Save Live In House (Homestay)
  const handleSaveLivein = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveinName.trim()) {
      showToast("Nama homestay wajib diisi", "error");
      return;
    }
    if (!liveinOwner.trim()) {
      showToast("Nama pemilik wajib diisi", "error");
      return;
    }
    if (!liveinCoverImage) {
      showToast("Foto homestay wajib diunggah", "error");
      return;
    }

    setSubmittingLivein(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const payload = {
        name: liveinName,
        owner: liveinOwner,
        cover_image: liveinCoverImage,
        gallery: [],
        description: "Homestay di Dusun Petung",
        highlight: "",
        overnight_active: true,
        overnight_price: 0,
        overnight_checkin: "",
        overnight_checkout: "",
        hour24_active: true,
        hour24_price: 0,
        hour24_description: "",
        pricing_type: "person",
        min_guests: 1,
        max_guests: 10,
        facilities: [],
        facilities_other: "",
        experiences: [],
        experiences_other: "",
        status: "Available"
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
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Gagal menyimpan Homestay");
      }

      showToast(editingLiveinId ? "Homestay berhasil diperbarui!" : "Homestay berhasil ditambahkan!");
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
    setIsDeleting(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/livein/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Gagal menghapus Rumah Live In");
      }

      setLiveinHouses(prev => prev.filter(h => h.id !== id));
      showToast("Rumah Live In berhasil dihapus!");
      setDeleteLiveinId(null);
    } catch (err: any) {
      showToast(err.message || "Gagal menghapus Rumah Live In", "error");
    } finally {
      setIsDeleting(false);
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

  // Save Live In Package
  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!packageName.trim()) {
      showToast("Nama paket wajib diisi", "error");
      return;
    }
    const priceVal = Number(packagePrice);
    if (!packagePrice || isNaN(priceVal) || priceVal < 0) {
      showToast("Harga paket harus berupa angka positif", "error");
      return;
    }

    setSubmittingPackage(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const payload = {
        name: packageName,
        price: priceVal,
        pricing_type: packagePricingType,
        description: packageDescription,
        facilities: packageFacilities,
        icon: packageIcon,
        active: packageActive
      };

      let res;
      if (editingPackageId) {
        res = await fetch(`${baseUrl}/livein/packages/${editingPackageId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`${baseUrl}/livein/packages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Gagal menyimpan Paket");
      }

      showToast(editingPackageId ? "Paket berhasil diperbarui!" : "Paket berhasil ditambahkan!");
      fetchLiveinPackages();
      handleResetPackageForm();
      setSection("livein");
      setLiveinTab("packages");
    } catch (err: any) {
      showToast(err.message || "Gagal menyimpan Paket", "error");
    } finally {
      setSubmittingPackage(false);
    }
  };

  const handleEditPackageClick = (pkg: LiveInPackage) => {
    setEditingPackageId(pkg.id || null);
    setPackageName(pkg.name);
    setPackagePrice(String(pkg.price));
    setPackagePricingType(pkg.pricing_type);
    setPackageDescription(pkg.description || "");
    setPackageFacilities(pkg.facilities || []);
    setPackageIcon(pkg.icon || "clock");
    setPackageActive(!!pkg.active);
    
    setSection("add-livein-package");
  };

  const handleDeletePackage = async (id: number) => {
    setIsDeleting(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/livein/packages/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Gagal menghapus Paket");
      }

      setLiveinPackages(prev => prev.filter(p => p.id !== id));
      showToast("Paket berhasil dihapus!");
      setDeletePackageId(null);
    } catch (err: any) {
      showToast(err.message || "Gagal menghapus Paket", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResetPackageForm = () => {
    setEditingPackageId(null);
    setPackageName("");
    setPackagePrice("");
    setPackagePricingType("per orang");
    setPackageDescription("");
    setPackageFacilities([]);
    setNewFacilityInput("");
    setPackageIcon("clock");
    setPackageActive(true);
  };

  const handleAddFacilityTag = () => {
    if (newFacilityInput.trim()) {
      if (!packageFacilities.includes(newFacilityInput.trim())) {
        setPackageFacilities(prev => [...prev, newFacilityInput.trim()]);
      }
      setNewFacilityInput("");
    }
  };

  const handleRemoveFacilityTag = (idx: number) => {
    setPackageFacilities(prev => prev.filter((_, i) => i !== idx));
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
              {section === "add-livein" && (editingLiveinId ? "Ubah Homestay" : "Tambah Homestay Baru")}
              {section === "add-livein-package" && (editingPackageId ? "Ubah Paket Live In" : "Tambah Paket Live In Baru")}
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
            <div className="flex flex-col w-full max-w-7xl gap-6">
              {/* Tab Selector */}
              <div className="flex border-b border-black/[0.06] w-full shrink-0 bg-white px-2 rounded-t-xl">
                <button
                  onClick={() => setLiveinTab("homes")}
                  className={`px-6 py-3 text-[13.5px] font-bold transition-all border-b-2 -mb-[1px] cursor-pointer ${
                    liveinTab === "homes"
                      ? "border-[#3A6520] text-[#3A6520]"
                      : "border-transparent text-[#7A7065] hover:text-[#2C2C2A]"
                  }`}
                >
                  Foto Homestay Warga
                </button>
                <button
                  onClick={() => setLiveinTab("packages")}
                  className={`px-6 py-3 text-[13.5px] font-bold transition-all border-b-2 -mb-[1px] cursor-pointer ${
                    liveinTab === "packages"
                      ? "border-[#3A6520] text-[#3A6520]"
                      : "border-transparent text-[#7A7065] hover:text-[#2C2C2A]"
                  }`}
                >
                  Paket Reservasi Live In
                </button>
              </div>

              {/* Tab Content: Homes */}
              {liveinTab === "homes" ? (
                <div className="bg-white border border-black/[0.06] rounded-b-xl rounded-tr-xl shadow-sm overflow-hidden flex flex-col w-full">
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
                          placeholder="Cari homestay..."
                          className="w-full pl-9 pr-4 py-2 bg-[#FAF9F5] border border-black/[0.08] rounded-lg text-[13px] text-[#2C2C2A] placeholder:text-[#B8AFA3] outline-none focus:ring-1 focus:ring-[#3A6520]/25 transition"
                        />
                      </div>
                    </div>

                    <button 
                      onClick={() => { handleResetLiveinForm(); setSection("add-livein"); }}
                      className="flex items-center gap-1.5 px-5 py-2.5 bg-[#3A6520] hover:bg-[#2D5016] text-white text-[12.5px] font-semibold rounded-full shadow-sm transition shrink-0 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Tambah Homestay
                    </button>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="bg-[#FAF9F5] border-b border-black/[0.06] text-[11px] font-bold text-[#7A7065] uppercase tracking-wider">
                          <th className="py-4 px-5 w-24">Foto</th>
                          <th className="py-4 px-5">Nama Homestay</th>
                          <th className="py-4 px-5">Pemilik / Tuan Rumah</th>
                          <th className="py-4 px-5 text-right w-32">Aksi</th>
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
                            <td colSpan={4} className="text-center py-12 text-[#7A7065]">
                              Tidak ada data homestay ditemukan.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-black/[0.06] rounded-b-xl rounded-tl-xl shadow-sm overflow-hidden flex flex-col w-full">
                  {/* Toolbar */}
                  <div className="p-5 border-b border-black/[0.06] flex items-center justify-between">
                    <span className="text-[13px] font-bold text-[#2C2C2A]">Daftar Paket Terdaftar</span>
                    <button 
                      onClick={() => { handleResetPackageForm(); setSection("add-livein-package"); }}
                      className="flex items-center gap-1.5 px-5 py-2.5 bg-[#3A6520] hover:bg-[#2D5016] text-white text-[12.5px] font-semibold rounded-full shadow-sm transition shrink-0 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Tambah Paket Wisata
                    </button>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="bg-[#FAF9F5] border-b border-black/[0.06] text-[11px] font-bold text-[#7A7065] uppercase tracking-wider">
                          <th className="py-4 px-5">Nama Paket</th>
                          <th className="py-4 px-5">Tarif</th>
                          <th className="py-4 px-5">Deskripsi</th>
                          <th className="py-4 px-5">Fasilitas</th>
                          <th className="py-4 px-5">Status</th>
                          <th className="py-4 px-5 text-right w-32">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/[0.04]">
                        {liveinPackages.map((pkg, idx) => (
                          <tr key={pkg.id || idx} className="hover:bg-black/[0.01] transition-colors text-[13px] text-[#2C2C2A]">
                            <td className="py-4 px-5 font-bold text-[#2C2C2A]">
                              <div className="flex items-center gap-2">
                                <span className="text-[14px]" title={`Ikon: ${pkg.icon || 'clock'}`}>
                                  {pkg.icon === 'sun' ? '🌅' : pkg.icon === 'home' ? '🏡' : pkg.icon === 'tent' ? '⛺' : pkg.icon === 'sparkles' ? '✨' : '🕒'}
                                </span>
                                <span>{pkg.name}</span>
                              </div>
                            </td>
                            <td className="py-4 px-5 text-[#3A6520] font-bold">
                              Rp {pkg.price.toLocaleString("id-ID")}
                              <span className="text-[11.5px] text-[#7A7065] font-normal"> / {pkg.pricing_type}</span>
                            </td>
                            <td className="py-4 px-5 text-[#5A5550] max-w-xs truncate">{pkg.description}</td>
                            <td className="py-4 px-5">
                              <div className="flex flex-wrap gap-1">
                                {pkg.facilities?.map((f, i) => (
                                  <span key={i} className="px-2 py-0.5 bg-[#FAF9F5] border border-black/[0.06] rounded text-[10.5px] text-[#7A7065]">
                                    {f}
                                  </span>
                                ))}
                                {(!pkg.facilities || pkg.facilities.length === 0) && "-"}
                              </div>
                            </td>
                            <td className="py-4 px-5">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                pkg.active ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-gray-100 text-gray-700 border border-gray-200"
                              }`}>
                                {pkg.active ? "Aktif" : "Non-aktif"}
                              </span>
                            </td>
                            <td className="py-4 px-5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => handleEditPackageClick(pkg)} className="p-2 border border-black/[0.08] hover:bg-[#FAF9F5] rounded text-[#7A7065] hover:text-[#2C2C2A] transition" title="Ubah">
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button onClick={() => setDeletePackageId(pkg.id || null)} className="p-2 border border-black/[0.08] hover:bg-red-50 rounded text-red-500 hover:text-red-700 transition" title="Hapus">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {liveinPackages.length === 0 && (
                          <tr>
                            <td colSpan={6} className="text-center py-12 text-[#7A7065]">
                              Belum ada paket wisata terdaftar.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Section: Add/Edit Live In Form (Homestay Photo & Name only) */}
          {section === "add-livein" && (
            <div className="bg-white border border-black/[0.06] rounded-xl shadow-sm p-5 sm:p-8 max-w-2xl w-full">
              
              {/* Back button */}
              <button 
                onClick={() => { setSection("livein"); handleResetLiveinForm(); }} 
                className="flex items-center gap-1 text-[#7A7065] hover:text-[#2C2C2A] text-[12.5px] font-semibold mb-8 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                Kembali ke Daftar Live In
              </button>

              <form onSubmit={handleSaveLivein} className="space-y-6">
                
                <div className="flex items-center gap-3 border-l-4 border-[#3A6520] pl-3 mb-6">
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[15px] font-bold text-[#2C2C2A]">
                    Informasi Homestay
                  </h3>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-[12.5px] font-semibold text-[#5A5550] mb-2">Nama Homestay</label>
                    <input
                      type="text"
                      required
                      value={liveinName}
                      onChange={e => setLiveinName(e.target.value)}
                      placeholder="Contoh: Homestay Mbah Siswo"
                      className="w-full px-4 py-2.5 bg-[#FAF9F5] border border-black/[0.08] rounded-lg text-[13px] text-[#2C2C2A] placeholder:text-[#B8AFA3] outline-none focus:ring-1 focus:ring-[#3A6520]/25 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[12.5px] font-semibold text-[#5A5550] mb-2">Nama Pemilik / Tuan Rumah</label>
                    <input
                      type="text"
                      required
                      value={liveinOwner}
                      onChange={e => setLiveinOwner(e.target.value)}
                      placeholder="Contoh: Siswosuharto"
                      className="w-full px-4 py-2.5 bg-[#FAF9F5] border border-black/[0.08] rounded-lg text-[13px] text-[#2C2C2A] placeholder:text-[#B8AFA3] outline-none focus:ring-1 focus:ring-[#3A6520]/25 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[12.5px] font-semibold text-[#5A5550] mb-2">Foto Homestay (Cover)</label>
                    <div 
                      onClick={() => handleFileUploadClick(liveinCoverFileRef)}
                      className="border-2 border-dashed border-black/[0.09] bg-[#FAF9F5] hover:border-black/20 rounded-xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center h-48"
                    >
                      {liveinCoverImage ? (
                        <div className="relative w-full h-full">
                          <img src={liveinCoverImage} alt="" className="w-full h-full object-cover rounded shadow-sm" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center text-white text-[11px] font-medium rounded">
                            Klik untuk mengganti gambar
                          </div>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-[#B8AFA3] mb-2" />
                          <span className="text-[12px] font-bold text-[#2C2C2A] block">Unggah Gambar Homestay</span>
                          <span className="text-[11px] text-[#7A7065] mt-1">Satu gambar beresolusi tinggi landscape</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit panel */}
                <div className="pt-6 border-t border-black/[0.06] flex items-center gap-3">
                  <button 
                    type="submit" 
                    disabled={submittingLivein} 
                    className="px-8 py-3 bg-[#3A6520] hover:bg-[#2D5016] text-white text-[12.5px] font-bold rounded-full shadow transition disabled:opacity-50 cursor-pointer"
                  >
                    {submittingLivein ? "Menyimpan..." : (editingLiveinId ? "Simpan Perubahan" : "Tambah Homestay")}
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

          {/* Section: Add/Edit Live In Package Form */}
          {section === "add-livein-package" && (
            <div className="bg-white border border-black/[0.06] rounded-xl shadow-sm p-5 sm:p-8 max-w-2xl w-full">
              
              {/* Back button */}
              <button 
                onClick={() => { setSection("livein"); setLiveinTab("packages"); handleResetPackageForm(); }} 
                className="flex items-center gap-1 text-[#7A7065] hover:text-[#2C2C2A] text-[12.5px] font-semibold mb-8 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                Kembali ke Daftar Paket
              </button>

              <form onSubmit={handleSavePackage} className="space-y-6">
                
                <div className="flex items-center gap-3 border-l-4 border-[#3A6520] pl-3 mb-6">
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[15px] font-bold text-[#2C2C2A]">
                    Informasi Paket Wisata
                  </h3>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-[12.5px] font-semibold text-[#5A5550] mb-2">Nama Paket</label>
                    <input
                      type="text"
                      required
                      value={packageName}
                      onChange={e => setPackageName(e.target.value)}
                      placeholder="Contoh: Overnight (Menginap Semalam)"
                      className="w-full px-4 py-2.5 bg-[#FAF9F5] border border-black/[0.08] rounded-lg text-[13px] text-[#2C2C2A] placeholder:text-[#B8AFA3] outline-none focus:ring-1 focus:ring-[#3A6520]/25 transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[12.5px] font-semibold text-[#5A5550] mb-2">Tarif Paket (Rp)</label>
                      <input
                        type="number"
                        required
                        value={packagePrice}
                        onChange={e => setPackagePrice(e.target.value)}
                        placeholder="Contoh: 150000"
                        className="w-full px-4 py-2.5 bg-[#FAF9F5] border border-black/[0.08] rounded-lg text-[13px] text-[#2C2C2A] placeholder:text-[#B8AFA3] outline-none focus:ring-1 focus:ring-[#3A6520]/25 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-[12.5px] font-semibold text-[#5A5550] mb-2">Satuan Perhitungan</label>
                      <select
                        value={packagePricingType}
                        onChange={e => setPackagePricingType(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#FAF9F5] border border-black/[0.08] rounded-lg text-[13px] text-[#2C2C2A] outline-none focus:ring-1 focus:ring-[#3A6520]/25 transition"
                      >
                        <option value="per orang">per orang</option>
                        <option value="per paket">per paket</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[12.5px] font-semibold text-[#5A5550] mb-2">Ikon Paket</label>
                      <select
                        value={packageIcon}
                        onChange={e => setPackageIcon(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#FAF9F5] border border-black/[0.08] rounded-lg text-[13px] text-[#2C2C2A] outline-none focus:ring-1 focus:ring-[#3A6520]/25 transition"
                      >
                        <option value="clock">🕒 Jam / Durasi (Clock)</option>
                        <option value="sun">🌅 Matahari / Sunrise (Sun)</option>
                        <option value="home">🏡 Rumah / Homestay (Home)</option>
                        <option value="tent">⛺ Tenda / Outdoor (Tent)</option>
                        <option value="sparkles">✨ Rekomendasi (Sparkles)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12.5px] font-semibold text-[#5A5550] mb-2">Deskripsi Paket</label>
                    <textarea
                      rows={3}
                      value={packageDescription}
                      onChange={e => setPackageDescription(e.target.value)}
                      placeholder="Gambarkan fasilitas utama, durasi, atau detail kegiatan yang didapatkan dalam paket ini..."
                      className="w-full px-4 py-2.5 bg-[#FAF9F5] border border-black/[0.08] rounded-lg text-[13px] text-[#2C2C2A] placeholder:text-[#B8AFA3] outline-none focus:ring-1 focus:ring-[#3A6520]/25 transition resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[12.5px] font-semibold text-[#5A5550] mb-2">Fasilitas / Kelengkapan Paket</label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newFacilityInput}
                        onChange={e => setNewFacilityInput(e.target.value)}
                        placeholder="Contoh: Makan 3x, Pemandu Lokal"
                        className="flex-1 px-4 py-2 bg-[#FAF9F5] border border-black/[0.08] rounded-lg text-[13px] text-[#2C2C2A] outline-none focus:ring-1 focus:ring-[#3A6520]/25 transition"
                        onKeyDown={e => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddFacilityTag();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddFacilityTag}
                        className="px-4 py-2 bg-[#3A6520] hover:bg-[#2D5016] text-white text-[12.5px] font-semibold rounded-lg transition shrink-0 cursor-pointer"
                      >
                        Tambah
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {packageFacilities.map((facility, idx) => (
                        <span 
                          key={idx} 
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF9F5] border border-black/[0.08] rounded-full text-[12px] text-[#5A5550] font-medium"
                        >
                          {facility}
                          <button
                            type="button"
                            onClick={() => handleRemoveFacilityTag(idx)}
                            className="text-[#7A7065] hover:text-red-500 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                      {packageFacilities.length === 0 && (
                        <span className="text-[12px] text-[#7A7065] italic">Belum ada fasilitas ditambahkan. Ketik di atas lalu tekan Tambah.</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="block text-[12.5px] font-semibold text-[#5A5550] mb-2">Status Paket</span>
                    <label className="flex items-center gap-3 cursor-pointer mt-1">
                      <input
                        type="checkbox"
                        checked={packageActive}
                        onChange={e => setPackageActive(e.target.checked)}
                        className="w-4 h-4 rounded text-[#3A6520] border-black/[0.12] focus:ring-[#3A6520]/20"
                      />
                      <span className="text-[13px] text-[#2C2C2A]">Paket Aktif & Tampilkan di Halaman Depan</span>
                    </label>
                  </div>
                </div>

                {/* Submit panel */}
                <div className="pt-6 border-t border-black/[0.06] flex items-center gap-3">
                  <button 
                    type="submit" 
                    disabled={submittingPackage} 
                    className="px-8 py-3 bg-[#3A6520] hover:bg-[#2D5016] text-white text-[12.5px] font-bold rounded-full shadow transition disabled:opacity-50 cursor-pointer"
                  >
                    {submittingPackage ? "Menyimpan..." : (editingPackageId ? "Simpan Perubahan" : "Tambah Paket")}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setSection("livein"); setLiveinTab("packages"); handleResetPackageForm(); }} 
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
              <button 
                onClick={() => handleDeleteDoc(deleteId)} 
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-red-500 text-white text-[13px] font-semibold rounded-full hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
              <button 
                onClick={() => setDeleteId(null)} 
                disabled={isDeleting}
                className="flex-1 py-2.5 border border-black/[0.12] text-[#5A5550] text-[13px] font-medium rounded-full hover:bg-[#F0EBE3] transition-colors cursor-pointer disabled:opacity-50"
              >
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
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[16px] font-bold text-[#2C2C2A] mb-1.5">Hapus Homestay?</h3>
              <p className="text-[13px] text-[#7A7065] leading-relaxed">Tindakan ini tidak dapat dibatalkan. Data homestay ini akan dihapus secara permanen.</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleDeleteLivein(deleteLiveinId)} 
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-red-500 text-white text-[13px] font-semibold rounded-full hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
              <button 
                onClick={() => setDeleteLiveinId(null)} 
                disabled={isDeleting}
                className="flex-1 py-2.5 border border-black/[0.12] text-[#5A5550] text-[13px] font-medium rounded-full hover:bg-[#F0EBE3] transition-colors cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Package modal */}
      {deletePackageId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-sm">
          <div className="bg-white rounded-xl border border-black/[0.08] shadow-lg p-7 w-80 flex flex-col gap-5">
            <div>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[16px] font-bold text-[#2C2C2A] mb-1.5">Hapus Paket Live In?</h3>
              <p className="text-[13px] text-[#7A7065] leading-relaxed">Tindakan ini tidak dapat dibatalkan. Paket wisata ini akan dihapus secara permanen.</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleDeletePackage(deletePackageId)} 
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-red-500 text-white text-[13px] font-semibold rounded-full hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
              <button 
                onClick={() => setDeletePackageId(null)} 
                disabled={isDeleting}
                className="flex-1 py-2.5 border border-black/[0.12] text-[#5A5550] text-[13px] font-medium rounded-full hover:bg-[#F0EBE3] transition-colors cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
