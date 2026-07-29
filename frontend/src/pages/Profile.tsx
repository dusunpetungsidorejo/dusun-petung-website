import React from "react";
import { Users, Home, Map, Building2, ChevronRight, ShieldAlert, Heart, Truck, Activity } from "lucide-react";
import { Page } from "../types";
import { IMGS } from "../config/images";
import { RollingCounter } from "../components/RollingCounter";
import { SiteFooter } from "../components/SiteFooter";

interface ProfilePageProps {
  nav: (p: Page) => void;
  settings: any;
}

export function ProfilePage({ nav, settings }: ProfilePageProps) {
  const [demographics, setDemographics] = React.useState<any[]>([]);
  const [krbStats, setKrbStats] = React.useState<any[]>([]);
  const [isMapModalOpen, setIsMapModalOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchDemographics = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const res = await fetch(`${baseUrl}/demographics`);
        if (res.ok) {
          const data = await res.json();
          setDemographics(data);
        }
      } catch (err) {
        console.error("Failed to fetch demographics:", err);
      }
    };
    const fetchKrbStats = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const res = await fetch(`${baseUrl}/krb`);
        if (res.ok) {
          const data = await res.json();
          setKrbStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch KRB stats:", err);
      }
    };

    fetchDemographics();
    fetchKrbStats();
  }, []);

  const defaultDemos = [
    { icon: "Users", value: "3.247", label: "Jiwa Penduduk" },
    { icon: "Home", value: "892", label: "Kepala Keluarga" },
    { icon: "Map", value: "485 Ha", label: "Luas Wilayah" },
    { icon: "Building2", value: "1 RW / 2 RT", label: "Pembagian Administrasi" },
  ];

  const defaultKrbStats = [
    { category: "Kelompok Rentan", name: "Bumil", value: 0, unit: "Jiwa" },
    { category: "Kelompok Rentan", name: "Balita", value: 9, unit: "Jiwa" },
    { category: "Kelompok Rentan", name: "Lansia", value: 28, unit: "Jiwa" },
    { category: "Kelompok Rentan", name: "Kebutuhan Khusus", value: 3, unit: "Jiwa" },
    { category: "Hewan Ternak", name: "Sapi", value: 86, unit: "Ekor" },
    { category: "Hewan Ternak", name: "Kambing", value: 21, unit: "Ekor" },
    { category: "Transportasi", name: "Motor", value: 129, unit: "Unit" },
    { category: "Transportasi", name: "Mobil", value: 11, unit: "Unit" },
    { category: "Transportasi", name: "Pick Up", value: 2, unit: "Unit" },
    { category: "Transportasi", name: "Truk", value: 5, unit: "Unit" }
  ];

  const displayDemos = demographics.length > 0 ? demographics : defaultDemos;
  const displayKrbStats = krbStats.length > 0 ? krbStats : defaultKrbStats;

  // Group KRB stats by category
  const groupedKrb = displayKrbStats.reduce((acc: Record<string, any[]>, item) => {
    const cat = item.category || "Lainnya";
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(item);
    return acc;
  }, {});

  const ICON_MAP: Record<string, any> = {
    Users,
    Home,
    Map,
    Building2
  };

  return (
    <>
      {/* Profile Hero ──────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-16 pb-12 h-auto sm:py-0 sm:h-[40vh] sm:min-h-[300px]">
        <img
          src={IMGS.profileHero}
          alt="Panorama Gunung Merapi dari kejauhan"
          className="absolute inset-0 w-full h-full object-cover object-[50%_75%] scale-[1.15]"
        />
        <div className="absolute inset-0 bg-black/52" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 flex flex-col justify-end h-auto sm:h-full pb-0 sm:pb-20">
          <span className="text-white/50 text-[11px] font-bold tracking-[0.18em] uppercase block mb-3">
            Profil Dusun
          </span>
          <h1
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.1 }}
            className="font-extrabold text-white mb-3"
          >
            Dusun Petung
          </h1>
          <p className="text-white/65 text-[15px] leading-[1.7]" style={{ maxWidth: 460 }}>
            Mengenal lebih dalam identitas, sejarah, dan potensi dusun di kaki Gunung Merapi.
          </p>
        </div>
      </section>

      {/* About the Village ─────────────────────────────────── */}
      <section className="py-8 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-16 lg:gap-28 items-start">

            {/* Text */}
            <div>
              <span className="text-[#C97C2A] text-[11px] font-bold tracking-[0.18em] uppercase block mb-5">
                Tentang Dusun
              </span>
              <h2
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.75rem, 3vw, 2.75rem)", lineHeight: 1.15 }}
                className="font-extrabold text-[#2C2C2A] mb-7"
              >
                Identitas <br className="hidden sm:inline" />Dusun Petung
              </h2>
              <p className="text-[#5A5550] leading-[1.75] text-[15px] mb-4">
                Dusun Petung berada di Desa Sidorejo, Kecamatan Kemalang, Kabupaten Klaten, berada di kaki tenggara Gunung Merapi. Wilayah ini memiliki pemandangan alam yang indah, udara sejuk, serta tanah vulkanik yang subur sehingga sangat mendukung kegiatan pertanian, peternakan, dan pariwisata.
              </p>
              <p className="text-[#5A5550] leading-[1.75] text-[15px] mb-4">
                Mayoritas warga bekerja sebagai petani dan peternak. Kehidupan masyarakat dipengaruhi aktivitas Merapi yang menghadirkan risiko erupsi, namun juga membawa material vulkanik yang menyuburkan lahan.
              </p>
              <p className="text-[#5A5550] leading-[1.75] text-[15px]">
                Semangat gotong royong, budaya Jawa yang masih lestari, dan potensi wisata alam menjadikan Dusun Petung sebagai dusun yang asri, harmonis, dan kaya potensi.
              </p>
            </div>

            {/* Image */}
            <div className="bg-[#D4C9B5]">
              <img
                src="/images/profile/description.jpg"
                alt="Hamparan sawah hijau dilihat dari udara di sekitar Dusun Petung"
                className="w-full object-cover h-[280px] sm:h-[380px] lg:h-[540px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Village Statistics ────────────────────────────────── */}
      <section className="py-16 bg-[#F0EBE3]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <span className="text-[#C97C2A] text-[11px] font-bold tracking-[0.18em] uppercase block mb-3">
              Data Dusun
            </span>
            <h2
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.75rem, 3vw, 2.5rem)", lineHeight: 1.2 }}
              className="font-extrabold text-[#2C2C2A]"
            >
              Dusun dalam Angka
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {displayDemos.map(({ icon, value, label }) => {
              const Icon = ICON_MAP[icon] || Users;
              return (
                <div key={label} className="bg-white p-4 sm:p-6 lg:p-8 border border-black/5 flex flex-col justify-between">
                  <div>
                    <Icon className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-[#3A6520] mb-4 sm:mb-5" strokeWidth={1.5} />
                    <div
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      className={`font-extrabold text-[#2C2C2A] leading-none mb-2 ${
                        value.length > 7
                          ? "text-[18px] xs:text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px]"
                          : "text-[24px] xs:text-[26px] sm:text-[32px] md:text-[36px] lg:text-[40px]"
                      }`}
                    >
                      <RollingCounter value={value} />
                    </div>
                  </div>
                  <div className="text-[11px] sm:text-[12px] lg:text-[13px] text-[#7A7065] font-medium leading-tight">{label}</div>
                </div>
              );
            })}
          </div>

          {/* Mitigasi & Kesiapsiagaan Bencana (KRB) */}
          <div className="mt-12 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-black/5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/5 pb-6 mb-8">
              <div>
                <span className="text-[#C97C2A] text-[11px] font-bold tracking-[0.18em] uppercase block mb-2">
                  Mitigasi & Kesiapsiagaan Bencana (KRB)
                </span>
                <h3 
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  className="text-2xl font-extrabold text-[#2C2C2A]"
                >
                  Data Kerentanan & Aset Evakuasi
                </h3>
              </div>
              <div className="flex items-center gap-2 bg-[#FDF2F2] border border-red-100 px-4 py-2 rounded-xl text-xs font-semibold text-[#9B1C1C]">
                <ShieldAlert className="w-4 h-4 text-red-600 animate-pulse" />
                Kawasan Rawan Bencana (KRB)
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
              {Object.entries(groupedKrb).map(([category, items]) => {
                let categoryIcon = <ShieldAlert className="w-5 h-5 text-[#C97C2A]" />;
                let categoryColorClass = "border-[#F0EBE3]";
                
                if (category === "Kelompok Rentan") {
                  categoryIcon = <Heart className="w-5 h-5 text-red-500 fill-red-500" />;
                  categoryColorClass = "border-red-100 bg-red-50/10";
                } else if (category === "Hewan Ternak") {
                  categoryIcon = <Activity className="w-5 h-5 text-green-600" />;
                  categoryColorClass = "border-green-100 bg-green-50/10";
                } else if (category === "Transportasi") {
                  categoryIcon = <Truck className="w-5 h-5 text-blue-500" />;
                  categoryColorClass = "border-blue-100 bg-blue-50/10";
                }

                return (
                  <div key={category} className={`border p-5 rounded-xl ${categoryColorClass} flex flex-col justify-between shadow-sm`}>
                    <div>
                      <div className="flex items-center gap-2.5 mb-5 border-b border-black/5 pb-3">
                        {categoryIcon}
                        <h4 className="font-bold text-[#2C2C2A] text-sm tracking-wide uppercase">{category}</h4>
                      </div>
                      <div className="space-y-4">
                        {items.map((item: any) => (
                          <div key={item.name} className="flex items-center justify-between">
                            <span className="text-[13.5px] text-[#5A5550] font-medium">{item.name}</span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-[16px] font-extrabold text-[#2C2C2A]">{item.value}</span>
                              <span className="text-[11px] text-[#7A7065] font-medium">{item.unit}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Demographic Map */}
          <div className="mt-12 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-black/5">
            <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-12 items-center">
              <div>
                <span className="text-[#C97C2A] text-[11px] font-bold tracking-[0.18em] uppercase block mb-3">
                  Peta Administrasi
                </span>
                <h3 
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  className="text-2xl font-extrabold text-[#2C2C2A] mb-4 leading-snug"
                >
                  Pemetaan Wilayah & Demografi Dusun
                </h3>
                <p className="text-[14px] text-[#7A7065] leading-relaxed mb-6">
                  Peta administratif resmi Dusun Petung, Desa Sidorejo. Peta ini menyajikan pembagian batas RT, sebaran hunian warga (homestay), serta tata guna lahan produktif mulai dari kawasan perkebunan hingga zona kehutanan di lereng Gunung Merapi.
                </p>
                <button
                  onClick={() => setIsMapModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#3A6520] hover:bg-[#2D5016] text-white text-[12.5px] font-bold rounded-lg transition-colors shadow-sm"
                >
                  Buka Peta Detail
                </button>
              </div>
              <div 
                onClick={() => setIsMapModalOpen(true)}
                className="relative rounded-xl overflow-hidden border border-black/[0.08] bg-[#FAF9F5] p-3 cursor-pointer group shadow-inner"
              >
                <img 
                  src={settings?.map_image_url || "/images/profile/map.webp"} 
                  alt="Peta Dusun Petung" 
                  className="w-full h-auto rounded-lg object-contain max-h-[340px] mx-auto group-hover:scale-[1.01] transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white/90 text-[#2C2C2A] px-4 py-2 rounded-full text-xs font-semibold shadow-md backdrop-blur-sm">
                    Klik untuk memperbesar
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Short History — Timeline ─────────────────────────── */}
      <section className="py-8 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <span className="text-[#C97C2A] text-[11px] font-bold tracking-[0.18em] uppercase block mb-5">
              Sejarah
            </span>
            <h2
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.75rem, 3vw, 2.75rem)", lineHeight: 1.15 }}
              className="font-extrabold text-[#2C2C2A]"
            >
              Jejak Perjalanan <br className="hidden sm:inline" />Dusun Petung
            </h2>
          </div>

          <div className="relative max-w-3xl">
            <div className="absolute left-[7px] top-0 bottom-0 w-px bg-black/10" />

            <div className="flex flex-col gap-12">
              {[
                {
                  year: "Awal Permukiman",
                  title: "Terbentuknya Dusun Petung",
                  desc: "Dusun Petung berkembang sebagai kawasan permukiman masyarakat yang mengandalkan sektor pertanian dan peternakan. Kehidupan warga tumbuh dengan memanfaatkan kesuburan lahan dan semangat kebersamaan.",
                },
                {
                  year: "Perkembangan Masyarakat",
                  title: "Lahirnya Tradisi Lokal",
                  desc: "Seiring berkembangnya kehidupan bermasyarakat, lahirlah berbagai tradisi seperti Nyadran, Babat Makam, Gumbretan, Wiwit, dan kenduri sebagai wujud rasa syukur, doa bersama, serta penguatan hubungan sosial antar warga.",
                },
                {
                  year: "Perkembangan Seni Budaya",
                  title: "Berkembangnya Kesenian Tradisional",
                  desc: "Dusun Petung pernah menjadi tempat berkembangnya berbagai kesenian tradisional, seperti ketoprak, gamelan, drama perjuangan, dan jathilan yang kerap ditampilkan pada acara-acara masyarakat.",
                },
                {
                  year: "Era Modernisasi",
                  title: "Perubahan Sistem Pertanian",
                  desc: "Perkembangan teknologi membawa perubahan pada sistem pertanian menjadi lebih modern dan efisien. Di sisi lain, aktivitas kesenian tradisional mulai berkurang karena tingginya biaya penyelenggaraan dan menurunnya minat masyarakat untuk meneruskannya.",
                },
                {
                  year: "Masa Kini",
                  title: "Menjaga Warisan Leluhur",
                  desc: "Di tengah perubahan zaman, masyarakat Dusun Petung tetap melestarikan tradisi yang telah diwariskan secara turun-temurun. Berbagai kegiatan adat masih rutin dilaksanakan sebagai bagian dari identitas dan kekayaan budaya dusun.",
                },
                {
                  year: "Masa Kini",
                  title: "Berdirinya Gumuk Petung Camp",
                  desc: "Pada akhir tahun 2025, masyarakat Dusun Petung menginisiasi pembangunan Gumuk Petung Camp sebagai ruang berkumpul dan berkegiatan bagi para pemuda. Camp ini dibangun agar generasi muda memiliki wadah untuk menyalurkan kreativitas, mengisi waktu luang dengan kegiatan yang bermanfaat, serta berkontribusi dalam pengembangan dusun.",
                },
              ].map(({ year, title, desc }, idx) => (
                <div key={idx} className="pl-9 relative">
                  <div className="absolute left-0 top-[6px] w-3.5 h-3.5 rounded-full border-2 border-[#3A6520] bg-[#F7F4EF]" />
                  <span
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    className="text-2xl font-extrabold text-[#3A6520] block mb-1"
                  >
                    {year}
                  </span>
                  <h3
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    className="text-base font-bold text-[#2C2C2A] mb-2"
                  >
                    {title}
                  </h3>
                  <p className="text-[#5A5550] text-[14px] leading-[1.75]">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Village Potentials ─────────────────────────────────── */}
      <section className="py-8 lg:py-16 bg-[#F0EBE3]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <span className="text-[#C97C2A] text-[11px] font-bold tracking-[0.18em] uppercase block mb-5">
              Potensi Dusun
            </span>
            <h2
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.75rem, 3vw, 2.75rem)", lineHeight: 1.15 }}
              className="font-extrabold text-[#2C2C2A]"
            >
              Yang Membuat <br className="hidden sm:inline" />Dusun Ini Istimewa
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                img: "/images/profile/Harmoni di Lereng Merapi.webp",
                alt: "Pemandangan alam pegunungan sekitar Dusun Petung",
                title: "Harmoni di Lereng Merapi",
                desc: "Dipeluk oleh lereng Gunung Merapi, Dusun Petung dianugerahi bentang alam yang subur. Dari tanah inilah tumbuh pertanian, peternakan, dan pembuatan arang yang menjadi bagian dari kehidupan masyarakat.",
                cta: "Jelajahi",
                page: "village-life" as Page,
              },
              {
                img: "/images/profile/Tradisi Turun-Temurun.webp",
                alt: "Petani di sawah Dusun Petung",
                title: "Tradisi Turun-Temurun",
                desc: "Melalui tradisi Nyadran, Babat Makam, Gumbretan, Wiwit, dan Mitoni, masyarakat Dusun Petung terus merawat warisan leluhur yang mempererat persaudaraan dan memperkokoh nilai gotong royong.",
                cta: "Kenali",
                page: "village-life" as Page,
              },
              {
                img: "/images/profile/Gumuk Petung Camp.webp",
                alt: "Gumuk Petung Camp dengan latar Gunung Merapi",
                title: "Gumuk Petung Camp",
                desc: "Destinasi wisata berbasis komunitas yang menawarkan pengalaman berkemah dengan panorama alam yang asri sekaligus mendukung pemberdayaan pemuda Dusun Petung.",
                cta: "Reservasi",
                page: "camp" as Page,
              },
              {
                img: "/images/livein/Description.png",
                alt: "Kegiatan komunitas dan gotong royong warga dusun",
                title: "Live In Bersama Warga",
                desc: "Rasakan pengalaman tinggal bersama warga dan mengenal secara langsung kehidupan, budaya, serta aktivitas sehari-hari masyarakat Dusun Petung yang penuh kehangatan.",
                cta: "Ikuti Pengalaman",
                page: "livein" as Page,
              },
            ].map(({ img, alt, title, desc, cta, page }) => (
              <div 
                key={title} 
                className="bg-white border border-black/5 overflow-hidden group cursor-pointer"
                onClick={() => nav(page)}
              >
                <div className="overflow-hidden bg-[#D4C9B5]" style={{ height: 200 }}>
                  <img
                    src={img}
                    alt={alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    className="text-[15px] font-bold text-[#2C2C2A] mb-2"
                  >
                    {title}
                  </h3>
                  <p className="text-[#7A7065] text-[13px] leading-[1.65] mb-5">{desc}</p>
                  <button className="inline-flex items-center gap-1.5 text-[#3A6520] text-[12px] font-bold group-hover:gap-2.5 transition-all">
                    {cta} <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter nav={nav} settings={settings} />

      {/* Map Lightbox Modal */}
      {isMapModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setIsMapModalOpen(false)}
        >
          <div className="absolute top-4 right-4 z-50">
            <button 
              onClick={() => setIsMapModalOpen(false)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>
          <div 
            className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={settings?.map_image_url || "/images/profile/map.webp"} 
              alt="Peta Dusun Petung Detail" 
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl bg-white p-2"
            />
          </div>
        </div>
      )}
    </>
  );
}
