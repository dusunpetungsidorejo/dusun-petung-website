import React, { useState, useEffect } from "react";
import { 
  Home, 
  Users, 
  MapPin, 
  Phone, 
  Check, 
  Clock, 
  ArrowRight, 
  Search, 
  Filter, 
  X, 
  DollarSign, 
  Info,
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Wifi,
  Utensils,
  Car,
  Droplets,
  Heart
} from "lucide-react";
import { Page, LiveInHouse } from "../types";
import { SiteFooter } from "../components/SiteFooter";

interface LiveInPageProps {
  nav: (p: Page) => void;
  settings: any;
}

export function LiveInPage({ nav, settings }: LiveInPageProps) {
  const [houses, setHouses] = useState<LiveInHouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedHouse, setSelectedHouse] = useState<LiveInHouse | null>(null);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPackage, setFilterPackage] = useState<"all" | "overnight" | "hour24">("all");
  const [filterCapacity, setFilterCapacity] = useState<number>(0);

  // Modal Gallery State
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  const fetchHouses = async () => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/livein`);
      if (!res.ok) throw new Error("Gagal memuat data dari server");
      const data = await res.json();
      // Filter out Inactive houses for public view
      const activeHouses = data.filter((h: LiveInHouse) => h.status !== "Inactive");
      setHouses(activeHouses);
    } catch (err: any) {
      console.error("Failed to fetch Live In houses:", err);
      setError("Tidak dapat memuat data homestay saat ini. Silakan periksa koneksi internet Anda atau coba sesaat lagi.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Live In Houses from API
  useEffect(() => {
    fetchHouses();
  }, []);

  // Format phone number for WhatsApp
  const phoneVal = settings?.phone_number || "085138097972";
  let formattedPhone = phoneVal.replace(/[^0-9]/g, "");
  if (formattedPhone.startsWith("0")) {
    formattedPhone = "62" + formattedPhone.slice(1);
  }
  const defaultWaUrl = formattedPhone ? `https://wa.me/${formattedPhone}` : "https://wa.me/6285138097972";

  // Create customized WhatsApp booking URL
  const getWhatsAppBookingUrl = (house: LiveInHouse, packageType: "overnight" | "hour24") => {
    const text = `Halo, saya tertarik untuk memesan Live In di:
*${house.name}* (Pemilik: ${house.owner})

Pilihan Paket: ${packageType === "hour24" ? "Paket 24 Jam (Makan + Aktivitas)" : "Paket Menginap Biasa"}
Kapasitas Tamu: ${house.min_guests || 1} - ${house.max_guests || 10} orang

Apakah terdapat ketersediaan jadwal untuk waktu dekat?`;
    
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`;
  };

  // Facility helper for matching icons
  const getFacilityIcon = (facility: string) => {
    const norm = facility.toLowerCase();
    if (norm.includes("kamar tidur") || norm.includes("bedroom")) return Home;
    if (norm.includes("kamar mandi") || norm.includes("bathroom")) return Droplets;
    if (norm.includes("dapur") || norm.includes("kitchen")) return Utensils;
    if (norm.includes("sarapan") || norm.includes("breakfast") || norm.includes("drink")) return Coffee;
    if (norm.includes("wifi")) return Wifi;
    if (norm.includes("parkir") || norm.includes("parking")) return Car;
    return Check;
  };

  // Filtered houses logic
  const filteredHouses = houses.filter(house => {
    const matchesSearch = 
      house.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      house.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (house.description || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPackage = 
      filterPackage === "all" ||
      (filterPackage === "overnight" && house.overnight_active) ||
      (filterPackage === "hour24" && house.hour24_active);

    const matchesCapacity = 
      filterCapacity === 0 || 
      (house.min_guests && house.min_guests <= filterCapacity && house.max_guests && house.max_guests >= filterCapacity);

    return matchesSearch && matchesPackage && matchesCapacity;
  }).sort((a, b) => {
    if (a.status === "Available" && b.status !== "Available") return -1;
    if (a.status !== "Available" && b.status === "Available") return 1;
    return 0;
  });

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-12 h-auto sm:py-0 sm:h-[40vh] sm:min-h-[330px]">
        <img
          src="https://images.unsplash.com/photo-1566205865731-51803de32a35?w=1600&h=900&fit=crop&auto=format"
          alt="Suasana pedesaan lereng Gunung Merapi dengan pepohonan hijau rindang"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/52" />
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 flex flex-col justify-end h-auto sm:h-full pb-0 sm:pb-20">
          <span className="text-white/50 text-[11px] font-bold tracking-[0.18em] uppercase block mb-2">
            Live In Experience · Dusun Petung
          </span>
          <h1
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.85rem, 3.8vw, 2.65rem)", lineHeight: 1.15 }}
            className="font-extrabold text-white mb-2"
          >
            Menyatu dengan Kehidupan Dusun
          </h1>
          <p className="text-white/65 text-[13px] sm:text-[14px] leading-[1.65] mb-4" style={{ maxWidth: 460 }}>
            Undangan membaur dalam kehangatan keluarga lokal, belajar bertani, dan merangkul kedamaian kaki Merapi.
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            <a
              href="#rumah-warga"
              className="px-4.5 py-2 bg-[#3A6520] text-white text-[12px] font-semibold rounded-full hover:bg-[#2D5016] transition-colors"
            >
              Pilih Rumah Warga
            </a>
            <a
              href={`${defaultWaUrl}?text=Halo,%20saya%20tertarik%20bertanya%20mengenai%20kegiatan%20Live%20In%20di%20Dusun%20Petung`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4.5 py-2 bg-white/12 text-white text-[12px] font-semibold rounded-full border border-white/25 hover:bg-white/22 transition-colors backdrop-blur-sm"
            >
              <Phone className="w-3.5 h-3.5" strokeWidth={2} />
              Tanya Pengelola
            </a>
          </div>
        </div>
      </section>

      {/* Concept Philosophy Section */}
      <section className="py-8 lg:py-16 bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-16 lg:gap-24 items-center">
            
            {/* Left Content */}
            <div>
              <span className="text-[#C97C2A] text-[11px] font-bold tracking-[0.18em] uppercase block mb-5">
                Konsep & Nilai Kami
              </span>
              <h2
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(2rem, 3.5vw, 2.75rem)", lineHeight: 1.15 }}
                className="font-extrabold text-[#2C2C2A] mb-8"
              >
                Menjadi Bagian dari <br />Keluarga Kami
              </h2>
              
              <div className="space-y-6 text-[#5A5550] text-[15px] leading-[1.75]">
                <p>
                  Di Dusun Petung, kami percaya bahwa pariwisata terbaik adalah pariwisata yang mendekatkan hati ke hati. Fitur <strong>Live In</strong> kami rancang agar para pelancong perkotaan dapat melepaskan penat dan kembali terhubung dengan alam serta kebiasaan hidup bersahaja.
                </p>
                <p>
                  Setiap rumah warga yang terdaftar telah dikurasi agar menjamin kenyamanan mendasar Anda, namun tetap mempertahankan keaslian bentuk hunian lereng Merapi. Anda tidak akan menemukan kemewahan hotel berbintang, melainkan kemewahan obrolan hangat malam hari di bale-bale bambu sembari menikmati teh jahe hangat buatan simbah.
                </p>
              </div>

              {/* Three Value Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-2 pt-8 border-t border-black/[0.06]">
                <div>
                  <span className="block text-[#3A6520] font-bold text-[17px] mb-2">01. Autentik</span>
                  <span className="block text-[13px] text-[#7A7065] leading-relaxed">Menjalani rutinitas riil warga dusun tanpa skenario.</span>
                </div>
                <div>
                  <span className="block text-[#3A6520] font-bold text-[17px] mb-2">02. Gotong Royong</span>
                  <span className="block text-[13px] text-[#7A7065] leading-relaxed">Kontribusi langsung pada ekonomi mandiri masyarakat.</span>
                </div>
                <div>
                  <span className="block text-[#3A6520] font-bold text-[17px] mb-2">03. Edukatif</span>
                  <span className="block text-[13px] text-[#7A7065] leading-relaxed">Mempelajari cara bercocok tanam dan kearifan lereng gunung.</span>
                </div>
              </div>
            </div>

            {/* Right Side Image Collage */}
            <div className="relative">
              <div className="bg-[#D4C9B5] rounded-lg overflow-hidden shadow-sm aspect-[4/5] sm:aspect-square md:aspect-[4/3] lg:aspect-[4/5]">
                <img
                  src="https://images.unsplash.com/photo-1542897643-cfccd88c7127?w=800&h=1000&fit=crop&auto=format"
                  alt="Warga dusun tersenyum memegang cangkir tradisional"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-5 border border-black/[0.05] rounded-xl shadow-md max-w-[240px] hidden sm:block">
                <Heart className="w-6 h-6 text-[#C97C2A] mb-3" />
                <span className="block text-[13.5px] font-bold text-[#2C2C2A] mb-1">Dikelola Komunitas</span>
                <span className="block text-[11px] text-[#7A7065] leading-relaxed">100% pendapatan disalurkan langsung ke pemilik rumah.</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Explorer / Houses Section */}
      <section id="rumah-warga" className="py-8 lg:py-16 bg-[#F7F4EF] border-t border-black/[0.04]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          {/* Section title */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#C97C2A] text-[11px] font-bold tracking-[0.18em] uppercase block mb-4">
              Daftar Akomodasi
            </span>
            <h2
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              className="text-[28px] sm:text-[38px] font-extrabold text-[#2C2C2A] leading-tight mb-5"
            >
              Pilih Rumah & Tuan Rumah Anda
            </h2>
            <p className="text-[14.5px] text-[#7A7065] leading-relaxed">
              Cari dan filter berdasarkan paket menginap yang Anda kehendaki serta jumlah rombongan yang ikut serta.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="bg-white border border-black/[0.05] rounded-2xl shadow-sm p-4 sm:p-6 mb-12 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
              {/* Search */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-[#B8AFA3]" />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Cari nama rumah / pemilik..."
                  className="w-full pl-9 pr-4 py-2.5 bg-[#FAF9F5] border border-black/[0.06] rounded-xl text-[12.5px] text-[#2C2C2A] outline-none focus:ring-1 focus:ring-[#3A6520]/25 transition"
                />
              </div>

              {/* Package filter */}
              <div className="relative flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-[#7A7065] shrink-0" />
                <select
                  value={filterPackage}
                  onChange={e => setFilterPackage(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-[#FAF9F5] border border-black/[0.06] rounded-xl text-[12.5px] text-[#5A5550] outline-none"
                >
                  <option value="all">Semua Jenis Paket</option>
                  <option value="overnight">Paket Menginap Biasa</option>
                  <option value="hour24">Paket 24 Jam</option>
                </select>
              </div>

              {/* Capacity filter */}
              <div className="relative flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-[#7A7065] shrink-0" />
                <select
                  value={filterCapacity}
                  onChange={e => setFilterCapacity(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-[#FAF9F5] border border-black/[0.06] rounded-xl text-[12.5px] text-[#5A5550] outline-none"
                >
                  <option value={0}>Jumlah Tamu (Semua)</option>
                  <option value={1}>1 Orang</option>
                  <option value={2}>2 Orang</option>
                  <option value={4}>4 Orang</option>
                  <option value={6}>6+ Orang</option>
                </select>
              </div>
            </div>

            {/* Clear filters button */}
            {(searchQuery !== "" || filterPackage !== "all" || filterCapacity !== 0) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterPackage("all");
                  setFilterCapacity(0);
                }}
                className="px-4 py-2 border border-black/[0.08] text-[12px] text-[#7A7065] hover:text-[#2C2C2A] hover:bg-[#FAF9F5] rounded-full transition self-end lg:self-auto"
              >
                Hapus Filter
              </button>
            )}

          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-8 h-8 border-4 border-[#3A6520] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-[13px] text-[#7A7065]">Memuat data akomodasi warga...</p>
            </div>
          ) : error ? (
            <div className="bg-white border border-black/[0.05] rounded-2xl p-12 text-center shadow-sm max-w-md mx-auto my-8">
              <span className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-100/50">
                <Info className="w-6 h-6" />
              </span>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[16px] font-bold text-[#2C2C2A] mb-2">Gagal Memuat Data</h3>
              <p className="text-[13px] text-[#7A7065] mb-5 leading-relaxed">{error}</p>
              <button
                onClick={fetchHouses}
                className="px-5 py-2.5 bg-[#3A6520] hover:bg-[#2D5016] text-white text-[12px] font-semibold rounded-full shadow-md transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          ) : filteredHouses.length === 0 ? (
            <div className="bg-white border border-black/[0.05] rounded-2xl p-16 text-center shadow-sm">
              <Home className="w-10 h-10 text-[#B8AFA3] mx-auto mb-4" />
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[16px] font-bold text-[#2C2C2A] mb-1">Tidak Ada Rumah Ditemukan</h3>
              <p className="text-[13px] text-[#7A7065] max-w-sm mx-auto">Kami tidak menemukan rumah yang sesuai dengan pencarian atau filter Anda. Coba reset filter pencarian.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
              {filteredHouses.map((house) => {
                // Determine display price
                let displayPrice = "";
                if (house.overnight_active && house.overnight_price) {
                  displayPrice = `Rp ${house.overnight_price.toLocaleString("id-ID")}`;
                } else if (house.hour24_active && house.hour24_price) {
                  displayPrice = `Rp ${house.hour24_price.toLocaleString("id-ID")}`;
                }

                return (
                  <div 
                    key={house.id}
                    className="bg-white border border-black/[0.06] rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.01] transition-all flex flex-col h-full group"
                  >
                    {/* Cover image & status badge */}
                    <div className="relative aspect-[3/2] w-full overflow-hidden bg-[#FAF9F5] shrink-0">
                      {house.cover_image ? (
                        <img 
                          src={house.cover_image} 
                          alt={house.name} 
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#B8AFA3]">
                          <Home className="w-10 h-10" />
                        </div>
                      )}
                      
                      {/* Status Badges */}
                      <span className={`absolute top-3 left-3 sm:top-4 sm:left-4 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold shadow-sm ${
                        house.status === "Available" ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                      }`}>
                        {house.status === "Available" ? "Tersedia" : "Penuh"}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="p-3 sm:p-5 flex flex-col flex-1">
                      <div className="flex-1">
                        {/* Title & Host info */}
                        <span className="block text-[9px] sm:text-[11px] font-semibold text-[#C97C2A] uppercase tracking-wider mb-0.5 sm:mb-1">
                          Tuan Rumah: {house.owner}
                        </span>
                        <h3 
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} 
                          className="text-[13px] sm:text-[17px] font-bold text-[#2C2C2A] group-hover:text-[#3A6520] transition-colors leading-snug mb-2 sm:mb-3 line-clamp-1 sm:line-clamp-2"
                        >
                          {house.name}
                        </h3>

                        {/* Highlight text if any */}
                        {house.highlight && (
                          <div className="inline-flex items-center gap-0.5 bg-[#FAF9F5] border border-[#3A6520]/15 rounded-md px-1.5 py-0.5 mb-2.5 sm:mb-4">
                            <Sparkles className="w-2.5 h-2.5 text-[#C97C2A]" />
                            <span className="text-[9px] sm:text-[10px] font-semibold text-[#3A6520]">{house.highlight}</span>
                          </div>
                        )}

                        <p className="text-[11px] sm:text-[13px] text-[#5A5550] leading-relaxed line-clamp-2 sm:line-clamp-3 mb-4 sm:mb-6">
                          {house.description}
                        </p>
                      </div>

                      {/* Card Footer detail info */}
                      <div className="pt-3 sm:pt-4 border-t border-black/[0.05] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
                        <div>
                          <span className="block text-[8px] sm:text-[10px] text-[#7A7065] uppercase font-semibold">Mulai Dari</span>
                          <span className="block text-[12px] sm:text-[14px] font-bold text-[#3A6520] leading-none">
                            {displayPrice}
                            <span className="text-[9px] sm:text-[11px] font-normal text-[#7A7065]"> / {house.pricing_type === "person" ? "orang" : "malam"}</span>
                          </span>
                        </div>
                        
                        <button
                          onClick={() => {
                            setSelectedHouse(house);
                            setActiveGalleryIndex(0);
                          }}
                          className="flex items-center justify-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-[#3A6520] hover:bg-[#2D5016] text-white text-[10px] sm:text-[11.5px] font-semibold rounded-full transition-colors w-full sm:w-auto"
                        >
                          Detail
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* Experience Showcase (Bertani, Kuliner, dll) */}
      <section className="py-8 lg:py-16 bg-[#FAF9F5] border-t border-black/[0.04]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="flex flex-col lg:flex-row items-stretch lg:items-end justify-between mb-16 gap-4">
            <div>
              <span className="text-[#C97C2A] text-[11px] font-bold tracking-[0.18em] uppercase block mb-4">
                Aktivitas & Tradisi
              </span>
              <h2
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(2rem, 3.5vw, 2.75rem)", lineHeight: 1.15 }}
                className="font-extrabold text-[#2C2C2A]"
              >
                Kegiatan Keseharian <br />yang Dapat Diikuti
              </h2>
            </div>
            <p className="text-[14.5px] text-[#7A7065] max-w-md leading-relaxed">
              Selama menginap, Anda diundang secara sukarela untuk turut serta dalam denyut kehidupan harian warga lokal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Bertani & Berkebun",
                desc: "Turun ke sawah lereng Merapi, belajar bercocok tanam padi, mencangkul, atau memetik buah kopi segar langsung dari kebun pekarangan.",
                img: "https://images.unsplash.com/photo-1572908721147-0a9eb395762d?w=600&h=420&fit=crop&auto=format"
              },
              {
                title: "Kuliner Pawon Tradisional",
                desc: "Memasak makanan tradisional dengan bahan sayur organik segar yang Anda petik sendiri, dimasak di tungku api berbahan kayu bakar khas pedesaan.",
                img: "https://images.unsplash.com/photo-1623042392888-1f87e36a5b64?w=600&h=420&fit=crop&auto=format"
              },
              {
                title: "Mengurus Hewan Ternak",
                desc: "Ikut memandikan kambing atau menyuapkan pakan rumput segar untuk sapi perah di pagi hari bersama pemuda karang taruna dusun.",
                img: "https://images.unsplash.com/photo-1650247452475-b5866374545d?w=600&h=420&fit=crop&auto=format"
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white border border-black/[0.05] rounded-2xl overflow-hidden shadow-sm flex flex-col h-full">
                <div className="aspect-[4/3] w-full bg-[#FAF9F5] overflow-hidden">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[16px] font-bold text-[#2C2C2A] mb-2.5">
                      {item.title}
                    </h4>
                    <p className="text-[13px] text-[#7A7065] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Guide Lines & FAQ */}
      <section className="py-8 lg:py-16 bg-[#F7F4EF] border-t border-black/[0.04]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            <div>
              <span className="text-[#C97C2A] text-[11px] font-bold tracking-[0.18em] uppercase block mb-4">
                Panduan Menginap
              </span>
              <h2
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.75rem, 3vw, 2.5rem)", lineHeight: 1.15 }}
                className="font-extrabold text-[#2C2C2A] mb-8"
              >
                Hal Penting Sebelum <br />Anda Bertamu
              </h2>
              <p className="text-[14px] text-[#7A7065] leading-relaxed mb-6">
                Untuk menjaga kenyamanan bersama dan adat istiadat dusun, kami memohon agar setiap pengunjung memperhatikan beberapa panduan mendasar berikut.
              </p>
              
              <div className="space-y-4">
                {[
                  { title: "Bawa Pakaian Hangat", desc: "Dusun Petung berada di lereng tinggi Gunung Merapi, udara malam dan pagi hari cukup dingin." },
                  { title: "Sopan Santun & Ramah", desc: "Saling menyapa ketika berpapasan dengan warga dusun merupakan tradisi mulia yang kami junjung tinggi." },
                  { title: "Konsumsi Makanan Lokal", desc: "Nikmati hidangan lokal yang dimasak oleh tuan rumah untuk merasakan kearifan rasa yang otentik." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-[#3A6520]/8 flex items-center justify-center text-[#3A6520] font-bold text-[11px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="block text-[13.5px] font-bold text-[#2C2C2A] mb-1">{item.title}</span>
                      <span className="block text-[12px] text-[#7A7065] leading-relaxed">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-black/[0.06] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[16px] font-bold text-[#2C2C2A] pb-4 border-b border-black/[0.05]">
                Pertanyaan Umum (FAQ)
              </h3>
              
              <div className="space-y-4">
                {[
                  { q: "Apakah kamar mandi di dalam rumah?", a: "Mayoritas rumah warga memiliki kamar mandi di dalam rumah, beberapa memiliki kamar mandi pribadi tepat di sebelah samping teras luar." },
                  { q: "Bagaimana dengan konsumsi makanan?", a: "Jika mengambil Paket 24 Jam, makan 3x sehari telah disediakan oleh pemilik rumah. Jika mengambil Paket Overnight biasa, Anda bisa berkoordinasi langsung dengan tuan rumah." },
                  { q: "Apakah anak-anak diperbolehkan ikut?", a: "Sangat diperbolehkan. Ini adalah sarana edukasi yang sangat mendidik bagi anak-anak untuk mengenal alam pedesaan." }
                ].map((faq, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <span className="block text-[13px] font-bold text-[#2C2C2A]">Q: {faq.q}</span>
                    <p className="text-[12px] text-[#7A7065] leading-relaxed">A: {faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* House Details Modal */}
      {selectedHouse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/40 backdrop-blur-sm">
          
          <div className="bg-white border border-black/[0.08] shadow-2xl rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-black/[0.06] flex items-center justify-between shrink-0 bg-[#FAF9F5]">
              <div>
                <span className="block text-[10px] font-semibold text-[#C97C2A] uppercase tracking-wider">
                  Tuan Rumah: {selectedHouse.owner}
                </span>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[17px] font-bold text-[#2C2C2A]">
                  {selectedHouse.name}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedHouse(null)}
                className="p-1.5 rounded-full hover:bg-black/5 text-[#7A7065] hover:text-[#2C2C2A] transition"
                title="Tutup Detail"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                
                {/* Left Column (Photos, Capacity, Facilities, Experiences) */}
                <div className="md:col-span-7 space-y-6">
                  
                  {/* Photo Viewer (Cover + Gallery) */}
                  <div className="space-y-3">
                    <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-[#FAF9F5] border border-black/[0.06]">
                      {/* Big Image Viewer */}
                      {(() => {
                        const allPhotos = [selectedHouse.cover_image, ...(selectedHouse.gallery || [])].filter(Boolean);
                        const activeUrl = allPhotos[activeGalleryIndex] || selectedHouse.cover_image;

                        const handlePrev = (e: React.MouseEvent) => {
                          e.stopPropagation();
                          if (activeGalleryIndex > 0) {
                            setActiveGalleryIndex((prev) => prev - 1);
                          }
                        };

                        const handleNext = (e: React.MouseEvent) => {
                          e.stopPropagation();
                          if (activeGalleryIndex < allPhotos.length - 1) {
                            setActiveGalleryIndex((prev) => prev + 1);
                          }
                        };

                        return (
                          <div className="relative w-full h-full group/viewer">
                            {activeUrl ? (
                              <img src={activeUrl} alt="" className="w-full h-full object-cover transition-all duration-300" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#B8AFA3]">
                                <Home className="w-12 h-12" />
                              </div>
                            )}

                            {/* Mobile Scroll Down Prompt Overlay */}
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[10px] font-medium px-3 py-1 rounded-full backdrop-blur-sm flex items-center gap-1 animate-pulse md:hidden pointer-events-none">
                              <span>Lihat detail di bawah</span>
                              <span className="text-[11px] font-bold">↓</span>
                            </div>

                            {/* Navigation Arrows */}
                            {allPhotos.length > 1 && (
                              <>
                                {activeGalleryIndex > 0 && (
                                  <button
                                    onClick={handlePrev}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm opacity-100 md:opacity-0 md:group-hover/viewer:opacity-100 transition-all duration-200"
                                    aria-label="Foto Sebelumnya"
                                  >
                                    <ChevronLeft className="w-5 h-5" />
                                  </button>
                                )}
                                {activeGalleryIndex < allPhotos.length - 1 && (
                                  <button
                                    onClick={handleNext}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm opacity-100 md:opacity-0 md:group-hover/viewer:opacity-100 transition-all duration-200"
                                    aria-label="Foto Selanjutnya"
                                  >
                                    <ChevronRight className="w-5 h-5" />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Thumbnails row */}
                    {(() => {
                      const allPhotos = [selectedHouse.cover_image, ...(selectedHouse.gallery || [])].filter(Boolean);
                      if (allPhotos.length <= 1) return null;

                      return (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {allPhotos.map((url, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActiveGalleryIndex(idx)}
                              className={`w-16 h-12 rounded overflow-hidden border-2 transition-all ${
                                activeGalleryIndex === idx ? "border-[#3A6520] scale-95" : "border-transparent opacity-70 hover:opacity-100"
                              }`}
                            >
                              <img src={url} alt="" className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Details & Specifications */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-black/[0.05]">
                    {/* Capacity */}
                    <div>
                      <span className="block text-[10px] font-semibold text-[#7A7065] uppercase tracking-wider mb-1.5">Kapasitas Tamu</span>
                      <div className="flex items-center gap-1.5 text-[#2C2C2A] text-[12.5px]">
                        <Users className="w-4 h-4 text-[#3A6520]" />
                        <span>{selectedHouse.min_guests || 1} - {selectedHouse.max_guests || 10} Orang</span>
                      </div>
                    </div>

                    {/* Billing calculation */}
                    <div>
                      <span className="block text-[10px] font-semibold text-[#7A7065] uppercase tracking-wider mb-1.5">Sistem Biaya</span>
                      <div className="flex items-center gap-1.5 text-[#2C2C2A] text-[12.5px]">
                        <DollarSign className="w-4 h-4 text-[#3A6520]" />
                        <span>Per {selectedHouse.pricing_type === "person" ? "Orang" : "Sewa Rumah"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Facilities Checklist Grid */}
                  <div className="space-y-3 pt-4 border-t border-black/[0.05]">
                    <span className="block text-[10px] font-semibold text-[#7A7065] uppercase tracking-wider">Fasilitas Rumah</span>
                    <div className="grid grid-cols-2 gap-2.5">
                      {selectedHouse.facilities?.map((f) => {
                        const IconComp = getFacilityIcon(f);
                        return (
                          <div key={f} className="flex items-center gap-2 text-[12px] text-[#5A5550]">
                            <span className="w-4.5 h-4.5 rounded-full bg-emerald-50 text-[#3A6520] flex items-center justify-center shrink-0">
                              <IconComp className="w-2.5 h-2.5" />
                            </span>
                            <span className="truncate">{f === "Others" ? (selectedHouse.facilities_other || "Fasilitas Lainnya") : f}</span>
                          </div>
                        );
                      })}
                      {(!selectedHouse.facilities || selectedHouse.facilities.length === 0) && (
                        <span className="text-[12px] text-[#7A7065] italic">Tidak ada rincian fasilitas terdaftar.</span>
                      )}
                    </div>
                  </div>

                </div>

                {/* Right Column (Description, Experiences, Pricing Packages) */}
                <div className="md:col-span-5 space-y-6 md:border-l md:border-black/[0.05] md:pl-8">
                  
                  {/* Description */}
                  <div className="space-y-2.5">
                    <h4 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[11px] font-bold text-[#7A7065] uppercase tracking-wider">
                      Mengenai Akomodasi
                    </h4>
                    <p className="text-[13.5px] text-[#5A5550] leading-relaxed whitespace-pre-line">
                      {selectedHouse.description}
                    </p>
                  </div>

                  {/* Pricing Packages */}
                  <div className="space-y-4 pt-4 border-t border-black/[0.05]">
                    <h4 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[11px] font-bold text-[#7A7065] uppercase tracking-wider">
                      Pilihan Paket & Reservasi
                    </h4>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {/* Overnight plan */}
                      <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                        selectedHouse.overnight_active 
                          ? "border-[#3A6520]/20 bg-[#3A6520]/5" 
                          : "border-black/[0.05] bg-gray-50 opacity-60"
                      }`}>
                        <div>
                          <h5 className="text-[13px] font-bold text-[#2C2C2A] mb-1">Paket Menginap (Overnight)</h5>
                          <span className="block text-[10px] text-[#7A7065] mb-3">Hanya akomodasi menginap standar</span>
                          
                          {selectedHouse.overnight_active ? (
                            <div className="space-y-3">
                              <span className="block text-[16px] font-extrabold text-[#3A6520]">
                                Rp {selectedHouse.overnight_price?.toLocaleString("id-ID") || 0}
                                <span className="text-[11px] font-normal text-[#7A7065]"> / malam</span>
                              </span>
                              <div className="flex flex-col gap-1 text-[11px] text-[#7A7065]">
                                <span className="flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5" /> Check-in: {selectedHouse.overnight_checkin || "14:00 WIB"}
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5" /> Check-out: {selectedHouse.overnight_checkout || "12:00 WIB"}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-[12px] text-[#7A7065] italic">Paket ini tidak tersedia</span>
                          )}
                        </div>
                        {selectedHouse.overnight_active && (
                          selectedHouse.status === "Unavailable" ? (
                            <button
                              disabled
                              className="mt-4 w-full text-center py-2 bg-black/[0.04] text-[#B8AFA3] text-[12px] font-semibold rounded-full cursor-not-allowed block border border-black/[0.08]"
                            >
                              Penuh (Tidak Tersedia)
                            </button>
                          ) : (
                            <a
                              href={getWhatsAppBookingUrl(selectedHouse, "overnight")}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-4 w-full text-center py-2 bg-[#3A6520] hover:bg-[#2D5016] text-white text-[12px] font-semibold rounded-full transition-colors block"
                            >
                              Pilih Paket Menginap
                            </a>
                          )
                        )}
                      </div>

                      {/* 24 Hour plan */}
                      <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                        selectedHouse.hour24_active 
                          ? "border-[#C97C2A]/20 bg-[#C97C2A]/5" 
                          : "border-black/[0.05] bg-gray-50 opacity-60"
                      }`}>
                        <div>
                          <h5 className="text-[13px] font-bold text-[#2C2C2A] mb-1">Paket 24 Jam (All-Inclusive)</h5>
                          <span className="block text-[10px] text-[#7A7065] mb-3">Termasuk makan tradisional & aktivitas dusun</span>
                          
                          {selectedHouse.hour24_active ? (
                            <div className="space-y-3">
                              <span className="block text-[16px] font-extrabold text-[#C97C2A]">
                                Rp {selectedHouse.hour24_price?.toLocaleString("id-ID") || 0}
                                <span className="text-[11px] font-normal text-[#7A7065]"> / orang</span>
                              </span>
                              <p className="text-[11px] text-[#7A7065] leading-relaxed">
                                <strong>Kegiatan:</strong> {selectedHouse.hour24_description || "Termasuk makan 3x sehari dan aktivitas harian bersama pemilik rumah."}
                              </p>
                            </div>
                          ) : (
                            <span className="text-[12px] text-[#7A7065] italic">Paket ini tidak tersedia</span>
                          )}
                        </div>

                        {selectedHouse.hour24_active && (
                          selectedHouse.status === "Unavailable" ? (
                            <button
                              disabled
                              className="mt-4 w-full text-center py-2 bg-black/[0.04] text-[#B8AFA3] text-[12px] font-semibold rounded-full cursor-not-allowed block border border-black/[0.08]"
                            >
                              Penuh (Tidak Tersedia)
                            </button>
                          ) : (
                            <a
                              href={getWhatsAppBookingUrl(selectedHouse, "hour24")}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-4 w-full text-center py-2 bg-[#C97C2A] hover:bg-[#b0671c] text-white text-[12px] font-semibold rounded-full transition-colors block"
                            >
                              Pilih Paket 24 Jam
                            </a>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Experience Checklist Grid */}
                  <div className="space-y-3 pt-4 border-t border-black/[0.05]">
                    <span className="block text-[10px] font-semibold text-[#7A7065] uppercase tracking-wider">Aktivitas / Pengalaman Tuan Rumah</span>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedHouse.experiences?.map((e) => (
                        <div key={e} className="flex items-center gap-2 text-[12px] text-[#5A5550]">
                          <span className="w-4.5 h-4.5 rounded-full bg-[#C97C2A]/10 text-[#C97C2A] flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5" />
                          </span>
                          <span className="truncate">{e === "Others" ? (selectedHouse.experiences_other || "Aktivitas Lainnya") : e}</span>
                        </div>
                      ))}
                      {(!selectedHouse.experiences || selectedHouse.experiences.length === 0) && (
                        <span className="text-[12px] text-[#7A7065] italic col-span-2">Tidak ada rincian aktivitas terdaftar.</span>
                      )}
                    </div>
                  </div>

                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-[#FAF9F5] border-t border-black/[0.06] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-medium text-[#7A7065]">Status Rumah:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  selectedHouse.status === "Available" 
                    ? "bg-emerald-500 text-white" 
                    : "bg-amber-500 text-white"
                }`}>
                  {selectedHouse.status === "Available" ? "Tersedia" : "Penuh"}
                </span>
              </div>
              <button
                onClick={() => setSelectedHouse(null)}
                className="px-5 py-2 border border-black/[0.1] text-[#5A5550] hover:bg-black/5 text-[12px] font-semibold rounded-full transition"
              >
                Tutup
              </button>
            </div>

          </div>

        </div>
      )}

      {/* Footer */}
      <SiteFooter nav={nav} settings={settings} />
    </>
  );
}
