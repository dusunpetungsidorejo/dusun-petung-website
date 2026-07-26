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
  Heart,
  Sun,
  Tent
} from "lucide-react";
import { Page, LiveInHouse, LiveInPackage } from "../types";
import { SiteFooter } from "../components/SiteFooter";

interface LiveInPageProps {
  nav: (p: Page) => void;
  settings: any;
}

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

export function LiveInPage({ nav, settings }: LiveInPageProps) {
  const [houses, setHouses] = useState<LiveInHouse[]>([]);
  const [packages, setPackages] = useState<LiveInPackage[]>(DEFAULT_PACKAGES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Lightbox State for Gallery
  const [activeLightboxImg, setActiveLightboxImg] = useState<{ url: string; caption: string } | null>(null);
 
  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
 
  const fetchHousesAndPackages = async () => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      
      // Fetch houses
      const resHouses = await fetch(`${baseUrl}/livein`);
      if (!resHouses.ok) throw new Error("Gagal memuat data dari server");
      const dataHouses = await resHouses.json();
      // Filter out Inactive houses for public view
      const activeHouses = dataHouses.filter((h: LiveInHouse) => h.status !== "Inactive");
      setHouses(activeHouses);
 
      // Fetch packages
      const resPackages = await fetch(`${baseUrl}/livein/packages`);
      if (resPackages.ok) {
        const dataPackages = await resPackages.json();
        const activePackages = dataPackages.filter((p: LiveInPackage) => p.active);
        if (activePackages.length > 0) {
          setPackages(activePackages);
        }
      }
    } catch (err: any) {
      console.error("Failed to fetch Live In data:", err);
      setError("Tidak dapat memuat data saat ini. Silakan periksa koneksi internet Anda atau coba sesaat lagi.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Live In Houses and Packages from API
  useEffect(() => {
    fetchHousesAndPackages();
  }, []);

  // Format phone number for WhatsApp
  const phoneVal = settings?.phone_number || "085138097972";
  let formattedPhone = phoneVal.replace(/[^0-9]/g, "");
  if (formattedPhone.startsWith("0")) {
    formattedPhone = "62" + formattedPhone.slice(1);
  }
  const defaultWaUrl = formattedPhone ? `https://wa.me/${formattedPhone}` : "https://wa.me/6285138097972";

  // Create customized WhatsApp booking URL for Packages
  const getWhatsAppBookingUrl = (packageName: string) => {
    const text = `Halo, saya tertarik untuk memesan program Live In di Dusun Petung dengan:
Pilihan Paket: *${packageName}*

Apakah terdapat ketersediaan jadwal untuk waktu dekat?`;
    
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`;
  };

  // Extract all photos from fetched houses for dynamic gallery
  const allGalleryPhotos = houses.flatMap((house) => {
    const list = [];
    if (house.cover_image) {
      list.push({
        url: house.cover_image,
        caption: `Rumah ${house.name} · Tuan Rumah: ${house.owner}`
      });
    }
    if (house.gallery && Array.isArray(house.gallery)) {
      house.gallery.forEach(img => {
        if (img) {
          list.push({
            url: img,
            caption: `Rumah ${house.name} · Tuan Rumah: ${house.owner}`
          });
        }
      });
    }
    return list;
  });

  const defaultPhotos = [
    { url: "https://images.unsplash.com/photo-1566205865731-51803de32a35?w=800&h=600&fit=crop&auto=format", caption: "Suasana pedesaan lereng Gunung Merapi" },
    { url: "https://images.unsplash.com/photo-1572908721147-0a9eb395762d?w=800&h=600&fit=crop&auto=format", caption: "Aktivitas berkebun warga" },
    { url: "https://images.unsplash.com/photo-1623042392888-1f87e36a5b64?w=800&h=600&fit=crop&auto=format", caption: "Kuliner pawon tradisional" },
    { url: "https://images.unsplash.com/photo-1650247452475-b5866374545d?w=800&h=600&fit=crop&auto=format", caption: "Peternakan warga Dusun Petung" }
  ];

  const displayPhotos = allGalleryPhotos.length > 0 ? allGalleryPhotos : defaultPhotos;

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-10 h-auto sm:py-0 sm:h-[40vh] sm:min-h-[330px]">
        <img
          src="https://images.unsplash.com/photo-1566205865731-51803de32a35?w=1600&h=900&fit=crop&auto=format"
          alt="Suasana pedesaan lereng Gunung Merapi dengan pepohonan hijau rindang"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/52" />
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 flex flex-col justify-end h-auto sm:h-full pb-0 sm:pb-14">
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
            Nikmati pengalaman hidup bersama warga lokal, mengenal tradisi dan keseharian desa, serta merasakan ketenangan alam di kaki Merapi.
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            <a
              href="#paket-livein"
              className="px-4.5 py-2 bg-[#3A6520] text-white text-[12px] font-semibold rounded-full hover:bg-[#2D5016] transition-colors"
            >
              Lihat Paket Reservasi
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
                  Di Dusun Petung, kami percaya bahwa pariwisata terbaik adalah pariwisata yang mendekatkan hati ke hati. Wisata <strong>Live In</strong> kami rancang agar para wisatawan dapat melepaskan penat dan kembali terhubung dengan alam serta kebiasaan hidup bersahaja.
                </p>
                <p>
                  Setiap rumah warga yang terdaftar telah dikurasi agar menjamin kenyamanan mendasar Anda, namun tetap mempertahankan keaslian bentuk hunian lereng Merapi. Anda tidak akan menemukan kemewahan hotel berbintang, melainkan kemewahan obrolan hangat malam hari di bale-bale bambu sembari menikmati teh jahe hangat buatan simbah.
                </p>
              </div>

              {/* Three Value Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-2 pt-8 border-t border-black/[0.06]">
                <div>
                  <span className="block text-[#3A6520] font-bold text-[17px] mb-2">01. Autentik</span>
                  <span className="block text-[13px] text-[#7A7065] leading-relaxed">Merasakan keseharian warga dan suasana dusun secara langsung.</span>
                </div>
                <div>
                  <span className="block text-[#3A6520] font-bold text-[17px] mb-2">02. Kebersamaan</span>
                  <span className="block text-[13px] text-[#7A7065] leading-relaxed">Berinteraksi dengan keluarga tuan rumah dan menjadi bagian dari kehidupan desa.</span>
                </div>
                <div>
                  <span className="block text-[#3A6520] font-bold text-[17px] mb-2">03. Edukatif</span>
                  <span className="block text-[13px] text-[#7A7065] leading-relaxed">Belajar mengenal budaya, tradisi, dan kehidupan masyarakat lereng Merapi.</span>
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
                <span className="block text-[13.5px] font-bold text-[#2C2C2A] mb-1">Dikelola Masyarakat</span>
                <span className="block text-[11px] text-[#7A7065] leading-relaxed">Program dijalankan bersama oleh masyarakat dusun dan keluarga tuan rumah.</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Package & Reservation Cards Section */}
      <section id="paket-livein" className="py-8 lg:py-16 bg-[#F7F4EF] border-t border-black/[0.04]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#C97C2A] text-[11px] font-bold tracking-[0.18em] uppercase block mb-4">
              Pilihan Paket
            </span>
            <h2
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              className="text-[28px] sm:text-[38px] font-extrabold text-[#2C2C2A] leading-tight mb-5"
            >
              Paket Kunjungan Live In
            </h2>
            <p className="text-[14.5px] text-[#7A7065] leading-relaxed text-center">
              Pilih paket kunjungan yang paling sesuai dengan kebutuhan Anda. Semua homestay warga memiliki tarif, fasilitas, dan kehangatan pelayanan yang seragam.
            </p>
          </div>

          {/* Dynamic Packages Grid */}
          {packages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[13px] text-[#7A7065]">Tidak ada paket reservasi yang tersedia saat ini.</p>
            </div>
          ) : (
            <div className={`grid gap-8 mx-auto ${
              packages.length === 1 
                ? "grid-cols-1 max-w-md" 
                : packages.length === 2 
                  ? "grid-cols-1 md:grid-cols-2 max-w-4xl" 
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl"
            }`}>
              {packages.map((pkg, idx) => {
                const isEven = idx % 2 === 1;
                
                const renderIcon = () => {
                  const iconClass = "w-5 h-5";
                  switch (pkg.icon) {
                    case "sun":
                      return <Sun className={iconClass} />;
                    case "home":
                      return <Home className={iconClass} />;
                    case "tent":
                      return <Tent className={iconClass} />;
                    case "sparkles":
                      return <Sparkles className={iconClass} />;
                    case "clock":
                    default:
                      return <Clock className={iconClass} />;
                  }
                };

                return (
                  <div 
                    key={pkg.id} 
                    className={`bg-white border rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative overflow-hidden ${
                      isEven ? "border-[#C97C2A]/20" : "border-black/[0.06]"
                    }`}
                  >
                    {isEven && (
                      <div className="absolute top-0 right-0 bg-[#C97C2A] text-white text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg">
                        Full Experience
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isEven ? "bg-[#C97C2A]/8 text-[#C97C2A]" : "bg-[#3A6520]/8 text-[#3A6520]"
                        }`}>
                          {renderIcon()}
                        </span>
                        <div>
                          <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[16px] font-bold text-[#2C2C2A]">
                            {pkg.name}
                          </h3>
                        </div>
                      </div>
                      
                      <p className="text-[13px] text-[#5A5550] leading-relaxed mb-4">
                        {pkg.description}
                      </p>

                      {pkg.facilities && pkg.facilities.length > 0 && (
                        <div className="border-t border-black/[0.05] pt-4.5 mb-4.5">
                          <span className="block text-[10px] font-semibold text-[#7A7065] uppercase tracking-wider mb-2.5">Fasilitas & Aktivitas Termasuk:</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {pkg.facilities.map((item, i) => (
                              <div key={i} className="flex items-center gap-2 text-[12px] text-[#5A5550]">
                                <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                                  isEven ? "bg-amber-50 text-[#C97C2A]" : "bg-emerald-50 text-[#3A6520]"
                                }`}>
                                  <Check className="w-2.5 h-2.5" strokeWidth={3} />
                                </span>
                                <span className="truncate">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-black/[0.05] pt-4.5 mt-3">
                      <div className="mb-4">
                        <span className="block text-[10px] text-[#7A7065] uppercase font-semibold">Tarif Tetap</span>
                        <span className={`text-[22px] font-extrabold leading-none ${isEven ? "text-[#C97C2A]" : "text-[#3A6520]"}`}>
                          Rp {pkg.price.toLocaleString("id-ID")}
                          <span className="text-[13px] font-normal text-[#7A7065]"> / {pkg.pricing_type}</span>
                        </span>
                      </div>
                      <a
                        href={getWhatsAppBookingUrl(pkg.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full text-center py-2.5 text-white text-[12px] font-semibold rounded-full transition-colors block shadow-sm ${
                          isEven ? "bg-[#C97C2A] hover:bg-[#b0671c]" : "bg-[#3A6520] hover:bg-[#2D5016]"
                        }`}
                      >
                        Reservasi {pkg.name}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* Homestay Photo Gallery Section */}
      <section className="py-8 lg:py-16 bg-[#FAF9F5] border-t border-black/[0.04]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[#C97C2A] text-[11px] font-bold tracking-[0.18em] uppercase block mb-4">
              Galeri Akomodasi
            </span>
            <h2
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              className="text-[28px] sm:text-[38px] font-extrabold text-[#2C2C2A] leading-tight mb-5"
            >
              Suasana Homestay Warga
            </h2>
            <p className="text-[14.5px] text-[#7A7065] leading-relaxed text-center">
              Intip kehangatan dan keaslian suasana rumah tinggal warga Dusun Petung yang siap menyambut kehadiran Anda.
            </p>
          </div>

          {/* Gallery Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-[#3A6520] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-[13px] text-[#7A7065]">Memuat foto-foto akomodasi...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayPhotos.map((photo, index) => (
                <div 
                  key={index}
                  onClick={() => setActiveLightboxImg(photo)}
                  className="relative aspect-square sm:aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group border border-black/[0.04] bg-white shadow-sm hover:shadow transition-shadow"
                >
                  <img 
                    src={photo.url} 
                    alt={photo.caption} 
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <p className="text-white text-[11px] font-medium leading-snug line-clamp-2">
                      {photo.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Experience Showcase (Bertani, Kuliner, dll) */}
      <section className="py-8 lg:py-16 bg-[#FAF9F5] border-t border-black/[0.04]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="bg-[#FAF8F4] border border-black/[0.06] rounded-3xl p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <div className="flex-1">
              <span className="text-[#C97C2A] text-[11px] font-bold tracking-[0.18em] uppercase block mb-4">
                Aktivitas & Tradisi
              </span>
              <h2
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.75rem, 3vw, 2.5rem)", lineHeight: 1.15 }}
                className="font-extrabold text-[#2C2C2A] mb-5"
              >
                Kegiatan Keseharian <br />Masyarakat Dusun
              </h2>
              <p className="text-[14.5px] text-[#7A7065] leading-relaxed mb-6">
                Selama menginap di homestay, Anda diundang secara sukarela untuk membaur dan mengikuti denyut nadi kehidupan warga lokal, mulai dari turun ke sawah, memanen sayuran, merawat hewan ternak, hingga melihat pembuatan arang tradisional.
              </p>
              <p className="text-[14.5px] text-[#7A7065] leading-relaxed mb-8">
                Ingin melihat bagaimana warga Dusun Petung menjalani kesehariannya? Kunjungi galeri dokumentasi kami untuk melihat dokumentasi foto-foto nyata kegiatan tersebut.
              </p>
              <button
                onClick={() => nav("village-life")}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#3A6520] hover:bg-[#2D5016] text-white text-[13px] font-bold rounded-full transition-colors shadow-sm"
              >
                Lihat Galeri Kehidupan Dusun <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            {/* Visual element on the right side - a beautiful grid of stacked preview photos */}
            <div className="w-full lg:w-[45%] grid grid-cols-2 gap-3 shrink-0">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#D4C9B5]">
                <img src="/images/livein/Pertanian.webp" alt="Pertanian" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#D4C9B5] translate-y-4">
                <img src="https://images.unsplash.com/photo-1623042392888-1f87e36a5b64?w=400&h=300&fit=crop" alt="Kuliner" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#D4C9B5] -translate-y-4">
                <img src="/images/livein/Ternak Mas Yono.webp" alt="Beternak" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#D4C9B5]">
                <img src="/images/camp/View_5.webp" alt="Suasana Dusun" className="w-full h-full object-cover" />
              </div>
            </div>
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
              <p className="text-[14.5px] text-[#7A7065] leading-relaxed mb-6">
                Untuk menjaga kenyamanan bersama dan adat istiadat dusun, kami memohon agar setiap pengunjung memperhatikan beberapa panduan berikut.
              </p>
              
              <div className="space-y-4">
                {[
                  { title: "Bawa Pakaian Hangat", desc: "Dusun Petung berada di lereng tinggi Gunung Merapi, udara malam dan pagi hari cukup dingin." },
                  { title: "Gunakan Alas Kaki yang Nyaman", desc: "Area dusun memiliki jalan menanjak. Gunakan alas kaki yang nyaman untuk memudahkan aktivitas." },
                  { title: "Hormati Kebiasaan Warga", desc: "Jaga sopan santun, sapa warga dengan ramah, dan ikuti arahan dari keluarga tuan rumah selama beraktivitas." }
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
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="mb-0 text-[16px] font-bold text-[#2C2C2A] pb-4 border-b border-black/[0.05]">
                Pertanyaan Umum (FAQ)
              </h3>
              
              <div className="space-y-1">
                {[
                  {
                    q: "Apakah saya akan menginap di rumah warga?",
                    a: "Ya. Selama program Live In, Anda akan menginap di rumah keluarga tuan rumah dan merasakan suasana kehidupan sehari-hari masyarakat Dusun Petung."
                  },
                  {
                    q: "Apa saja kegiatan yang bisa dilakukan?",
                    a: "Aktivitas menyesuaikan dengan keseharian keluarga tuan rumah dan kondisi musim. Anda dapat mengikuti kegiatan seperti berkebun, beternak, berinteraksi dengan warga, menikmati kuliner lokal, atau aktivitas lain yang sedang berlangsung."
                  },
                  {
                    q: "Apakah saya harus mengikuti semua kegiatan?",
                    a: "Tidak. Anda bebas memilih untuk mengikuti aktivitas yang tersedia sesuai minat dan kenyamanan selama program berlangsung."
                  },
                  {
                    q: "Berapa lama durasi Live In?",
                    a: "Tersedia pilihan paket Overnight dan 24 Hours. Detail jadwal dan waktu pelaksanaan dapat dilihat pada masing-masing pilihan rumah."
                  },
                  {
                    q: "Apakah makanan sudah disediakan?",
                    a: "Ya. Keluarga tuan rumah akan menyiapkan hidangan selama Anda menginap. Jika memiliki alergi atau pantangan makanan tertentu, mohon informasikan sebelum kedatangan."
                  },
                  {
                    q: "Bagaimana cara melakukan reservasi?",
                    a: "Lakukan reservasi melalui tombol yang tersedia. Selanjutnya, Anda akan diarahkan ke WhatsApp untuk proses konfirmasi bersama pengelola."
                  },
                  {
                    q: "Apakah Live In cocok untuk rombongan?",
                    a: "Ya. Program dapat diikuti secara individu maupun berkelompok. Untuk rombongan, kami menyarankan melakukan reservasi lebih awal agar penempatan rumah dapat disesuaikan dengan ketersediaan."
                  },
                  {
                    q: "Apa yang perlu saya bawa?",
                    a: "Disarankan membawa pakaian hangat, alas kaki yang nyaman, perlengkapan pribadi, serta obat-obatan pribadi apabila diperlukan."
                  }
                ].map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div 
                      key={idx} 
                      className="border-b border-black/[0.05] pb-1.5 last:border-0 last:pb-0"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between text-left py-1.5 focus:outline-none group"
                      >
                        <span className="text-[13px] font-bold text-[#2C2C2A] group-hover:text-[#3A6520] transition-colors leading-snug">
                          {faq.q}
                        </span>
                        <ChevronRight 
                          className={`w-4 h-4 text-[#7A7065] shrink-0 transition-transform duration-200 ml-3 ${
                            isOpen ? "rotate-90 text-[#3A6520]" : ""
                          }`} 
                        />
                      </button>
                      
                      <div 
                        className={`overflow-hidden transition-all duration-250 ${
                          isOpen ? "max-h-[200px] mt-1.5 opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <p className="text-[12px] text-[#7A7065] leading-relaxed pr-6">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Lightbox Modal for Gallery Images */}
      {activeLightboxImg && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm cursor-zoom-out"
          onClick={() => setActiveLightboxImg(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setActiveLightboxImg(null)}
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition"
            >
              <X className="w-6 h-6" />
            </button>
            <img 
              src={activeLightboxImg.url} 
              alt={activeLightboxImg.caption} 
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl border border-white/10" 
            />
            <p className="text-white/90 text-[13.5px] mt-4 font-semibold text-center px-5 py-2 bg-black/40 rounded-full backdrop-blur-sm">
              {activeLightboxImg.caption}
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <SiteFooter nav={nav} settings={settings} />
    </>
  );
}

