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
      <section className="relative overflow-hidden pt-16 pb-12 h-auto sm:py-0 sm:h-[68vh] sm:min-h-[520px]">
        <img
          src={heroImg}
          alt={`Hamparan hijau kaki Gunung Merapi di ${villageName}`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-black/10" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 flex items-center h-auto sm:h-full pb-0 sm:pb-16">
          <div style={{ maxWidth: 520 }}>
            <span className="inline-block text-white/55 text-[10px] sm:text-[11px] font-semibold tracking-[0.10em] sm:tracking-[0.18em] uppercase mb-5">
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
      <section className="py-8 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-16 lg:gap-28 items-center">

            {/* Image */}
            <div className="relative order-1 lg:order-1">
              <div className="bg-[#D4C9B5]">
                <img
                  src={IMGS.previewProfile}
                  alt="Kabut pagi di bukit sekitar Dusun Petung"
                  className="w-full object-cover h-[280px] sm:h-[380px] lg:h-[500px]"
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
                Damai di Kaki <br className="hidden sm:inline" />Gunung Merapi
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
      <section className="py-8 lg:py-16 bg-[#1E1E1C]">
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
                Gumuk Petung <br className="hidden sm:inline" />Camp
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
          <div className="grid grid-cols-12 gap-2.5 h-auto md:h-[520px] md:grid-rows-2">
            <div className="col-span-12 md:col-span-7 md:row-span-2 bg-[#2C2C2A] overflow-hidden h-[240px] sm:h-[320px] md:h-full">
              <img src={IMGS.campMain} alt="Tenda dan pemandangan Gunung Merapi dari Gumuk Petung Camp" className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700" />
            </div>
            <div className="col-span-6 md:col-span-5 bg-[#2C2C2A] overflow-hidden h-[130px] sm:h-[180px] md:h-full">
              <img src={IMGS.campTent} alt="Tenda berkemah saat matahari terbenam" className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700" />
            </div>
            <div className="col-span-6 md:col-span-3 bg-[#2C2C2A] overflow-hidden h-[130px] sm:h-[180px] md:h-full">
              <img src={IMGS.campPeak} alt="Puncak gunung menembus awan emas" className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700" />
            </div>
            <div className="col-span-12 md:col-span-2 bg-[#2C2C2A] overflow-hidden h-[130px] sm:h-[180px] md:h-full">
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

      {/* Preview Live In ──────────────────────────────────── */}
      <section className="py-8 lg:py-16 bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-16 lg:gap-24 items-center">
            
            {/* Text Content */}
            <div>
              <span className="text-[#C97C2A] text-[11px] font-bold tracking-[0.18em] uppercase block mb-5">
                Program Live In
              </span>
              <h2
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(2rem, 3.5vw, 3rem)", lineHeight: 1.12 }}
                className="font-extrabold text-[#2C2C2A] mb-6"
              >
                Hidup Membaur <br />Bersama Warga Dusun
              </h2>
              <p className="text-[#5A5550] leading-[1.75] text-[15px] mb-4">
                Rasakan keaslian hidup di pedesaan lereng Merapi dengan tinggal langsung di rumah-rumah warga Dusun Petung. Program ini dirancang untuk mengajak Anda membaur dalam rutinitas harian pemilik rumah.
              </p>
              <p className="text-[#5A5550] leading-[1.75] text-[15px] mb-9">
                Belajar memerah susu sapi segar di pagi hari, memanen sayuran organik di ladang, hingga menikmati makan malam hangat bersama keluarga angkat Anda dalam suasana damai yang jauh dari kebisingan kota.
              </p>
              <button
                onClick={() => nav("livein")}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#3A6520] hover:bg-[#2D5016] text-white text-[13px] font-semibold rounded-full transition-all"
              >
                Pilih Rumah Live In
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Visual Graphic Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden aspect-[4/5] bg-gray-100 border border-black/[0.04]">
                  <img 
                    src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=800&fit=crop&auto=format" 
                    alt="Pemandangan bukit hijau asri lereng gunung" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-square bg-gray-100 border border-black/[0.04]">
                  <img 
                    src="https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&h=600&fit=crop&auto=format" 
                    alt="Jalan setapak pepohonan hijau rindang" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="rounded-2xl overflow-hidden aspect-square bg-gray-100 border border-black/[0.04]">
                  <img 
                    src="https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?w=600&h=600&fit=crop&auto=format" 
                    alt="Danau alam tenang dikelilingi hutan hijau" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-[4/5] bg-gray-100 border border-black/[0.04]">
                  <img 
                    src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=800&fit=crop&auto=format" 
                    alt="Lembah pegunungan asri pagi hari" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Preview Village Life ──────────────────────────────── */}
      <section className="py-8 lg:py-16">
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
                Lebih dekat <br className="hidden sm:inline" />dengan Petung
              </h2>
            </div>
            <button onClick={() => nav("village-life")} className="hidden lg:inline-flex items-center gap-2 text-[#3A6520] text-[13px] font-bold hover:gap-3 transition-all">
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Asymmetric documentary gallery */}
          <div className="grid grid-cols-12 gap-2.5">
            <div className="col-span-12 lg:col-span-4 bg-[#D4C9B5] overflow-hidden h-[300px] sm:h-[400px] lg:h-[580px]">
              <img src={IMGS.life1} alt="Warga berjalan melalui hutan hijau yang rimbun" className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700" />
            </div>
            <div className="col-span-12 lg:col-span-8 grid grid-cols-2 gap-2.5">
              <div className="bg-[#D4C9B5] overflow-hidden h-[140px] sm:h-[200px] lg:h-[280px]">
                <img src={IMGS.life2} alt="Petani menanam padi di sawah" className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700" />
              </div>
              <div className="bg-[#D4C9B5] overflow-hidden h-[140px] sm:h-[200px] lg:h-[280px]">
                <img src={IMGS.life3} alt="Pawai budaya masyarakat dusun" className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700" />
              </div>
              <div className="col-span-2 bg-[#D4C9B5] overflow-hidden h-[150px] sm:h-[220px] lg:h-[286px]">
                <img src={IMGS.life4} alt="Kehidupan sehari-hari warga dusun" className="w-full h-full object-cover object-top hover:scale-[1.02] transition-transform duration-700" />
              </div>
            </div>
          </div>

          {/* Mobile-only CTA */}
          <div className="mt-10 text-center lg:hidden">
            <button onClick={() => nav("village-life")} className="inline-flex items-center gap-2 px-7 py-3.5 border border-black/[0.09] text-[#2C2C2A] text-[13px] font-bold rounded-full hover:bg-[#FAF9F5] transition-colors">
              Lihat Semua Kegiatan <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      <SiteFooter nav={nav} settings={settings} />
    </>
  );
}
