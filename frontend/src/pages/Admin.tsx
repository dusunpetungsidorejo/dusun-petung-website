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
  AlertCircle,
  Tent
} from "lucide-react";
import { Page, Activity, LiveInHouse, LiveInPackage, CampPackage, CampRental, Demographic } from "../types";
import { ToastContainer } from "../components/ToastContainer";

type AdminSection = "dashboard" | "docs" | "add-doc" | "settings" | "livein" | "add-livein" | "add-livein-package" | "camp" | "add-camp-package" | "add-camp-rental" | "demographics" | "add-demographic";

const DEFAULT_PACKAGES: LiveInPackage[] = [
  {
    id: 1,
    name: "Paket Menginap Semalam (Overnight)",
    price: 150000,
    pricing_type: "orang",
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
    pricing_type: "orang",
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

  // Intercept 401 Unauthorized globally for all fetch requests within the Admin Panel
  const fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const response = await window.fetch(input, init);
    if (response.status === 401) {
      showToast("Sesi Anda telah berakhir. Silakan login kembali.", "error");
      onLogout();
      // Suspend execution to prevent subsequent code/toasts from running in the caller
      await new Promise(() => {});
    }
    return response;
  };

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
  const [packagePricingType, setPackagePricingType] = useState("orang");
  const [packageDescription, setPackageDescription] = useState("");
  const [packageFacilities, setPackageFacilities] = useState<string[]>([]);
  const [newFacilityInput, setNewFacilityInput] = useState("");
  const [packageIcon, setPackageIcon] = useState("clock");
  const [packageActive, setPackageActive] = useState(true);

  // Camp State Management
  const [campPackages, setCampPackages] = useState<CampPackage[]>([]);
  const [campRentals, setCampRentals] = useState<CampRental[]>([]);
  const [loadingCampPackages, setLoadingCampPackages] = useState(false);
  const [loadingCampRentals, setLoadingCampRentals] = useState(false);
  const [activeCampTab, setActiveCampTab] = useState<"paket" | "sewa">("paket");

  // Camp Package Form States
  const [editingCampPackageId, setEditingCampPackageId] = useState<number | null>(null);
  const [campPackageName, setCampPackageName] = useState("");
  const [campPackageCapacity, setCampPackageCapacity] = useState("4");
  const [campPackagePrice, setCampPackagePrice] = useState("");
  const [campPackageDescription, setCampPackageDescription] = useState("");
  const [campPackageActive, setCampPackageActive] = useState(true);
  const [submittingCampPackage, setSubmittingCampPackage] = useState(false);
  const [deleteCampPackageId, setDeleteCampPackageId] = useState<number | null>(null);

  // Camp Rental Form States
  const [editingCampRentalId, setEditingCampRentalId] = useState<number | null>(null);
  const [campRentalName, setCampRentalName] = useState("");
  const [campRentalCategory, setCampRentalCategory] = useState("Tenda & Perlengkapan Tidur");
  const [campRentalPrice, setCampRentalPrice] = useState("");
  const [campRentalActive, setCampRentalActive] = useState(true);
  const [submittingCampRental, setSubmittingCampRental] = useState(false);
  const [deleteCampRentalId, setDeleteCampRentalId] = useState<number | null>(null);

  const [isDeletingCampPkg, setIsDeletingCampPkg] = useState(false);
  const [isDeletingCampRental, setIsDeletingCampRental] = useState(false);

  // Demographics State Management
  const [demographics, setDemographics] = useState<Demographic[]>([]);
  const [loadingDemographics, setLoadingDemographics] = useState(false);
  const [editingDemographicId, setEditingDemographicId] = useState<number | null>(null);
  const [demographicIcon, setDemographicIcon] = useState("Users");
  const [demographicValue, setDemographicValue] = useState("");
  const [demographicLabel, setDemographicLabel] = useState("");
  const [submittingDemographic, setSubmittingDemographic] = useState(false);
  const [deleteDemographicId, setDeleteDemographicId] = useState<number | null>(null);
  const [isDeletingDemographic, setIsDeletingDemographic] = useState(false);

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
  const [isDraggingLiveinCover, setIsDraggingLiveinCover] = useState(false);

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

  const fetchCampPackages = async () => {
    setLoadingCampPackages(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/camp/packages`);
      if (res.ok) {
        const data = await res.json();
        setCampPackages(data);
      }
    } catch (err) {
      console.error("Failed to fetch Camp packages:", err);
    } finally {
      setLoadingCampPackages(false);
    }
  };

  const fetchCampRentals = async () => {
    setLoadingCampRentals(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/camp/rentals`);
      if (res.ok) {
        const data = await res.json();
        setCampRentals(data);
      }
    } catch (err) {
      console.error("Failed to fetch Camp rentals:", err);
    } finally {
      setLoadingCampRentals(false);
    }
  };

  useEffect(() => {
    // Check if token is already expired on mount
    if (token) {
      try {
        const parts = token.split(".");
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
          if (payload.exp) {
            const currentTime = Math.floor(Date.now() / 1000);
            if (payload.exp < currentTime) {
              showToast("Sesi Anda telah berakhir. Silakan login kembali.", "error");
              onLogout();
              return;
            }
          }
        }
      } catch (e) {
        console.error("Error checking token expiration", e);
      }
    }

    fetchLiveinHouses();
    fetchLiveinPackages();
    fetchCampPackages();
    fetchCampRentals();
    fetchDemographics();
  }, [token, onLogout, showToast]);


  const sideNav = [
    { icon: LayoutDashboard, label: "Dashboard", key: "dashboard" as AdminSection },
    { icon: Users, label: "Data Statistik Dusun", key: "demographics" as AdminSection },
    { icon: FileText, label: "Dokumentasi Dusun", key: "docs" as AdminSection },
    { icon: Tent, label: "Gumuk Petung Camp", key: "camp" as AdminSection },
    { icon: Home, label: "Live In", key: "livein" as AdminSection },
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

  const handleLiveinDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleLiveinDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingLiveinCover(true);
  };

  const handleLiveinDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingLiveinCover(false);
  };

  const handleLiveinDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingLiveinCover(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith("image/")) {
        showToast("Hanya berkas gambar yang didukung", "error");
        return;
      }
      showToast("Sedang mengunggah gambar...");
      try {
        const fileUrl = await uploadMedia(file);
        setLiveinCoverImage(fileUrl);
        showToast("Gambar cover Live In berhasil diunggah!");
      } catch (err: any) {
        showToast(err.message || "Gagal mengunggah gambar", "error");
      }
    }
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
    
    let pricingType = pkg.pricing_type;
    if (pricingType === "per orang") pricingType = "orang";
    else if (pricingType === "per paket") pricingType = "malam";
    setPackagePricingType(pricingType);
    
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
    setPackagePricingType("orang");
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


  // --- CAMP PACKAGES CRUD HANDLERS ---
  const handleResetCampPackageForm = () => {
    setEditingCampPackageId(null);
    setCampPackageName("");
    setCampPackageCapacity("4");
    setCampPackagePrice("");
    setCampPackageDescription("");
    setCampPackageActive(true);
  };

  const handleEditCampPackageClick = (pkg: CampPackage) => {
    setEditingCampPackageId(pkg.id || null);
    setCampPackageName(pkg.name);
    const match = pkg.capacity.match(/\d+/);
    setCampPackageCapacity(match ? match[0] : pkg.capacity);
    setCampPackagePrice(String(pkg.price));
    setCampPackageDescription(pkg.description || "");
    setCampPackageActive(!!pkg.active);
    setSection("add-camp-package");
  };

  const handleSubmitCampPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campPackageName.trim()) {
      showToast("Nama paket wajib diisi", "error");
      return;
    }
    const priceVal = Number(campPackagePrice);
    if (!campPackagePrice || isNaN(priceVal) || priceVal < 0) {
      showToast("Harga paket harus berupa angka positif", "error");
      return;
    }

    setSubmittingCampPackage(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const payload = {
        name: campPackageName,
        capacity: /^\d+$/.test(campPackageCapacity) ? `Kapasitas ${campPackageCapacity} Orang` : campPackageCapacity,
        price: priceVal,
        description: campPackageDescription,
        active: campPackageActive
      };

      let res;
      if (editingCampPackageId) {
        res = await fetch(`${baseUrl}/camp/packages/${editingCampPackageId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`${baseUrl}/camp/packages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal menyimpan Paket");
      }

      showToast(editingCampPackageId ? "Paket Camp berhasil diubah" : "Paket Camp berhasil ditambahkan", "success");
      handleResetCampPackageForm();
      fetchCampPackages();
      setSection("camp");
    } catch (err: any) {
      showToast(err.message || "Gagal menyimpan Paket", "error");
    } finally {
      setSubmittingCampPackage(false);
    }
  };

  const handleDeleteCampPackage = async (id: number) => {
    setIsDeletingCampPkg(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/camp/packages/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Gagal menghapus Paket");
      }
      showToast("Paket Camp berhasil dihapus", "success");
      setDeleteCampPackageId(null);
      fetchCampPackages();
    } catch (err: any) {
      showToast(err.message || "Gagal menghapus Paket", "error");
    } finally {
      setIsDeletingCampPkg(false);
    }
  };

  // --- CAMP RENTALS CRUD HANDLERS ---
  const handleResetCampRentalForm = () => {
    setEditingCampRentalId(null);
    setCampRentalName("");
    setCampRentalCategory("Tenda & Perlengkapan Tidur");
    setCampRentalPrice("");
    setCampRentalActive(true);
  };

  const handleEditCampRentalClick = (rent: CampRental) => {
    setEditingCampRentalId(rent.id || null);
    setCampRentalName(rent.name);
    setCampRentalCategory(rent.category);
    setCampRentalPrice(String(rent.price));
    setCampRentalActive(!!rent.active);
    setSection("add-camp-rental");
  };

  const handleSubmitCampRental = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campRentalName.trim()) {
      showToast("Nama alat wajib diisi", "error");
      return;
    }
    const priceVal = Number(campRentalPrice);
    if (!campRentalPrice || isNaN(priceVal) || priceVal < 0) {
      showToast("Tarif sewa harus berupa angka positif", "error");
      return;
    }

    setSubmittingCampRental(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const payload = {
        name: campRentalName,
        category: campRentalCategory,
        price: priceVal,
        active: campRentalActive
      };

      let res;
      if (editingCampRentalId) {
        res = await fetch(`${baseUrl}/camp/rentals/${editingCampRentalId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`${baseUrl}/camp/rentals`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal menyimpan Sewa Alat");
      }

      showToast(editingCampRentalId ? "Sewa Alat berhasil diubah" : "Sewa Alat berhasil ditambahkan", "success");
      handleResetCampRentalForm();
      fetchCampRentals();
      setSection("camp");
    } catch (err: any) {
      showToast(err.message || "Gagal menyimpan Sewa Alat", "error");
    } finally {
      setSubmittingCampRental(false);
    }
  };

  const handleDeleteCampRental = async (id: number) => {
    setIsDeletingCampRental(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/camp/rentals/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Gagal menghapus Sewa Alat");
      }
      showToast("Sewa Alat berhasil dihapus", "success");
      setDeleteCampRentalId(null);
      fetchCampRentals();
    } catch (err: any) {
      showToast(err.message || "Gagal menghapus Sewa Alat", "error");
    } finally {
      setIsDeletingCampRental(false);
    }
  };


  // --- DEMOGRAPHICS CRUD HANDLERS ---
  const fetchDemographics = async () => {
    setLoadingDemographics(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/demographics`);
      if (res.ok) {
        const data = await res.json();
        setDemographics(data);
      }
    } catch (err) {
      console.error("Failed to fetch Demographics:", err);
    } finally {
      setLoadingDemographics(false);
    }
  };

  const handleResetDemographicForm = () => {
    setEditingDemographicId(null);
    setDemographicIcon("Users");
    setDemographicValue("");
    setDemographicLabel("");
  };

  const handleEditDemographic = (d: Demographic) => {
    setEditingDemographicId(d.id || null);
    setDemographicIcon(d.icon);
    setDemographicValue(d.value);
    setDemographicLabel(d.label);
    setSection("add-demographic");
  };

  const handleAddDemographicClick = () => {
    handleResetDemographicForm();
    setSection("add-demographic");
  };

  const handleSubmitDemographic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!demographicIcon.trim() || !demographicValue.trim() || !demographicLabel.trim()) {
      showToast("Semua field wajib diisi", "error");
      return;
    }

    setSubmittingDemographic(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const payload = {
        icon: demographicIcon,
        value: demographicValue,
        label: demographicLabel
      };

      let res;
      if (editingDemographicId) {
        res = await fetch(`${baseUrl}/demographics/${editingDemographicId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`${baseUrl}/demographics`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal menyimpan Data Dusun");
      }

      showToast(editingDemographicId ? "Data Dusun berhasil diubah" : "Data Dusun berhasil ditambahkan", "success");
      handleResetDemographicForm();
      fetchDemographics();
      setSection("demographics");
    } catch (err: any) {
      showToast(err.message || "Gagal menyimpan Data Dusun", "error");
    } finally {
      setSubmittingDemographic(false);
    }
  };

  const handleDeleteDemographic = async (id: number) => {
    setIsDeletingDemographic(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/demographics/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Gagal menghapus Data Dusun");
      }
      showToast("Data Dusun berhasil dihapus", "success");
      setDeleteDemographicId(null);
      fetchDemographics();
    } catch (err: any) {
      showToast(err.message || "Gagal menghapus Data Dusun", "error");
    } finally {
      setIsDeletingDemographic(false);
    }
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

  const jiwaDemo = demographics.find(d => d.label.toLowerCase().includes("jiwa") || d.label.toLowerCase().includes("penduduk"));
  const kkDemo = demographics.find(d => d.label.toLowerCase().includes("kepala") || d.label.toLowerCase().includes("kk"));
  const jiwaValue = jiwaDemo ? jiwaDemo.value : "-";
  const kkValue = kkDemo ? kkDemo.value : "-";
  const isDashboardLoading = loadingDemographics || loadingLivein || loadingCampPackages || loadingCampRentals;

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
          className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-black/[0.06] bg-white flex flex-col justify-between shrink-0 h-screen transition-transform duration-300 transform md:sticky md:top-0 md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
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
                  (key === "livein" && (section === "add-livein" || section === "add-livein-package")) ||
                  (key === "camp" && (section === "add-camp-package" || section === "add-camp-rental")) ||
                  (key === "demographics" && section === "add-demographic") ||
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
              {section === "camp" && "Manajemen Camping & Sewa Alat"}
              {section === "add-camp-package" && (editingCampPackageId ? "Ubah Paket Camp" : "Tambah Paket Camp Baru")}
              {section === "add-camp-rental" && (editingCampRentalId ? "Ubah Sewa Alat" : "Tambah Sewa Alat Baru")}
              {section === "docs" && "Manajemen Dokumentasi"}
              {section === "add-doc" && (editingDocId ? "Ubah Dokumentasi" : "Tambah Dokumentasi Baru")}
              {section === "settings" && "Pengaturan Website"}
              {section === "demographics" && "Manajemen Data Statistik Dusun"}
              {section === "add-demographic" && (editingDemographicId ? "Ubah Data Dusun" : "Tambah Data Dusun Baru")}
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
              
              {/* Unified Statistics Cards */}
              <div>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[13px] font-bold text-[#7A7065] uppercase tracking-wider mb-4">Statistik Dashboard</h3>
                {isDashboardLoading ? (
                  <div className="bg-white border border-black/[0.06] rounded-xl p-8 shadow-sm flex flex-col items-center justify-center min-h-[160px] w-full gap-3">
                    <div className="relative w-9 h-9 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-2 border-[#3A6520]/10" />
                      <div className="absolute inset-0 rounded-full border-2 border-t-[#3A6520] animate-spin" />
                    </div>
                    <span className="text-[12.5px] font-medium text-[#7A7065] animate-pulse">Memuat data statistik dashboard...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                    {[
                      { 
                        label: "Jumlah Penduduk", 
                        value: `${jiwaValue}`, 
                        icon: Users, 
                        color: "text-[#3A6520] bg-[#3A6520]/8",
                        action: () => setSection("demographics")
                      },
                      { 
                        label: "Kepala Keluarga", 
                        value: `${kkValue}`, 
                        icon: Home,
                        color: "text-[#3A6520] bg-[#3A6520]/8",
                        action: () => setSection("demographics")
                      },
                      { 
                        label: "Jumlah Kegiatan", 
                        value: activities.length, 
                        icon: FileText, 
                        color: "text-[#3A6520] bg-[#3A6520]/8",
                        action: () => setSection("docs")
                      },
                      { 
                        label: "Jumlah Live In", 
                        value: totalLiveinCount, 
                        icon: Home,
                        color: "text-[#3A6520] bg-[#3A6520]/8",
                        action: () => setSection("livein")
                      }
                    ].map(({ label, value, icon: Icon, color, action }) => (
                      <div 
                        key={label} 
                        onClick={action}
                        className="bg-white border border-black/[0.06] rounded-xl p-3.5 sm:p-5 shadow-sm flex items-start justify-between hover:border-[#3A6520]/30 hover:shadow-md transition cursor-pointer group"
                      >
                        <div className="min-w-0">
                          <span className="text-[9.5px] sm:text-[11px] font-bold text-[#7A7065] uppercase tracking-wider group-hover:text-[#3A6520] transition-colors block truncate">{label}</span>
                          <div 
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} 
                            className={`font-extrabold text-[#2C2C2A] mt-1.5 mb-0.5 ${
                              String(value).length > 8 ? "text-lg sm:text-2xl" : "text-2xl sm:text-3xl"
                            }`}
                          >
                            {value}
                          </div>
                        </div>
                        <span className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${color}`}>
                          <Icon className="w-4 h-4 sm:w-5 h-5" strokeWidth={2} />
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[13px] font-bold text-[#7A7065] uppercase tracking-wider mb-4">Tindakan Cepat</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                  <button
                    onClick={() => { handleResetLiveinForm(); setSection("add-livein"); }}
                    className="flex items-center justify-center gap-2.5 px-5 py-3.5 bg-[#3A6520] hover:bg-[#2D5016] text-white text-[13px] font-bold rounded-xl shadow-sm hover:shadow-md transition duration-200 cursor-pointer w-full text-center"
                  >
                    <Plus className="w-4 h-4 shrink-0" />
                    <span>Tambah Homestay Baru</span>
                  </button>
                  <button
                    onClick={() => { setEditingDocId(null); setTitleInput(""); setDescInput(""); setUploadedFile(null); setSection("add-doc"); }}
                    className="flex items-center justify-center gap-2.5 px-5 py-3.5 bg-white border border-black/[0.08] hover:border-[#3A6520]/30 hover:bg-[#FAF9F5] text-[#2C2C2A] text-[13px] font-bold rounded-xl shadow-sm hover:shadow-md transition duration-200 cursor-pointer w-full text-center"
                  >
                    <Plus className="w-4 h-4 shrink-0 text-[#3A6520]" />
                    <span>Buat Kegiatan Baru</span>
                  </button>
                  <button
                    onClick={() => setSection("settings")}
                    className="flex items-center justify-center gap-2.5 px-5 py-3.5 bg-white border border-black/[0.08] hover:border-[#3A6520]/30 hover:bg-[#FAF9F5] text-[#2C2C2A] text-[13px] font-bold rounded-xl shadow-sm hover:shadow-md transition duration-200 cursor-pointer w-full text-center"
                  >
                    <Settings className="w-4 h-4 shrink-0 text-[#3A6520]" />
                    <span>Pengaturan Website</span>
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

                  {/* Card List for Mobile (No scroll) */}
                  <div className="block sm:hidden divide-y divide-black/[0.05]">
                    {filteredLivein.map((house, idx) => (
                      <div key={house.id || idx} className="p-4 flex items-start gap-3.5">
                        {house.cover_image ? (
                          <img src={house.cover_image} alt="" className="w-16 h-12 object-cover rounded border border-black/[0.05] bg-[#FAF9F5] shrink-0" />
                        ) : (
                          <div className="w-16 h-12 rounded border border-black/[0.05] bg-[#FAF9F5] flex items-center justify-center text-[#B8AFA3] shrink-0">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <span className="font-bold text-[#2C2C2A] text-[13.5px] block truncate">{house.name}</span>
                          <span className="text-[12px] text-[#7A7065] block mt-0.5">Pemilik: {house.owner}</span>
                          <div className="flex items-center gap-2 mt-2.5">
                            <button 
                              onClick={() => handleEditLiveinClick(house)} 
                              className="flex items-center gap-1 px-3 py-1.5 border border-black/[0.08] hover:bg-[#FAF9F5] rounded-lg text-[11px] text-[#5A5550] font-semibold transition"
                            >
                              <Pencil className="w-3 h-3" />
                              Ubah
                            </button>
                            <button 
                              onClick={() => setDeleteLiveinId(house.id || null)} 
                              className="flex items-center gap-1 px-3 py-1.5 border border-black/[0.08] hover:bg-red-50 rounded-lg text-[11px] text-red-600 font-semibold transition"
                            >
                              <Trash2 className="w-3 h-3" />
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredLivein.length === 0 && (
                      <div className="text-center py-12 text-[12.5px] text-[#7A7065]">
                        Tidak ada data homestay ditemukan.
                      </div>
                    )}
                  </div>

                  {/* Table List for Desktop */}
                  <div className="hidden sm:block overflow-x-auto w-full">
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
                  <div className="p-5 border-b border-black/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <span className="text-[13px] font-bold text-[#2C2C2A]">Daftar Paket Terdaftar</span>
                    <button 
                      onClick={() => { handleResetPackageForm(); setSection("add-livein-package"); }}
                      className="flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#3A6520] hover:bg-[#2D5016] text-white text-[12.5px] font-semibold rounded-full shadow-sm transition shrink-0 cursor-pointer w-full sm:w-auto"
                    >
                      <Plus className="w-4 h-4" />
                      Tambah Paket Wisata
                    </button>
                  </div>

                  {/* Card List for Mobile (No scroll) */}
                  <div className="block sm:hidden divide-y divide-black/[0.05]">
                    {liveinPackages.map((pkg, idx) => (
                      <div key={pkg.id || idx} className="p-4 flex flex-col gap-2.5">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-[14px]">
                              {pkg.icon === 'sun' ? '🌅' : pkg.icon === 'home' ? '🏡' : pkg.icon === 'tent' ? '⛺' : pkg.icon === 'sparkles' ? '✨' : '🕒'}
                            </span>
                            <span className="font-bold text-[#2C2C2A] text-[13.5px]">{pkg.name}</span>
                          </div>
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            pkg.active ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-gray-100 text-gray-700 border border-gray-200"
                          }`}>
                            {pkg.active ? "Aktif" : "Non-aktif"}
                          </span>
                        </div>

                        <div className="text-[13px] font-extrabold text-[#3A6520]">
                          Rp {pkg.price.toLocaleString("id-ID")}
                          <span className="text-[11.5px] text-[#7A7065] font-normal"> / {pkg.pricing_type === "per orang" || pkg.pricing_type === "orang" ? "orang" : pkg.pricing_type === "per paket" || pkg.pricing_type === "malam" ? "malam" : pkg.pricing_type}</span>
                        </div>

                        {pkg.description && (
                          <div className="text-[12px] text-[#7A7065] line-clamp-2">
                            {pkg.description}
                          </div>
                        )}

                        {pkg.facilities && pkg.facilities.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-0.5">
                            {pkg.facilities.map((f, i) => (
                              <span key={i} className="px-2 py-0.5 bg-[#FAF9F5] border border-black/[0.06] rounded text-[10px] text-[#7A7065]">
                                {f}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center gap-2 mt-1">
                          <button 
                            onClick={() => handleEditPackageClick(pkg)} 
                            className="flex items-center gap-1 px-3 py-1.5 border border-black/[0.08] hover:bg-[#FAF9F5] rounded-lg text-[11px] text-[#5A5550] font-semibold transition"
                          >
                            <Pencil className="w-3 h-3" />
                            Ubah
                          </button>
                          <button 
                            onClick={() => setDeletePackageId(pkg.id || null)} 
                            className="flex items-center gap-1 px-3 py-1.5 border border-black/[0.08] hover:bg-red-50 rounded-lg text-[11px] text-red-600 font-semibold transition"
                          >
                            <Trash2 className="w-3 h-3" />
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))}
                    {liveinPackages.length === 0 && (
                      <div className="text-center py-12 text-[12.5px] text-[#7A7065]">
                        Belum ada paket wisata terdaftar.
                      </div>
                    )}
                  </div>

                  {/* Table List for Desktop */}
                  <div className="hidden sm:block overflow-x-auto w-full">
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
                              <span className="text-[11.5px] text-[#7A7065] font-normal"> / {pkg.pricing_type === "per orang" || pkg.pricing_type === "orang" ? "orang" : pkg.pricing_type === "per paket" || pkg.pricing_type === "malam" ? "malam" : pkg.pricing_type}</span>
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

          {/* Section: Camp (Packages & Rentals list) */}
          {section === "camp" && (
            <div className="space-y-6">
              
              {/* Tab Selector */}
              <div className="flex border-b border-black/[0.06] -mx-4 px-4 sm:mx-0 sm:px-0">
                <button
                  onClick={() => setActiveCampTab("paket")}
                  className={`pb-3.5 text-[13.5px] font-bold border-b-2 px-4 transition-all ${
                    activeCampTab === "paket"
                      ? "border-[#3A6520] text-[#3A6520]"
                      : "border-transparent text-[#7A7065] hover:text-[#2C2C2A]"
                  }`}
                >
                  Paket Camping
                </button>
                <button
                  onClick={() => setActiveCampTab("sewa")}
                  className={`pb-3.5 text-[13.5px] font-bold border-b-2 px-4 transition-all ${
                    activeCampTab === "sewa"
                      ? "border-[#3A6520] text-[#3A6520]"
                      : "border-transparent text-[#7A7065] hover:text-[#2C2C2A]"
                  }`}
                >
                  Sewa Alat
                </button>
              </div>

              {/* Sub-Section: Paket Camping */}
              {activeCampTab === "paket" && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div>
                      <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[16px] font-extrabold text-[#2C2C2A]">
                        Daftar Paket Camping
                      </h2>
                      <p className="text-[12px] text-[#7A7065] mt-0.5">
                        Kelola paket berkemah yang ditawarkan di Gumuk Petung.
                      </p>
                    </div>
                    <button
                      onClick={() => { handleResetCampPackageForm(); setSection("add-camp-package"); }}
                      className="flex items-center justify-center gap-2 bg-[#3A6520] text-white px-4 py-2.5 rounded-lg text-[12.5px] font-bold hover:bg-[#2D5016] shadow-sm transition w-full sm:w-auto self-stretch sm:self-auto"
                    >
                      <Plus className="w-4 h-4" />
                      Tambah Paket
                    </button>
                  </div>

                  {/* Card List for Mobile (No scroll) */}
                  <div className="block sm:hidden divide-y divide-black/[0.05] bg-white border border-black/[0.06] rounded-xl shadow-sm overflow-hidden">
                    {campPackages.map((pkg) => (
                      <div key={pkg.id} className="p-4 flex flex-col gap-2.5">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-bold text-[#2C2C2A] text-[13.5px] block">{pkg.name}</span>
                            <span className="text-[11.5px] text-[#7A7065] block mt-0.5">Kapasitas: {pkg.capacity} Orang</span>
                          </div>
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            pkg.active 
                              ? "bg-green-50 text-green-700 border border-green-200" 
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}>
                            {pkg.active ? "Aktif" : "Nonaktif"}
                          </span>
                        </div>

                        <div className="text-[13px] font-extrabold text-[#3A6520]">
                          Rp {pkg.price.toLocaleString("id-ID")}
                        </div>

                        {pkg.description && (
                          <div className="text-[11.5px] text-[#7A7065] bg-[#FAF9F5] p-2.5 rounded border border-black/[0.03] truncate">
                            {pkg.description}
                          </div>
                        )}

                        <div className="flex items-center gap-2 mt-1">
                          <button 
                            onClick={() => handleEditCampPackageClick(pkg)} 
                            className="flex items-center gap-1 px-3 py-1.5 border border-black/[0.08] hover:bg-[#FAF9F5] rounded-lg text-[11px] text-[#5A5550] font-semibold transition"
                          >
                            <Pencil className="w-3 h-3" />
                            Ubah
                          </button>
                          <button 
                            onClick={() => setDeleteCampPackageId(pkg.id || null)} 
                            className="flex items-center gap-1 px-3 py-1.5 border border-black/[0.08] hover:bg-red-50 rounded-lg text-[11px] text-red-600 font-semibold transition"
                          >
                            <Trash2 className="w-3 h-3" />
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))}
                    {campPackages.length === 0 && (
                      <div className="text-center py-12 text-[12.5px] text-[#7A7065]">
                        Belum ada paket camping terdaftar.
                      </div>
                    )}
                  </div>

                  {/* Table List for Desktop */}
                  <div className="hidden sm:block bg-white border border-black/[0.06] rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[650px]">
                        <thead>
                          <tr className="bg-[#FAF9F5] border-b border-black/[0.06] text-[#7A7065] text-[11px] font-bold uppercase tracking-wider">
                            <th className="py-3 px-4 font-bold">Nama Paket</th>
                            <th className="py-3 px-4 font-bold">Kapasitas</th>
                            <th className="py-3 px-4 font-bold">Harga</th>
                            <th className="py-3 px-4 font-bold">Fasilitas / Deskripsi</th>
                            <th className="py-3 px-4 font-bold text-center">Status</th>
                            <th className="py-3 px-4 font-bold text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-black/[0.04] text-[13px] text-[#2C2C2A]">
                          {campPackages.map((pkg) => (
                            <tr key={pkg.id} className="hover:bg-[#FAF9F5]/40 transition-colors">
                              <td className="py-4 px-4 font-bold">{pkg.name}</td>
                              <td className="py-4 px-4 text-[#5A5550]">{pkg.capacity}</td>
                              <td className="py-4 px-4 font-extrabold text-[#3A6520]">
                                Rp {pkg.price.toLocaleString("id-ID")}
                              </td>
                              <td className="py-4 px-4 text-[#5A5550] max-w-xs truncate" title={pkg.description}>
                                {pkg.description || "-"}
                              </td>
                              <td className="py-4 px-4 text-center">
                                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10.5px] font-bold ${
                                  pkg.active 
                                    ? "bg-green-50 text-green-700 border border-green-200" 
                                    : "bg-red-50 text-red-700 border border-red-200"
                                }`}>
                                  {pkg.active ? "Aktif" : "Nonaktif"}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <div className="flex justify-end gap-1.5">
                                  <button
                                    onClick={() => handleEditCampPackageClick(pkg)}
                                    className="p-2 border border-black/[0.08] hover:bg-[#FAF9F5] rounded text-[#7A7065] hover:text-[#2C2C2A] transition"
                                    title="Ubah"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setDeleteCampPackageId(pkg.id || null)}
                                    className="p-2 border border-black/[0.08] hover:bg-red-50 rounded text-red-500 hover:text-red-700 transition"
                                    title="Hapus"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {campPackages.length === 0 && (
                            <tr>
                              <td colSpan={6} className="text-center py-12 text-[#7A7065]">
                                Belum ada paket camping terdaftar.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-Section: Sewa Alat */}
              {activeCampTab === "sewa" && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div>
                      <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[16px] font-extrabold text-[#2C2C2A]">
                        Daftar Alat Sewa
                      </h2>
                      <p className="text-[12px] text-[#7A7065] mt-0.5">
                        Kelola inventaris dan tarif alat sewa untuk berkemah.
                      </p>
                    </div>
                    <button
                      onClick={() => { handleResetCampRentalForm(); setSection("add-camp-rental"); }}
                      className="flex items-center justify-center gap-2 bg-[#3A6520] text-white px-4 py-2.5 rounded-lg text-[12.5px] font-bold hover:bg-[#2D5016] shadow-sm transition w-full sm:w-auto self-stretch sm:self-auto"
                    >
                      <Plus className="w-4 h-4" />
                      Tambah Alat
                    </button>
                  </div>

                  {/* Card List for Mobile (No scroll) */}
                  <div className="block sm:hidden divide-y divide-black/[0.05] bg-white border border-black/[0.06] rounded-xl shadow-sm overflow-hidden">
                    {campRentals.map((rent) => (
                      <div key={rent.id} className="p-4 flex flex-col gap-2.5">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-bold text-[#2C2C2A] text-[13.5px] block">{rent.name}</span>
                            <span className="text-[11.5px] text-[#7A7065] block mt-0.5">Kategori: {rent.category}</span>
                          </div>
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            rent.active 
                              ? "bg-green-50 text-green-700 border border-green-200" 
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}>
                            {rent.active ? "Aktif" : "Nonaktif"}
                          </span>
                        </div>

                        <div className="text-[13px] font-extrabold text-[#3A6520]">
                          Rp {rent.price.toLocaleString("id-ID")}
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          <button 
                            onClick={() => handleEditCampRentalClick(rent)} 
                            className="flex items-center gap-1 px-3 py-1.5 border border-black/[0.08] hover:bg-[#FAF9F5] rounded-lg text-[11px] text-[#5A5550] font-semibold transition"
                          >
                            <Pencil className="w-3 h-3" />
                            Ubah
                          </button>
                          <button 
                            onClick={() => setDeleteCampRentalId(rent.id || null)} 
                            className="flex items-center gap-1 px-3 py-1.5 border border-black/[0.08] hover:bg-red-50 rounded-lg text-[11px] text-red-600 font-semibold transition"
                          >
                            <Trash2 className="w-3 h-3" />
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))}
                    {campRentals.length === 0 && (
                      <div className="text-center py-12 text-[12.5px] text-[#7A7065]">
                        Belum ada alat sewa terdaftar.
                      </div>
                    )}
                  </div>

                  {/* Table List for Desktop */}
                  <div className="hidden sm:block bg-white border border-black/[0.06] rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                          <tr className="bg-[#FAF9F5] border-b border-black/[0.06] text-[#7A7065] text-[11px] font-bold uppercase tracking-wider">
                            <th className="py-3 px-4 font-bold">Nama Alat</th>
                            <th className="py-3 px-4 font-bold">Kategori</th>
                            <th className="py-3 px-4 font-bold">Tarif Sewa</th>
                            <th className="py-3 px-4 font-bold text-center">Status</th>
                            <th className="py-3 px-4 font-bold text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-black/[0.04] text-[13px] text-[#2C2C2A]">
                          {campRentals.map((rent) => (
                            <tr key={rent.id} className="hover:bg-[#FAF9F5]/40 transition-colors">
                              <td className="py-4 px-4 font-bold">{rent.name}</td>
                              <td className="py-4 px-4 text-[#5A5550]">{rent.category}</td>
                              <td className="py-4 px-4 font-extrabold text-[#3A6520]">
                                Rp {rent.price.toLocaleString("id-ID")}
                              </td>
                              <td className="py-4 px-4 text-center">
                                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10.5px] font-bold ${
                                  rent.active 
                                    ? "bg-green-50 text-green-700 border border-green-200" 
                                    : "bg-red-50 text-red-700 border border-red-200"
                                }`}>
                                  {rent.active ? "Aktif" : "Nonaktif"}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <div className="flex justify-end gap-1.5">
                                  <button
                                    onClick={() => handleEditCampRentalClick(rent)}
                                    className="p-2 border border-black/[0.08] hover:bg-[#FAF9F5] rounded text-[#7A7065] hover:text-[#2C2C2A] transition"
                                    title="Ubah"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setDeleteCampRentalId(rent.id || null)}
                                    className="p-2 border border-black/[0.08] hover:bg-red-50 rounded text-red-500 hover:text-red-700 transition"
                                    title="Hapus"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {campRentals.length === 0 && (
                            <tr>
                              <td colSpan={5} className="text-center py-12 text-[#7A7065]">
                                Belum ada alat sewa terdaftar.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Section: Add/Edit Camp Package Form */}
          {section === "add-camp-package" && (
            <div className="bg-white border border-black/[0.06] rounded-xl shadow-sm p-5 sm:p-8 max-w-xl w-full">
              <button 
                onClick={() => { setSection("camp"); handleResetCampPackageForm(); }} 
                className="flex items-center gap-1 text-[#7A7065] hover:text-[#2C2C2A] text-[12.5px] font-semibold mb-8 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                Kembali ke Manajemen Camp
              </button>

              <form onSubmit={handleSubmitCampPackage} className="space-y-5">
                <div className="flex items-center gap-3 border-l-4 border-[#3A6520] pl-3 mb-6">
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[15px] font-bold text-[#2C2C2A]">
                    {editingCampPackageId ? "Ubah Paket Camping" : "Tambah Paket Camping Baru"}
                  </h3>
                </div>

                <div>
                  <label className="block text-[12.5px] font-semibold text-[#5A5550] mb-2">Nama Paket</label>
                  <input
                    type="text"
                    required
                    value={campPackageName}
                    onChange={(e) => setCampPackageName(e.target.value)}
                    placeholder="Contoh: Paket Small, Paket Medium"
                    className="w-full px-3.5 py-2.5 text-[13.5px] border border-black/[0.12] rounded-lg focus:outline-none focus:border-[#3A6520] focus:ring-1 focus:ring-[#3A6520] transition bg-[#FAF9F5]/30"
                  />
                </div>

                <div>
                  <label className="block text-[12.5px] font-semibold text-[#5A5550] mb-2">Kapasitas (Jumlah Orang)</label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      required
                      min="1"
                      value={campPackageCapacity}
                      onChange={(e) => setCampPackageCapacity(e.target.value)}
                      placeholder="Contoh: 4, 10"
                      className="w-full px-3.5 py-2.5 pr-16 text-[13.5px] border border-black/[0.12] rounded-lg focus:outline-none focus:border-[#3A6520] focus:ring-1 focus:ring-[#3A6520] transition bg-[#FAF9F5]/30 font-medium"
                    />
                    <span className="absolute right-4 text-[13px] text-[#7A7065] font-semibold select-none">Orang</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[12.5px] font-semibold text-[#5A5550] mb-2">Harga Paket (Rp)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={campPackagePrice}
                    onChange={(e) => setCampPackagePrice(e.target.value)}
                    placeholder="Contoh: 185000"
                    className="w-full px-3.5 py-2.5 text-[13.5px] border border-black/[0.12] rounded-lg focus:outline-none focus:border-[#3A6520] focus:ring-1 focus:ring-[#3A6520] transition bg-[#FAF9F5]/30"
                  />
                </div>

                <div>
                  <label className="block text-[12.5px] font-semibold text-[#5A5550] mb-2">Deskripsi / Fasilitas</label>
                  <textarea
                    rows={4}
                    value={campPackageDescription}
                    onChange={(e) => setCampPackageDescription(e.target.value)}
                    placeholder="Masukkan rincian fasilitas paket..."
                    className="w-full px-3.5 py-2.5 text-[13.5px] border border-black/[0.12] rounded-lg focus:outline-none focus:border-[#3A6520] focus:ring-1 focus:ring-[#3A6520] transition bg-[#FAF9F5]/30"
                  />
                </div>

                <div className="flex items-center gap-2 py-2">
                  <input
                    type="checkbox"
                    id="campPackageActive"
                    checked={campPackageActive}
                    onChange={(e) => setCampPackageActive(e.target.checked)}
                    className="w-4 h-4 text-[#3A6520] border-black/[0.15] rounded focus:ring-[#3A6520]"
                  />
                  <label htmlFor="campPackageActive" className="text-[13px] text-[#5A5550] font-medium cursor-pointer">
                    Aktifkan Paket (Tampilkan di halaman website)
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-black/[0.06]">
                  <button
                    type="button"
                    onClick={() => { setSection("camp"); handleResetCampPackageForm(); }}
                    className="px-5 py-2.5 border border-black/[0.1] text-[#7A7065] text-[13px] font-bold rounded-lg hover:bg-[#FAF9F5] transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submittingCampPackage}
                    className="px-6 py-2.5 bg-[#3A6520] text-white text-[13px] font-bold rounded-lg hover:bg-[#2D5016] shadow-sm transition disabled:opacity-50"
                  >
                    {submittingCampPackage ? "Menyimpan..." : "Simpan Paket"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Section: Add/Edit Camp Rental Form */}
          {section === "add-camp-rental" && (
            <div className="bg-white border border-black/[0.06] rounded-xl shadow-sm p-5 sm:p-8 max-w-xl w-full">
              <button 
                onClick={() => { setSection("camp"); handleResetCampRentalForm(); }} 
                className="flex items-center gap-1 text-[#7A7065] hover:text-[#2C2C2A] text-[12.5px] font-semibold mb-8 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                Kembali ke Manajemen Camp
              </button>

              <form onSubmit={handleSubmitCampRental} className="space-y-5">
                <div className="flex items-center gap-3 border-l-4 border-[#3A6520] pl-3 mb-6">
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[15px] font-bold text-[#2C2C2A]">
                    {editingCampRentalId ? "Ubah Informasi Alat Sewa" : "Tambah Alat Sewa Baru"}
                  </h3>
                </div>

                <div>
                  <label className="block text-[12.5px] font-semibold text-[#5A5550] mb-2">Nama Alat</label>
                  <input
                    type="text"
                    required
                    value={campRentalName}
                    onChange={(e) => setCampRentalName(e.target.value)}
                    placeholder="Contoh: Tenda Kapasitas 4 Orang, Matras (2m x 2m)"
                    className="w-full px-3.5 py-2.5 text-[13.5px] border border-black/[0.12] rounded-lg focus:outline-none focus:border-[#3A6520] focus:ring-1 focus:ring-[#3A6520] transition bg-[#FAF9F5]/30"
                  />
                </div>

                <div>
                  <label className="block text-[12.5px] font-semibold text-[#5A5550] mb-2">Kategori</label>
                  <select
                    value={campRentalCategory}
                    onChange={(e) => setCampRentalCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-[13.5px] border border-black/[0.12] rounded-lg focus:outline-none focus:border-[#3A6520] focus:ring-1 focus:ring-[#3A6520] bg-white transition"
                  >
                    <option value="Tenda & Perlengkapan Tidur">Tenda & Perlengkapan Tidur</option>
                    <option value="Peralatan Memasak">Peralatan Memasak</option>
                    <option value="Furnitur">Furnitur</option>
                    <option value="Lain-lain">Lain-lain</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12.5px] font-semibold text-[#5A5550] mb-2">Tarif Sewa (Rp)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={campRentalPrice}
                    onChange={(e) => setCampRentalPrice(e.target.value)}
                    placeholder="Contoh: 15000"
                    className="w-full px-3.5 py-2.5 text-[13.5px] border border-black/[0.12] rounded-lg focus:outline-none focus:border-[#3A6520] focus:ring-1 focus:ring-[#3A6520] transition bg-[#FAF9F5]/30"
                  />
                </div>

                <div className="flex items-center gap-2 py-2">
                  <input
                    type="checkbox"
                    id="campRentalActive"
                    checked={campRentalActive}
                    onChange={(e) => setCampRentalActive(e.target.checked)}
                    className="w-4 h-4 text-[#3A6520] border-black/[0.15] rounded focus:ring-[#3A6520]"
                  />
                  <label htmlFor="campRentalActive" className="text-[13px] text-[#5A5550] font-medium cursor-pointer">
                    Aktifkan Alat (Tampilkan di halaman website)
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-black/[0.06]">
                  <button
                    type="button"
                    onClick={() => { setSection("camp"); handleResetCampRentalForm(); }}
                    className="px-5 py-2.5 border border-black/[0.1] text-[#7A7065] text-[13px] font-bold rounded-lg hover:bg-[#FAF9F5] transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submittingCampRental}
                    className="px-6 py-2.5 bg-[#3A6520] text-white text-[13px] font-bold rounded-lg hover:bg-[#2D5016] shadow-sm transition disabled:opacity-50"
                  >
                    {submittingCampRental ? "Menyimpan..." : "Simpan Alat"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {section === "demographics" && (
            <div className="flex flex-col gap-6 w-full max-w-5xl">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                  <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[16px] font-extrabold text-[#2C2C2A]">
                    Data Statistik Demografi Dusun
                  </h2>
                  <p className="text-[12px] text-[#7A7065] mt-0.5">
                    Kelola data populasi, jumlah KK, peta wilayah, dan statistik dusun lainnya.
                  </p>
                </div>
                <button
                  onClick={() => { handleResetDemographicForm(); setSection("add-demographic"); }}
                  className="flex items-center justify-center gap-2 bg-[#3A6520] text-white px-4 py-2.5 rounded-lg text-[12.5px] font-bold hover:bg-[#2D5016] shadow-sm transition w-full sm:w-auto self-stretch sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Data
                </button>
              </div>

              {loadingDemographics ? (
                <div className="bg-white border border-black/[0.06] rounded-xl p-12 text-center shadow-sm">
                  <div className="text-[13.5px] text-[#7A7065]">Memuat data...</div>
                </div>
              ) : (
                <div className="bg-white border border-black/[0.06] rounded-xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[500px]">
                      <thead>
                        <tr className="bg-[#FAF9F5] border-b border-black/[0.06] text-[11px] font-bold text-[#7A7065] uppercase tracking-wider">
                          <th className="py-3 px-5 w-16">Ikon</th>
                          <th className="py-3 px-5">Label / Data</th>
                          <th className="py-3 px-5">Nilai</th>
                          <th className="py-3 px-5 w-28 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/[0.05] text-[13px]">
                        {demographics.map((demo) => (
                          <tr key={demo.id} className="hover:bg-[#FAF9F5]/40 transition">
                            <td className="py-4 px-5">
                              <div className="w-9 h-9 rounded-lg bg-[#3A6520]/8 flex items-center justify-center text-[#3A6520]">
                                {demo.icon === "Users" && <Users className="w-4 h-4" />}
                                {demo.icon === "Home" && <Home className="w-4 h-4" />}
                                {demo.icon === "Map" && <MapPin className="w-4 h-4" />}
                                {demo.icon === "Building2" && <Building2 className="w-4 h-4" />}
                              </div>
                            </td>
                            <td className="py-4 px-5 font-semibold text-[#2C2C2A]">{demo.label}</td>
                            <td className="py-4 px-5 font-bold text-[#3A6520] text-[14px]">{demo.value}</td>
                            <td className="py-4 px-5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleEditDemographic(demo)}
                                  className="p-1.5 text-[#5A5550] hover:text-[#2C2C2A] hover:bg-black/5 rounded transition"
                                  title="Ubah"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setDeleteDemographicId(demo.id || null)}
                                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition"
                                  title="Hapus"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {demographics.length === 0 && (
                          <tr>
                            <td colSpan={4} className="py-8 text-center text-[13px] text-[#7A7065]">
                              Belum ada data demografi terdaftar.
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

          {/* Section: Add/Edit Demographic Form */}
          {section === "add-demographic" && (
            <div className="bg-white border border-black/[0.06] rounded-xl shadow-sm p-5 sm:p-8 max-w-xl w-full">
              <button 
                onClick={() => { setSection("demographics"); handleResetDemographicForm(); }} 
                className="flex items-center gap-1 text-[#7A7065] hover:text-[#2C2C2A] text-[12.5px] font-semibold mb-8 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                Kembali ke Manajemen Data
              </button>

              <form onSubmit={handleSubmitDemographic} className="space-y-5">
                <div className="flex items-center gap-3 border-l-4 border-[#3A6520] pl-3 mb-6">
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[15px] font-bold text-[#2C2C2A]">
                    {editingDemographicId ? "Ubah Data Dusun" : "Tambah Data Dusun Baru"}
                  </h3>
                </div>

                <div>
                  <label className="block text-[12.5px] font-semibold text-[#5A5550] mb-2">Ikon Representasi</label>
                  <select
                    value={demographicIcon}
                    onChange={(e) => setDemographicIcon(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-[13.5px] border border-black/[0.12] rounded-lg focus:outline-none focus:border-[#3A6520] focus:ring-1 focus:ring-[#3A6520] bg-white transition"
                  >
                    <option value="Users">Penduduk (Ikon Orang/Masyarakat)</option>
                    <option value="Home">Hunian (Ikon Rumah/KK)</option>
                    <option value="Map">Geografis (Ikon Peta/Pin Wilayah)</option>
                    <option value="Building2">Administrasi (Ikon Kantor/RT/RW)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12.5px] font-semibold text-[#5A5550] mb-2">Nama Parameter (Label)</label>
                  <input
                    type="text"
                    required
                    value={demographicLabel}
                    onChange={(e) => setDemographicLabel(e.target.value)}
                    placeholder="Contoh: Jiwa Penduduk, Kepala Keluarga, Luas Wilayah"
                    className="w-full px-3.5 py-2.5 text-[13.5px] border border-black/[0.12] rounded-lg focus:outline-none focus:border-[#3A6520] focus:ring-1 focus:ring-[#3A6520] transition bg-[#FAF9F5]/30"
                  />
                </div>

                <div>
                  <label className="block text-[12.5px] font-semibold text-[#5A5550] mb-2">Nilai Data (Value)</label>
                  <input
                    type="text"
                    required
                    value={demographicValue}
                    onChange={(e) => setDemographicValue(e.target.value)}
                    placeholder="Contoh: 3.247, 892, 485 Ha, 1 RW / 2 RT"
                    className="w-full px-3.5 py-2.5 text-[13.5px] border border-black/[0.12] rounded-lg focus:outline-none focus:border-[#3A6520] focus:ring-1 focus:ring-[#3A6520] transition bg-[#FAF9F5]/30"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-black/[0.06]">
                  <button
                    type="button"
                    onClick={() => { setSection("demographics"); handleResetDemographicForm(); }}
                    className="px-5 py-2.5 border border-black/[0.1] text-[#7A7065] text-[13px] font-bold rounded-lg hover:bg-[#FAF9F5] transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submittingDemographic}
                    className="px-6 py-2.5 bg-[#3A6520] text-white text-[13px] font-bold rounded-lg hover:bg-[#2D5016] shadow-sm transition disabled:opacity-50"
                  >
                    {submittingDemographic ? "Menyimpan..." : "Simpan Data"}
                  </button>
                </div>
              </form>
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
                      onDragOver={handleLiveinDragOver}
                      onDragEnter={handleLiveinDragEnter}
                      onDragLeave={handleLiveinDragLeave}
                      onDrop={handleLiveinDrop}
                      className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center h-48 ${
                        isDraggingLiveinCover 
                          ? "border-[#3A6520] bg-[#3A6520]/5 scale-[0.99]" 
                          : "border-black/[0.09] bg-[#FAF9F5] hover:border-black/20"
                      }`}
                    >
                      {liveinCoverImage ? (
                        <div className="relative w-full h-full">
                          <img src={liveinCoverImage} alt="" className="w-full h-full object-cover rounded shadow-sm" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center text-white text-[11px] font-medium rounded">
                            Klik atau seret file ke sini untuk mengganti gambar
                          </div>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-[#B8AFA3] mb-2" />
                          <span className="text-[12px] font-bold text-[#2C2C2A] block">Unggah Gambar Homestay</span>
                          <span className="text-[11px] text-[#7A7065] mt-1">Klik untuk memilih atau seret file gambar ke sini</span>
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
                        <option value="orang">orang</option>
                        <option value="malam">malam</option>
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

                <button onClick={() => setSection("add-doc")} className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#3A6520] hover:bg-[#2D5016] text-white text-[12.5px] font-semibold rounded-full shadow-sm transition w-full sm:w-auto shrink-0">
                  <Plus className="w-4 h-4" />
                  Tambah Dokumentasi
                </button>
              </div>

              {/* Card list for Mobile (No scroll) */}
              <div className="block sm:hidden divide-y divide-black/[0.05]">
                {filteredDocs.map((doc, idx) => (
                  <div key={doc.id || idx} className="p-4 flex items-start gap-3.5">
                    <img src={doc.image_url} alt="" className="w-16 h-12 object-cover bg-[#D4C9B5] rounded shrink-0 border border-black/[0.05]" />
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-[#2C2C2A] text-[13.5px] block truncate">{doc.title}</span>
                      <span className="text-[12px] text-[#7A7065] block mt-0.5 truncate">{doc.description}</span>
                      <div className="flex items-center gap-2 mt-2.5">
                        <button 
                          onClick={() => handleEditDocClick(doc)} 
                          className="flex items-center gap-1 px-3 py-1.5 border border-black/[0.08] hover:bg-[#FAF9F5] rounded-lg text-[11px] text-[#5A5550] font-semibold transition"
                        >
                          <Pencil className="w-3 h-3" />
                          Ubah
                        </button>
                        <button 
                          onClick={() => setDeleteId(doc.id)} 
                          className="flex items-center gap-1 px-3 py-1.5 border border-black/[0.08] hover:bg-red-50 rounded-lg text-[11px] text-red-600 font-semibold transition"
                        >
                          <Trash2 className="w-3 h-3" />
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredDocs.length === 0 && (
                  <div className="text-center py-12 text-[12.5px] text-[#7A7065]">
                    Tidak ada dokumentasi kegiatan ditemukan.
                  </div>
                )}
              </div>

              {/* Table list for Desktop */}
              <div className="hidden sm:block overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[600px]">
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
                          <span className="text-[12px] text-[#7A7065] block max-w-[150px] sm:max-w-xs md:max-w-md truncate">{doc.description}</span>
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

      {/* Delete Camp Package modal */}
      {deleteCampPackageId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-sm">
          <div className="bg-white rounded-xl border border-black/[0.08] shadow-lg p-7 w-80 flex flex-col gap-5">
            <div>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[16px] font-bold text-[#2C2C2A] mb-1.5">Hapus Paket Camp?</h3>
              <p className="text-[13px] text-[#7A7065] leading-relaxed">Tindakan ini tidak dapat dibatalkan. Paket camp ini akan dihapus secara permanen.</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleDeleteCampPackage(deleteCampPackageId)} 
                disabled={isDeletingCampPkg}
                className="flex-1 py-2.5 bg-red-500 text-white text-[13px] font-semibold rounded-full hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeletingCampPkg ? "Menghapus..." : "Ya, Hapus"}
              </button>
              <button 
                onClick={() => setDeleteCampPackageId(null)} 
                disabled={isDeletingCampPkg}
                className="flex-1 py-2.5 border border-black/[0.12] text-[#5A5550] text-[13px] font-medium rounded-full hover:bg-[#F0EBE3] transition-colors cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Camp Rental modal */}
      {deleteCampRentalId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-sm">
          <div className="bg-white rounded-xl border border-black/[0.08] shadow-lg p-7 w-80 flex flex-col gap-5">
            <div>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[16px] font-bold text-[#2C2C2A] mb-1.5">Hapus Alat Sewa?</h3>
              <p className="text-[13px] text-[#7A7065] leading-relaxed">Tindakan ini tidak dapat dibatalkan. Alat sewa ini akan dihapus secara permanen.</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleDeleteCampRental(deleteCampRentalId)} 
                disabled={isDeletingCampRental}
                className="flex-1 py-2.5 bg-red-500 text-white text-[13px] font-semibold rounded-full hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeletingCampRental ? "Menghapus..." : "Ya, Hapus"}
              </button>
              <button 
                onClick={() => setDeleteCampRentalId(null)} 
                disabled={isDeletingCampRental}
                className="flex-1 py-2.5 border border-black/[0.12] text-[#5A5550] text-[13px] font-medium rounded-full hover:bg-[#F0EBE3] transition-colors cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Demographic modal */}
      {deleteDemographicId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-sm">
          <div className="bg-white rounded-xl border border-black/[0.08] shadow-lg p-7 w-80 flex flex-col gap-5">
            <div>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[16px] font-bold text-[#2C2C2A] mb-1.5">Hapus Data Dusun?</h3>
              <p className="text-[13px] text-[#7A7065] leading-relaxed">Tindakan ini tidak dapat dibatalkan. Data dusun ini akan dihapus secara permanen.</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleDeleteDemographic(deleteDemographicId)} 
                disabled={isDeletingDemographic}
                className="flex-1 py-2.5 bg-red-500 text-white text-[13px] font-semibold rounded-full hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeletingDemographic ? "Menghapus..." : "Ya, Hapus"}
              </button>
              <button 
                onClick={() => setDeleteDemographicId(null)} 
                disabled={isDeletingDemographic}
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
