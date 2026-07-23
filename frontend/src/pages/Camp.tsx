import React from "react";
import { 
  ChevronDown,
  ChevronUp,
  Mountain, 
  Sunrise, 
  Star, 
  Camera, 
  Wind, 
  Flame, 
  Car, 
  Droplets, 
  Eye, 
  Umbrella, 
  Info, 
  Phone, 
  MapPin, 
  Instagram,
  Wifi,
  Zap
} from "lucide-react";
import { Page } from "../types";
import { Tiktok } from "../components/Tiktok";
import { SiteFooter } from "../components/SiteFooter";

const MosqueIcon = ({ className, strokeWidth }: { className?: string; strokeWidth?: number }) => (
  <svg
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    stroke="currentColor"
    fill="none"
    strokeWidth={strokeWidth || 2}
  >
    <title>mosque</title>
    <g strokeLinecap="round" strokeLinejoin="round">
      <circle cx="43.5" cy="8.5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="47" cy="16" r="1" fill="currentColor" stroke="none" />
      <line x1="54" y1="8.463" x2="54" y2="9.878" />
      <line x1="54" y1="14.122" x2="54" y2="15.537" />
      <line x1="50.463" y1="12" x2="51.878" y2="12" />
      <line x1="56.122" y1="12" x2="57.537" y2="12" />
      <path d="M55.482,40A13.691,13.691,0,0,0,57,33.636c0-6.326-9-11.454-9-11.454s-9,5.128-9,11.454A13.691,13.691,0,0,0,40.518,40Z" />
      <path d="M20.846,19a12.891,12.891,0,0,0,1.287-5.714C22.133,7.605,14.5,3,14.5,3S6.867,7.605,6.867,13.286A12.891,12.891,0,0,0,8.154,19Z" />
      <rect x="9" y="19" width="11" height="25" />
      <path d="M43.639,32A10,10,0,0,0,46,25.636c0-6.326-14-11.454-14-11.454S18,19.31,18,25.636A10,10,0,0,0,20.361,32Z" />
      <rect x="28" y="40" width="30" height="3" rx="1.5" ry="1.5" />
      <rect x="17" y="32" width="30" height="3" rx="1.5" ry="1.5" />
      <rect x="20" y="35" width="24" height="26" />
      <rect x="9" y="47" width="11" height="14" />
      <polygon points="35 61 29 61 29 43 32 40 35 43 35 61" />
      <line x1="32" y1="14" x2="32" y2="10" />
      <path d="M32.191,4.66a3,3,0,0,0,3.166,5.1" />
      <path d="M8.5,44H20a0,0,0,0,1,0,0v3a0,0,0,0,1,0,0H8.5A1.5,1.5,0,0,1,7,45.5v0A1.5,1.5,0,0,1,8.5,44Z" />
      <rect x="44" y="43" width="11" height="18" />
      <line x1="51" y1="43" x2="51" y2="48" />
      <line x1="48" y1="43" x2="48" y2="48" />
      <line x1="39" y1="35" x2="39" y2="50" />
      <line x1="25" y1="35" x2="25" y2="50" />
      <line x1="13" y1="47" x2="13" y2="52" />
      <line x1="16" y1="47" x2="16" y2="52" />
      <line x1="13" y1="39" x2="13" y2="44" />
      <line x1="16" y1="39" x2="16" y2="44" />
      <line x1="60" y1="61" x2="4" y2="61" />
    </g>
  </svg>
);

interface CampPageProps {
  nav: (p: Page) => void;
  settings: any;
}

export function CampPage({ nav, settings }: CampPageProps) {
  const phoneVal = settings?.phone_number || "085138097972";
  let formattedPhone = phoneVal.replace(/[^0-9]/g, "");
  if (formattedPhone.startsWith("0")) {
    formattedPhone = "62" + formattedPhone.slice(1);
  }
  const waUrl = formattedPhone ? `https://wa.me/${formattedPhone}` : "https://wa.me/6285138097972";

  const [isExpanded, setIsExpanded] = React.useState(false);
  const [activeInfoTab, setActiveInfoTab] = React.useState<"info" | "paket" | "sewa">("info");

  const showCampingPackages = () => {
    setActiveInfoTab("paket");
    setTimeout(() => {
      const el = document.getElementById("info-dan-harga");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
  };

  const activities = [
    { img: "/images/camp/Berkemah.webp", icon: Mountain, title: "Berkemah", desc: "Rasakan malam di alam terbuka dengan bintang sebagai atap dan semilir gunung sebagai selimut." },
    { img: "/images/camp/Menyambut Fajar.webp", icon: Sunrise, title: "Menyambut Fajar", desc: "Saksikan matahari terbit di balik puncak Merapi dari ketinggian bukit yang tenang." },
    { img: "/images/camp/City Light.webp", icon: Star, title: "Menikmati City Light", desc: "Hamparan lampu kota yang berkilauan dari ketinggian menciptakan panorama malam yang memukau." },
    { img: "/images/camp/Fotografi Alam.webp", icon: Camera, title: "Fotografi Alam", desc: "Setiap sudut menawarkan komposisi indah, dari panorama puncak hingga kabut pagi yang dramatis." },
    { img: "/images/camp/Menikmati Alam.webp", icon: Wind, title: "Menikmati Alam", desc: "Biarkan udara pegunungan dan keheningan alam memulihkan pikiran dan jiwa Anda." },
    { img: "/images/camp/Api Unggun.webp", icon: Flame, title: "Api Unggun", desc: "Kumpul bersama di sekitar api unggun, berbagi cerita, dan menikmati hangatnya malam bersama." },
  ];

  const facilities = [
    { icon: Mountain, label: "Area Camping" },
    { icon: Car, label: "Parkir Luas" },
    { icon: Droplets, label: "Toilet Bersih" },
    { icon: MosqueIcon, label: "Musala" },
    { icon: Wifi, label: "Wifi" },
    { icon: Zap, label: "Akses Listrik" },
    { icon: Flame, label: "Area Api Unggun" },
    { icon: Info, label: "Pusat Informasi" },
  ];

  const galleryImgs = [
    { src: "/images/camp/View_1.webp", alt: "Pemandangan Gumuk Petung Camp saat fajar" },
    { src: "/images/camp/View_2.webp", alt: "Tenda-tenda di bawah langit senja" },
    { src: "/images/camp/View_4.webp", alt: "Area berkemah dengan panorama Gunung Merapi" },
    { src: "/images/camp/View_5.webp", alt: "Suasana malam hari bertabur bintang di perkemahan" },
    { src: "/images/camp/View_3.webp", alt: "Keindahan alam perbukitan Dusun Petung" },
    { src: "/images/camp/View_7.webp", alt: "Aktivitas berkemah dan bersantai di alam terbuka" },
    { src: "/images/camp/View_9.webp", alt: "Malam tenang dengan api unggun yang hangat" },
    { src: "/images/camp/View_8.webp", alt: "Keindahan alam pepohonan hijau di sekitar camp" },
    { src: "/images/camp/View_10.webp", alt: "Menyaksikan kabut pagi perlahan naik" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ height: "40vh", minHeight: 330 }}>
        <img
          src="/images/camp/Hero.webp"
          alt="Pemandangan Gumuk Petung Camp"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 75%" }}
        />
        <div className="absolute inset-0 bg-black/52" />
        <div className="relative h-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col justify-end pb-6 sm:pb-8">
          <span className="text-white/50 text-[11px] font-bold tracking-[0.18em] uppercase block mb-2">
            Wisata Camping · Dusun Petung
          </span>
          <h1
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.85rem, 3.8vw, 2.65rem)", lineHeight: 1.15 }}
            className="font-extrabold text-white mb-2"
          >
            Gumuk Petung Camp
          </h1>
          <p className="text-white/65 text-[13px] sm:text-[14px] leading-[1.65] mb-4" style={{ maxWidth: 460 }}>
            Berkemah di bukit dengan panorama Gunung Merapi yang memukau. Tempat terbaik menikmati sejuknya alam berpadu dengan indahnya city light Kota Yogyakarta.
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            <a
              href={`${waUrl}?text=Halo,%20saya%20ingin%20reservasi%20Gumuk%20Petung%20Camp`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4.5 py-2 bg-[#3A6520] text-white text-[12px] font-semibold rounded-full hover:bg-[#2D5016] transition-colors"
            >
              <Phone className="w-3.5 h-3.5" strokeWidth={2} />
              Reservasi via WhatsApp
            </a>
            <button
              onClick={showCampingPackages}
              className="px-4.5 py-2 bg-white text-[#2C2C2A] text-[12px] font-semibold rounded-full hover:bg-neutral-100 transition-colors"
            >
              Lihat Paket & Harga
            </button>
            <a
              href="https://maps.app.goo.gl/NeYgxRwN3ed3unXdA"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4.5 py-2 bg-white/12 text-white text-[12px] font-semibold rounded-full border border-white/25 hover:bg-white/22 transition-colors backdrop-blur-sm"
            >
              Lihat Lokasi
            </a>
          </div>
        </div>
      </section>

      {/* About Gumuk Petung Camp */}
      <section className="py-8 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-16 lg:gap-28 items-start mb-20">
            <div>
              <span className="text-[#C97C2A] text-[11px] font-bold tracking-[0.18em] uppercase block mb-5">
                Tentang Destinasi
              </span>
              <h2
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.75rem, 3vw, 2.75rem)", lineHeight: 1.15 }}
                className="font-extrabold text-[#2C2C2A] mb-6"
              >
                Bermalam di Lereng <br className="hidden sm:inline" />dengan Pemandangan Merapi
              </h2>
              <p className="text-[#5A5550] leading-[1.75] text-[15px] mb-4">
                Gumuk Petung Camp merupakan area berkemah berbasis komunitas yang berada di kawasan perbukitan Dusun Petung dengan pemandangan langsung menuju Gunung Merapi. Suasana tenang, udara pegunungan yang sejuk, dan hamparan alam sekitar menghadirkan pengalaman bermalam yang lebih dekat dengan alam.
              </p>
              <p className="text-[#5A5550] leading-[1.75] text-[15px]">
                Dari tenda, pengunjung dapat menikmati perubahan suasana sejak matahari terbenam hingga cahaya pagi yang perlahan muncul di balik perbukitan. Dikelola bersama masyarakat lokal, Gumuk Petung Camp menjadi ruang untuk menikmati alam sekaligus mengenal kehidupan komunitas sekitar.
              </p>
            </div>
            <div className="flex justify-center">
              <img
                src="/images/camp/Profile.webp"
                alt="Tenda berkemah dengan latar Gunung Merapi"
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />
            </div>
          </div>

          {/* Gallery */}
          <div className="mb-10">
            <span className="text-[#C97C2A] text-[11px] font-bold tracking-[0.18em] uppercase block mb-5">
              Galeri Foto
            </span>
            <h3
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)", lineHeight: 1.2 }}
              className="font-extrabold text-[#2C2C2A]"
            >
              Rasakan Sebelum <br className="hidden sm:inline" />Berkunjung
            </h3>
          </div>

          <div className="grid grid-cols-12 gap-2.5">
            {/* Row 1: Big left & 4-grid right (1 + 4 = 5 images) */}
            {/* Big left */}
            <div className="col-span-12 lg:col-span-6 overflow-hidden bg-[#D4C9B5] h-[260px] sm:h-[360px] lg:h-[460px]">
              <img src={galleryImgs[0].src} alt={galleryImgs[0].alt} className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700" loading="lazy" />
            </div>
            {/* Right 2-col stack */}
            <div className="col-span-12 lg:col-span-6 grid grid-cols-2 gap-2.5">
              {[galleryImgs[1], galleryImgs[2], galleryImgs[3], galleryImgs[4]].map((img) => (
                <div key={img.src} className="overflow-hidden bg-[#D4C9B5] h-[120px] sm:h-[180px] lg:h-[222px]">
                  <img 
                    src={img.src} 
                    alt={img.alt} 
                    className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700" 
                    style={img.src.includes("View_5.webp") ? { objectPosition: "center 75%" } : undefined}
                    loading="lazy" 
                  />
                </div>
              ))}
            </div>

            {/* Collapsible/Expandable Part */}
            {isExpanded && (
              <>
                {/* Row 2: 3-column split (3 images) */}
                {[galleryImgs[5], galleryImgs[6], galleryImgs[7]].map((img) => (
                  <div key={img.src} className="col-span-12 sm:col-span-4 overflow-hidden bg-[#D4C9B5] h-[180px] sm:h-[240px] lg:h-[300px]">
                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700" loading="lazy" />
                  </div>
                ))}

                {/* Row 3: 1 wide banner (1 image) */}
                <div className="col-span-12 overflow-hidden bg-[#D4C9B5] h-[200px] sm:h-[280px] lg:h-[360px]">
                  <img src={galleryImgs[8].src} alt={galleryImgs[8].alt} className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700" loading="lazy" />
                </div>
              </>
            )}
          </div>

          {/* Button to Expand/Collapse */}
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-2 px-6 py-3 border border-black/10 hover:border-black/20 bg-white text-[#2C2C2A] text-[13px] font-semibold rounded-full hover:bg-neutral-50 transition-colors shadow-sm"
            >
              {isExpanded ? (
                <>
                  Tutup Galeri
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  Lihat Semua Foto (9)
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Activities */}
      <section className="py-24 lg:py-32 bg-[#F0EBE3]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-14">
            <span className="text-[#C97C2A] text-[11px] font-bold tracking-[0.18em] uppercase block mb-5">
              Aktivitas
            </span>
            <h2
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.75rem, 3vw, 2.75rem)", lineHeight: 1.15 }}
              className="font-extrabold text-[#2C2C2A]"
            >
              Momen Alam yang <br className="hidden sm:inline" />Bisa Dirasakan
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {activities.map(({ img, icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-black/5 overflow-hidden group cursor-default">
                <div className="overflow-hidden bg-[#D4C9B5]" style={{ height: 220 }}>
                  <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2.5 mb-3">
                    <Icon className="w-4 h-4 text-[#3A6520]" strokeWidth={1.5} />
                    <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[15px] font-bold text-[#2C2C2A]">
                      {title}
                    </h3>
                  </div>
                  <p className="text-[#7A7065] text-[13px] leading-[1.65]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-14">
            <span className="text-[#C97C2A] text-[11px] font-bold tracking-[0.18em] uppercase block mb-5">
              Fasilitas
            </span>
            <h2
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.75rem, 3vw, 2.75rem)", lineHeight: 1.15 }}
              className="font-extrabold text-[#2C2C2A]"
            >
              Fasilitas Umum <br className="hidden sm:inline" />yang Tersedia
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-px bg-black/8 border border-black/8">
            {facilities.map(({ icon: Icon, label }) => (
              <div key={label} className="bg-[#F7F4EF] flex flex-col items-center justify-center gap-3 py-6 sm:py-10 px-3 sm:px-4 text-center">
                <Icon className="w-5 h-5 text-[#3A6520]" strokeWidth={1.5} />
                <span className="text-[13px] font-medium text-[#2C2C2A] leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Visitor Information */}
      <section id="info-dan-harga" className="py-24 lg:py-32 bg-[#F0EBE3]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-14">
            <span className="text-[#C97C2A] text-[11px] font-bold tracking-[0.18em] uppercase block mb-5">
              Lokasi & Informasi
            </span>
            <h2
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.75rem, 3vw, 2.75rem)", lineHeight: 1.15 }}
              className="font-extrabold text-[#2C2C2A]"
            >
              Rencanakan <br className="hidden sm:inline" />Kunjungan Anda
            </h2>
          </div>

          <div className="grid lg:grid-cols-[3fr_2fr] gap-8 items-start">
            {/* Map embed */}
            <div className="bg-[#D4C9B5] overflow-hidden h-[280px] sm:h-[360px] lg:h-[500px]">
              <iframe
                title="Lokasi Gumuk Petung Camp"
                src="https://maps.google.com/maps?q=Gumuk+Petung+Sidorejo+Klaten+Yogyakarta&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>

            {/* Info panel */}
            <div className="bg-white border border-black/5 p-5 sm:p-8 flex flex-col justify-between h-auto lg:h-[500px]">
              <style dangerouslySetInnerHTML={{__html: `
                .info-tab-scroll::-webkit-scrollbar {
                  width: 4px;
                }
                .info-tab-scroll::-webkit-scrollbar-track {
                  background: transparent;
                }
                .info-tab-scroll::-webkit-scrollbar-thumb {
                  background: rgba(58, 101, 32, 0.2);
                  border-radius: 2px;
                }
                .info-tab-scroll::-webkit-scrollbar-thumb:hover {
                  background: rgba(58, 101, 32, 0.4);
                }
              `}} />

              {/* Tab Header */}
              <div className="flex border-b border-black/8 mb-4">
                {[
                  { id: "info", label: "Info & Kontak" },
                  { id: "paket", label: "Paket Camping" },
                  { id: "sewa", label: "Sewa Alat" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveInfoTab(tab.id as any)}
                    className={`flex-1 pb-3 text-[11px] font-bold tracking-wider uppercase border-b-2 text-center transition-all ${
                      activeInfoTab === tab.id
                        ? "border-[#3A6520] text-[#3A6520]"
                        : "border-transparent text-[#7A7065] hover:text-[#2C2C2A]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div key={activeInfoTab} className="flex-1 overflow-y-auto pr-1 info-tab-scroll mb-4">
                {activeInfoTab === "info" && (
                  <div className="flex flex-col gap-4 py-1">
                    <div>
                      <div className="text-[10px] font-bold text-[#7A7065] tracking-[0.15em] uppercase mb-1">Jam Buka</div>
                      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[14px] font-semibold text-[#2C2C2A] mb-0.5">Setiap Hari (24 Jam)</div>
                      <div className="text-[12px] text-[#7A7065]">Atur jadwal camping Anda dengan bebas melalui sistem reservasi yang fleksibel.</div>
                    </div>

                    <div className="w-full h-px bg-black/5" />

                    <div>
                      <div className="text-[10px] font-bold text-[#7A7065] tracking-[0.15em] uppercase mb-1.5">Harga Tiket Masuk</div>
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-[13px]">
                          <span className="text-[#5A5550]">Tiket Masuk (Inc. Parkir)</span>
                          <span className="font-semibold text-[#2C2C2A]">Rp 15.000 / orang</span>
                        </div>
                        <div className="flex justify-between text-[13px]">
                          <span className="text-[#5A5550]">Tambahan Campervan Pribadi</span>
                          <span className="font-semibold text-[#2C2C2A]">+ Rp 50.000 / unit</span>
                        </div>
                      </div>
                    </div>



                    <div className="w-full h-px bg-black/5" />

                    <div>
                      <div className="text-[10px] font-bold text-[#7A7065] tracking-[0.15em] uppercase mb-1.5">Media Sosial</div>
                      <div className="flex flex-col gap-1.5">
                        <a
                          href="https://www.instagram.com/gumukpetungcamp"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-[13px] text-[#5A5550] hover:text-[#3A6520] transition-colors"
                        >
                          <Instagram className="w-4 h-4 text-[#3A6520]" />
                          @gumukpetungcamp
                        </a>
                        <a
                          href="https://www.tiktok.com/@gumukpetungcamp"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-[13px] text-[#5A5550] hover:text-[#3A6520] transition-colors"
                        >
                          <Tiktok className="w-4 h-4 text-[#3A6520]" />
                          @gumukpetungcamp
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {activeInfoTab === "paket" && (
                  <div className="flex flex-col gap-4 py-1">
                    <div>
                      <div className="text-[10px] font-bold text-[#7A7065] tracking-[0.15em] uppercase mb-2">Kapasitas 4 Orang</div>
                      <div className="flex flex-col gap-2">
                        <div className="p-2.5 bg-[#F7F4EF] border border-black/5 rounded">
                          <div className="flex justify-between items-center mb-0.5">
                            <span className="font-bold text-[13px] text-[#2C2C2A]">Paket Small</span>
                            <span className="font-extrabold text-[13px] text-[#3A6520]">Rp 185.000</span>
                          </div>
                          <p className="text-[11px] text-[#5A5550]">Tenda 4p, 2 Matras (2x2m), 4 Selimut, Lampu Tenda, HTM</p>
                        </div>
                        <div className="p-2.5 bg-[#F7F4EF] border border-black/5 rounded">
                          <div className="flex justify-between items-center mb-0.5">
                            <span className="font-bold text-[13px] text-[#2C2C2A]">Paket Medium</span>
                            <span className="font-extrabold text-[13px] text-[#3A6520]">Rp 210.000</span>
                          </div>
                          <p className="text-[11px] text-[#5A5550]">Paket Small + Cooking Set (Kompor, Gas, Nesting)</p>
                        </div>
                        <div className="p-2.5 bg-[#F7F4EF] border border-black/5 rounded">
                          <div className="flex justify-between items-center mb-0.5">
                            <span className="font-bold text-[13px] text-[#2C2C2A]">Paket Large</span>
                            <span className="font-extrabold text-[13px] text-[#3A6520]">Rp 265.000</span>
                          </div>
                          <p className="text-[11px] text-[#5A5550]">Paket Medium + 1 Meja Lipat & 4 Kursi Lipat</p>
                        </div>
                      </div>
                    </div>

                    <div className="w-full h-px bg-black/5" />

                    <div>
                      <div className="text-[10px] font-bold text-[#7A7065] tracking-[0.15em] uppercase mb-2">Kapasitas 10 Orang</div>
                      <div className="flex flex-col gap-2">
                        <div className="p-2.5 bg-[#F7F4EF] border border-black/5 rounded">
                          <div className="flex justify-between items-center mb-0.5">
                            <span className="font-bold text-[13px] text-[#2C2C2A]">Paket Small</span>
                            <span className="font-extrabold text-[13px] text-[#3A6520]">Rp 425.000</span>
                          </div>
                          <p className="text-[11px] text-[#5A5550]">Tenda 10p, 4 Matras (2x2m), 10 Selimut, Lampu Tenda, HTM</p>
                        </div>
                        <div className="p-2.5 bg-[#F7F4EF] border border-black/5 rounded">
                          <div className="flex justify-between items-center mb-0.5">
                            <span className="font-bold text-[13px] text-[#2C2C2A]">Paket Medium</span>
                            <span className="font-extrabold text-[13px] text-[#3A6520]">Rp 460.000</span>
                          </div>
                          <p className="text-[11px] text-[#5A5550]">Paket Small + Cooking Set (Kompor, Gas, Nesting)</p>
                        </div>
                        <div className="p-2.5 bg-[#F7F4EF] border border-black/5 rounded">
                          <div className="flex justify-between items-center mb-0.5">
                            <span className="font-bold text-[13px] text-[#2C2C2A]">Paket Large</span>
                            <span className="font-extrabold text-[13px] text-[#3A6520]">Rp 560.000</span>
                          </div>
                          <p className="text-[11px] text-[#5A5550]">Paket Medium + 2 Meja Lipat & 8 Kursi Lipat</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeInfoTab === "sewa" && (
                  <div className="flex flex-col gap-5 py-1">
                    {[
                      {
                        category: "Tenda & Perlengkapan Tidur",
                        items: [
                          { name: "Tenda Kapasitas 8–10 Orang", price: "Rp 140.000" },
                          { name: "Tenda Kapasitas 4 Orang", price: "Rp 65.000" },
                          { name: "Sleeping Bag", price: "Rp 15.000" },
                          { name: "Matras (2m x 2m)", price: "Rp 10.000" },
                          { name: "Selimut", price: "Rp 10.000" },
                          { name: "Flysheet", price: "Rp 10.000" },
                          { name: "Hammock", price: "Rp 10.000" },
                        ]
                      },
                      {
                        category: "Peralatan Memasak",
                        items: [
                          { name: "Kompor Portable Besar", price: "Rp 20.000" },
                          { name: "Kompor Portable Kecil", price: "Rp 10.000" },
                          { name: "Cooking Nesting", price: "Rp 10.000" },
                          { name: "Grill Pan", price: "Rp 10.000" },
                          { name: "Gas Portable", price: "Rp 10.000" },
                        ]
                      },
                      {
                        category: "Furnitur",
                        items: [
                          { name: "Meja Lipat", price: "Rp 20.000" },
                          { name: "Kursi Lipat", price: "Rp 10.000" },
                        ]
                      },
                      {
                        category: "Lain-lain",
                        items: [
                          { name: "Kayu Bakar", price: "Rp 45.000" },
                          { name: "Lampu Tenda", price: "Rp 10.000" },
                          { name: "Rol Kabel", price: "Rp 5.000" },
                        ]
                      }
                    ].map((cat, catIdx) => (
                      <div key={catIdx} className="flex flex-col">
                        <div className="text-[10px] font-bold text-[#3A6520] tracking-[0.12em] uppercase mb-1.5 pb-1 border-b border-black/5">
                          {cat.category}
                        </div>
                        <div className="flex flex-col divide-y divide-black/5">
                          {cat.items.map((item, itemIdx) => (
                            <div key={itemIdx} className="flex justify-between py-1.5 text-[13px]">
                              <span className="text-[#5A5550]">{item.name}</span>
                              <span className="font-semibold text-[#2C2C2A]">{item.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <a
                  href={`${waUrl}?text=Halo,%20saya%20ingin%20reservasi%20Gumuk%20Petung%20Camp`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#3A6520] text-white text-[12px] font-bold rounded-full hover:bg-[#2D5016] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Reservasi via WhatsApp
                </a>
                <a
                  href="https://maps.app.goo.gl/NeYgxRwN3ed3unXdA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 border border-[#3A6520] text-[#3A6520] text-[12px] font-bold rounded-full hover:bg-[#3A6520]/5 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Buka di Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter nav={nav} settings={settings} />
    </>
  );
}
