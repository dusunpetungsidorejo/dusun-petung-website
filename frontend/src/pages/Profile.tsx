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
          <div className="grid lg:grid-cols-[1fr_1fr] gap-16 lg:gap-28 items-center">

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
                Dusun Petung terletak di Desa Sidorejo, Kecamatan Kemalang, Kabupaten Klaten, Jawa Tengah. Berada di kaki barat daya Gunung Merapi — salah satu gunung berapi paling aktif di Indonesia — dusun ini dianugerahi pemandangan alam yang luar biasa.
              </p>
              <p className="text-[#5A5550] leading-[1.75] text-[15px] mb-4">
                Hamparan sawah yang membentang hijau, kebun yang subur, dan hutan yang rimbun menjadi bagian dari keseharian warganya. Udara sejuk dan tanah vulkanik yang kaya menjadikan wilayah ini sangat produktif.
              </p>
              <p className="text-[#5A5550] leading-[1.75] text-[15px]">
                Masyarakat Dusun Petung dikenal dengan semangat gotong royong yang masih terjaga erat. Kearifan lokal dan nilai kebersamaan menjadi fondasi kuat dalam setiap sendi kehidupan sosial warga.
              </p>
            </div>

            {/* Image */}
            <div className="bg-[#D4C9B5]">
              <img
                src={IMGS.aboutVillage}
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
                  year: "1830",
                  title: "Awal Permukiman",
                  desc: "Wilayah Dusun Petung mulai dihuni oleh masyarakat yang datang setelah aktivitas Gunung Merapi mereda. Lahan yang subur dan sumber air yang melimpah menjadi daya tarik utama.",
                },
                {
                  year: "1945",
                  title: "Era Kemerdekaan",
                  desc: "Dusun Petung turut serta dalam semangat perjuangan kemerdekaan Indonesia. Warga bersatu padu membangun fondasi kehidupan baru yang merdeka dan bermartabat.",
                },
                {
                  year: "1980",
                  title: "Berkembangnya Pertanian",
                  desc: "Sistem irigasi diperbaiki dan produktivitas pertanian meningkat signifikan. Dusun Petung mulai dikenal sebagai penghasil sayuran and hasil bumi berkualitas tinggi.",
                },
                {
                  year: "2010",
                  title: "Erupsi Merapi & Bangkit Bersama",
                  desc: "Erupsi besar Gunung Merapi menjadi ujian terberat. Dengan semangat gotong royong yang mengakar, warga Dusun Petung bangkit dan membangun kembali kehidupan mereka.",
                },
                {
                  year: "2019",
                  title: "Lahirnya Gumuk Petung Camp",
                  desc: "Potensi wisata alam mulai dikembangkan secara serius. Gumuk Petung Camp didirikan sebagai destinasi berkemah berbasis komunitas yang mengedepankan keaslian alam dan keramahan warga.",
                },
              ].map(({ year, title, desc }) => (
                <div key={year} className="pl-9 relative">
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
                img: IMGS.pot1,
                alt: "Pemandangan alam pegunungan sekitar Dusun Petung",
                title: "Alam yang Murni",
                desc: "Hamparan sawah, kebun, dan hutan yang hijau membentang mengelilingi dusun sepanjang tahun.",
                cta: "Jelajahi",
              },
              {
                img: IMGS.pot2,
                alt: "Petani di sawah Dusun Petung",
                title: "Pertanian Subur",
                desc: "Tanah vulkanik Gunung Merapi menjadikan lahan di sini sangat produktif dan kaya hasil bumi.",
                cta: "Pelajari",
              },
              {
                img: IMGS.pot3,
                alt: "Kegiatan komunitas dan gotong royong warga dusun",
                title: "Komunitas Hangat",
                desc: "Gotong royong dan kearifan lokal yang masih hidup kuat dalam keseharian warga Dusun Petung.",
                cta: "Temukan",
              },
              {
                img: IMGS.pot4,
                alt: "Gumuk Petung Camp dengan latar Gunung Merapi",
                title: "Gumuk Petung Camp",
                desc: "Destinasi berkemah berbasis komunitas dengan panorama Gunung Merapi yang memukau.",
                cta: "Reservasi",
              },
            ].map(({ img, alt, title, desc, cta }) => (
              <div key={title} className="bg-white border border-black/5 overflow-hidden group cursor-pointer">
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
