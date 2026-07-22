import React from "react";
import { Users, Home, Map, Building2, ChevronRight } from "lucide-react";
import { Page } from "../types";
import { IMGS } from "../config/images";
import { RollingCounter } from "../components/RollingCounter";
import { SiteFooter } from "../components/SiteFooter";

interface ProfilePageProps {
  nav: (p: Page) => void;
  settings: any;
}

export function ProfilePage({ nav, settings }: ProfilePageProps) {
  return (
    <>
      {/* Profile Hero ──────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ height: "40vh", minHeight: 300 }}>
        <img
          src={IMGS.profileHero}
          alt="Panorama Gunung Merapi dari kejauhan"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/52" />
        <div className="relative h-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col justify-end pb-14">
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
      <section className="py-24 lg:py-36">
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
                Dusun Petung berada di Desa Sidorejo, Kecamatan Kemalang, Kabupaten Klaten, berada di kaki barat daya Gunung Merapi. Wilayah ini memiliki pemandangan alam yang indah, udara sejuk, serta tanah vulkanik yang subur sehingga sangat mendukung kegiatan pertanian, peternakan, dan pariwisata.
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
      <section className="py-20 bg-[#F0EBE3]">
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
            {[
              { Icon: Users, value: "3.247", label: "Jiwa Penduduk" },
              { Icon: Home, value: "892", label: "Kepala Keluarga" },
              { Icon: Map, value: "485 Ha", label: "Luas Wilayah" },
              { Icon: Building2, value: "1 RW / 2 RT", label: "Pembagian Administrasi" },
            ].map(({ Icon, value, label }) => (
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
            ))}
          </div>
        </div>
      </section>

      {/* Short History — Timeline ─────────────────────────── */}
      <section className="py-24 lg:py-36">
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
      <section className="py-24 lg:py-36 bg-[#F0EBE3]">
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
                img: IMGS.pot3,
                alt: "Kegiatan komunitas dan gotong royong warga dusun",
                title: "Live In Bersama Warga",
                desc: "Rasakan pengalaman tinggal bersama warga dan mengenal secara langsung kehidupan, budaya, serta aktivitas sehari-hari masyarakat Dusun Petung.",
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
    </>
  );
}
