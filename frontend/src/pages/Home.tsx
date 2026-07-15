import React from "react";
import { ArrowRight, Phone, MapPin } from "lucide-react";
import { Page } from "../types";
import { IMGS } from "../config/images";
import { SiteFooter } from "../components/SiteFooter";

interface HomePageProps {
  nav: (p: Page) => void;
  settings: any;
}

export function HomePage({ nav, settings }: HomePageProps) {
  const villageName = settings?.village_name || "Dusun Petung";
  const heroImg = (settings?.hero_image_url && settings.hero_image_url.trim()) ? settings.hero_image_url : IMGS.hero;
  const phoneVal = settings?.phone_number || "085138097972";
  let formattedPhone = phoneVal.replace(/[^0-9]/g, "");
  if (formattedPhone.startsWith("0")) {
    formattedPhone = "62" + formattedPhone.slice(1);
  }
  const waUrl = formattedPhone ? `https://wa.me/${formattedPhone}` : "https://wa.me/6285138097972";

  return (
    <>
      {/* Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ height: "68vh", minHeight: 520 }}>
        <img
          src={heroImg}
          alt={`Hamparan hijau kaki Gunung Merapi di ${villageName}`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-black/10" />

        <div className="relative h-full max-w-7xl mx-auto px-6 lg:px-12 flex items-center">
          <div style={{ maxWidth: 520 }}>
            <span className="inline-block text-white/55 text-[11px] font-semibold tracking-[0.18em] uppercase mb-5">
              Desa Sidorejo · Kecamatan Kemalang · Kabupaten Klaten · Jawa Tengah
            </span>
            <h1
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(2.5rem, 5vw, 3.75rem)", lineHeight: 1.08 }}
              className="font-extrabold text-white mb-5"
            >
              {villageName}
            </h1>
            <p className="text-white/75 text-[17px] leading-[1.7] mb-9" style={{ maxWidth: 420 }}>
              Dusun di kaki Gunung Merapi — tempat alam yang indah, warga yang hangat, dan pengalaman berkemah yang tak terlupakan.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => nav("profile")}
                className="px-7 py-3.5 bg-[#3A6520] text-white text-[13px] font-semibold rounded-full hover:bg-[#2D5016] transition-colors"
              >
                Jelajahi Dusun
              </button>
              <button 
                onClick={() => nav("camp")}
                className="px-7 py-3.5 bg-white/12 text-white text-[13px] font-semibold rounded-full border border-white/25 hover:bg-white/22 transition-colors backdrop-blur-sm"
              >
                Gumuk Petung Camp
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Preview Profile ───────────────────────────────────── */}
      <section className="py-24 lg:py-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-16 lg:gap-28 items-center">

            {/* Image */}
            <div className="relative order-1 lg:order-1">
              <div className="bg-[#D4C9B5]">
                <img
                  src={IMGS.previewProfile}
                  alt="Kabut pagi di bukit sekitar Dusun Petung"
                  className="w-full object-cover"
                  style={{ height: 500 }}
                />
              </div>
              <div className="absolute -bottom-5 -right-5 w-28 h-28 bg-[#3A6520]/8 hidden lg:block" />
            </div>

            {/* Text */}
            <div className="order-2 lg:order-2">
              <span className="text-[#C97C2A] text-[11px] font-bold tracking-[0.18em] uppercase block mb-5">
                Tentang Dusun
              </span>
              <h2
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(2rem, 3.5vw, 3rem)", lineHeight: 1.12 }}
                className="font-extrabold text-[#2C2C2A] mb-6"
              >
                Damai di Kaki<br />Gunung Merapi
              </h2>
              <p className="text-[#5A5550] leading-[1.75] text-[15px] mb-4">
                Dusun Petung terletak di lereng barat daya Gunung Merapi, dikelilingi hamparan sawah, kebun, dan hutan yang hijau sepanjang tahun. Udara sejuk, tanah subur, dan warga yang ramah menjadikan dusun ini tempat yang istimewa.
              </p>
              <p className="text-[#5A5550] leading-[1.75] text-[15px] mb-9">
                Di sinilah kehidupan berjalan dengan ritme alam — gotong royong yang masih terjaga, tradisi yang tetap hidup, dan kebersamaan yang hangat.
              </p>
              <button
                onClick={() => nav("profile")}
                className="inline-flex items-center gap-2 text-[#3A6520] text-[13px] font-bold group hover:gap-3 transition-all"
              >
                Kenali Dusun Petung
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Preview Gumuk Petung Camp ─────────────────────────── */}
      <section className="py-24 lg:py-36 bg-[#1E1E1C]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          {/* Header row */}
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-end mb-14">
            <div>
              <span className="text-[#C97C2A] text-[11px] font-bold tracking-[0.18em] uppercase block mb-5">
                Wisata Utama
              </span>
              <h2
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(2rem, 3.5vw, 3rem)", lineHeight: 1.12 }}
                className="font-extrabold text-white"
              >
                Gumuk Petung<br />Camp
              </h2>
            </div>
            <div>
              <p className="text-white/50 leading-[1.75] text-[15px] mb-7">
                Rasakan pengalaman berkemah di bukit dengan panorama Gunung Merapi yang megah. Nikmati fajar di balik puncak, langit malam penuh bintang, dan udara pagi yang menyegarkan jiwa.
              </p>
              <button onClick={() => nav("camp")} className="inline-flex items-center gap-2 text-[#C97C2A] text-[13px] font-bold hover:gap-3 transition-all">
                Lihat Detail Camp <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Photo grid */}
          <div className="grid grid-cols-12 grid-rows-2 gap-2.5" style={{ height: 520 }}>
            <div className="col-span-7 row-span-2 bg-[#2C2C2A] overflow-hidden">
              <img src={IMGS.campMain} alt="Tenda dan pemandangan Gunung Merapi dari Gumuk Petung Camp" className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700" />
            </div>
            <div className="col-span-5 bg-[#2C2C2A] overflow-hidden">
              <img src={IMGS.campTent} alt="Tenda berkemah saat matahari terbenam" className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700" />
            </div>
            <div className="col-span-3 bg-[#2C2C2A] overflow-hidden">
              <img src={IMGS.campPeak} alt="Puncak gunung menembus awan emas" className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700" />
            </div>
            <div className="col-span-2 bg-[#2C2C2A] overflow-hidden">
              <img src={IMGS.campLake} alt="Tenda berkemah di tepi danau dengan latar pegunungan" className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700" />
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10">
            <a
              href={`${waUrl}?text=Halo,%20saya%20ingin%20reservasi%20Gumuk%20Petung%20Camp`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#3A6520] text-white text-[13px] font-semibold rounded-full hover:bg-[#4a8029] transition-colors"
            >
              <Phone className="w-4 h-4" />
              Reservasi via WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Preview Village Life ──────────────────────────────── */}
      <section className="py-24 lg:py-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-[#C97C2A] text-[11px] font-bold tracking-[0.18em] uppercase block mb-5">
                Kehidupan Dusun
              </span>
              <h2
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(2rem, 3.5vw, 3rem)", lineHeight: 1.12 }}
                className="font-extrabold text-[#2C2C2A]"
              >
                Lebih dekat<br />dengan Petung
              </h2>
            </div>
            <button onClick={() => nav("village-life")} className="hidden lg:inline-flex items-center gap-2 text-[#3A6520] text-[13px] font-bold hover:gap-3 transition-all">
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Asymmetric documentary gallery */}
          <div className="grid grid-cols-12 gap-2.5">
            <div className="col-span-12 lg:col-span-4 bg-[#D4C9B5] overflow-hidden" style={{ height: 580 }}>
              <img src={IMGS.life1} alt="Warga berjalan melalui hutan hijau yang rimbun" className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700" />
            </div>
            <div className="col-span-12 lg:col-span-8 grid grid-cols-2 gap-2.5">
              <div className="bg-[#D4C9B5] overflow-hidden" style={{ height: 280 }}>
                <img src={IMGS.life2} alt="Petani menanam padi di sawah" className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700" />
              </div>
              <div className="bg-[#D4C9B5] overflow-hidden" style={{ height: 280 }}>
                <img src={IMGS.life3} alt="Pawai budaya masyarakat dusun" className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700" />
              </div>
              <div className="col-span-2 bg-[#D4C9B5] overflow-hidden" style={{ height: 286 }}>
                <img src={IMGS.life4} alt="Kehidupan sehari-hari warga dusun" className="w-full h-full object-cover object-top hover:scale-[1.02] transition-transform duration-700" />
              </div>
            </div>
          </div>

        </div>
      </section>

      <SiteFooter nav={nav} settings={settings} />
    </>
  );
}
