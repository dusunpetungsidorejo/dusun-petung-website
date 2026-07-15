import React from "react";
import { 
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
  Instagram 
} from "lucide-react";
import { Page } from "../types";
import { Tiktok } from "../components/Tiktok";
import { SiteFooter } from "../components/SiteFooter";

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

  const activities = [
    { img: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&h=420&fit=crop&auto=format", icon: Mountain, title: "Berkemah", desc: "Rasakan malam di alam terbuka dengan bintang sebagai atap dan semilir gunung sebagai selimut." },
    { img: "https://images.unsplash.com/photo-1470246973918-29a93221c455?w=600&h=420&fit=crop&auto=format", icon: Sunrise, title: "Menyambut Fajar", desc: "Saksikan matahari terbit di balik puncak Merapi dari ketinggian bukit yang tenang." },
    { img: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=600&h=420&fit=crop&auto=format", icon: Star, title: "Mengamati Bintang", desc: "Langit malam yang bersih di kaki Merapi menawarkan pengalaman stargazing yang tak tertandingi." },
    { img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=420&fit=crop&auto=format", icon: Camera, title: "Fotografi Alam", desc: "Setiap sudut menawarkan komposisi indah — dari panorama puncak hingga kabut pagi yang dramatis." },
    { img: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&h=420&fit=crop&auto=format", icon: Wind, title: "Relaksasi Alam", desc: "Biarkan udara pegunungan dan keheningan alam memulihkan pikiran dan jiwa Anda." },
    { img: "https://images.unsplash.com/photo-1526491109672-74740652b963?w=600&h=420&fit=crop&auto=format", icon: Flame, title: "Api Unggun", desc: "Kumpul bersama di sekitar api unggun, berbagi cerita, dan menikmati hangatnya malam bersama." },
  ];

  const facilities = [
    { icon: Mountain, label: "Area Camping" },
    { icon: Car, label: "Parkir Luas" },
    { icon: Droplets, label: "Toilet Bersih" },
    { icon: Star, label: "Musala" },
    { icon: Eye, label: "Dek Panorama" },
    { icon: Umbrella, label: "Shelter" },
    { icon: Info, label: "Pusat Informasi" },
    { icon: Flame, label: "Area Api Unggun" },
  ];

  const galleryImgs = [
    { src: "https://images.unsplash.com/photo-1470246973918-29a93221c455?w=900&h=640&fit=crop&auto=format", alt: "Kabut tipis di bukit saat fajar, suasana pagi yang tenang" },
    { src: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=700&h=500&fit=crop&auto=format", alt: "Tenda berkemah berlatar matahari terbenam yang dramatis" },
    { src: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=700&h=500&fit=crop&auto=format", alt: "Area camping di bawah langit malam berbintang" },
    { src: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=700&h=500&fit=crop&auto=format", alt: "Tenda camping dengan Bima Sakti di langit malam" },
    { src: "https://images.unsplash.com/photo-1526491109672-74740652b963?w=900&h=640&fit=crop&auto=format", alt: "Api unggun di atas bukit di bawah langit berbintang" },
    { src: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=700&h=500&fit=crop&auto=format", alt: "Lembah berkabut saat fajar dengan sinar matahari menerobos" },
    { src: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=700&h=500&fit=crop&auto=format", alt: "Tenda di tepi danau dengan latar pegunungan hijau" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ height: "64vh", minHeight: 500 }}>
        <img
          src="https://images.unsplash.com/photo-1763224017831-59e2b1a40882?w=1600&h=900&fit=crop&auto=format"
          alt="Puncak Gunung Merapi menembus awan emas saat fajar"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-black/15" />
        <div className="relative h-full max-w-7xl mx-auto px-6 lg:px-12 flex items-center">
          <div style={{ maxWidth: 540 }}>
            <span className="inline-block text-white/55 text-[11px] font-semibold tracking-[0.18em] uppercase mb-5">
              Wisata Camping · Dusun Petung
            </span>
            <h1
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(2.5rem, 5vw, 3.75rem)", lineHeight: 1.08 }}
              className="font-extrabold text-white mb-5"
            >
              Gumuk Petung<br />Camp
            </h1>
            <p className="text-white/75 text-[17px] leading-[1.7] mb-9" style={{ maxWidth: 420 }}>
              Berkemah di bukit dengan panorama Gunung Merapi yang memukau. Tempat di mana alam berbicara dan jiwa menemukan ketenangannya.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`${waUrl}?text=Halo,%20saya%20ingin%20reservasi%20Gumuk%20Petung%20Camp`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#3A6520] text-white text-[13px] font-semibold rounded-full hover:bg-[#2D5016] transition-colors"
              >
                <Phone className="w-4 h-4" />
                Reservasi via WhatsApp
              </a>
              <a
                href="https://maps.app.goo.gl/NeYgxRwN3ed3unXdA"
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3.5 bg-white/12 text-white text-[13px] font-semibold rounded-full border border-white/25 hover:bg-white/22 transition-colors backdrop-blur-sm"
              >
                Lihat Lokasi
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Gumuk Petung Camp */}
      <section className="py-24 lg:py-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-16 lg:gap-28 items-center mb-20">
            <div>
              <span className="text-[#C97C2A] text-[11px] font-bold tracking-[0.18em] uppercase block mb-5">
                Tentang Destinasi
              </span>
              <h2
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.75rem, 3vw, 2.75rem)", lineHeight: 1.15 }}
                className="font-extrabold text-[#2C2C2A] mb-6"
              >
                Di Mana Alam<br />Menjadi Rumah
              </h2>
              <p className="text-[#5A5550] leading-[1.75] text-[15px] mb-4">
                Gumuk Petung Camp adalah destinasi berkemah berbasis komunitas yang terletak di bukit dusun, menawarkan pemandangan langsung ke arah Gunung Merapi. Pada hari cerah, puncak gunung tampak begitu dekat hingga serasa bisa dijangkau tangan.
              </p>
              <p className="text-[#5A5550] leading-[1.75] text-[15px] mb-4">
                Pagi hari di sini adalah momen paling istimewa — kabut tipis menyelimuti lembah, fajar perlahan mewarnai langit dengan jingga dan emas, dan udara segar pegunungan memenuhi setiap tarikan napas.
              </p>
              <p className="text-[#5A5550] leading-[1.75] text-[15px]">
                Dikelola langsung oleh warga Dusun Petung, setiap kunjungan Anda turut mendukung perekonomian dan kesejahteraan komunitas lokal.
              </p>
            </div>
            <div className="bg-[#D4C9B5]">
              <img
                src="https://images.unsplash.com/photo-1646806512881-1c169782a970?w=900&h=640&fit=crop&auto=format"
                alt="Tenda berkemah dengan latar Gunung Merapi yang megah"
                className="w-full object-cover"
                style={{ height: 500 }}
              />
            </div>
          </div>

          {/* Gallery */}
          <div className="mb-4">
            <span className="text-[#C97C2A] text-[11px] font-bold tracking-[0.18em] uppercase block mb-5">
              Galeri Foto
            </span>
            <h3
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)", lineHeight: 1.2 }}
              className="font-extrabold text-[#2C2C2A] mb-10"
            >
              Rasakan Sebelum<br />Berkunjung
            </h3>
          </div>

          <div className="grid grid-cols-12 gap-2.5">
            {/* Big left */}
            <div className="col-span-12 lg:col-span-6 overflow-hidden bg-[#D4C9B5]" style={{ height: 460 }}>
              <img src={galleryImgs[0].src} alt={galleryImgs[0].alt} className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700" />
            </div>
            {/* Right 2-col stack */}
            <div className="col-span-12 lg:col-span-6 grid grid-cols-2 gap-2.5">
              {[galleryImgs[1], galleryImgs[2], galleryImgs[3], galleryImgs[5]].map((img) => (
                <div key={img.src} className="overflow-hidden bg-[#D4C9B5]" style={{ height: 222 }}>
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700" />
                </div>
              ))}
            </div>
            {/* Bottom wide pair */}
            <div className="col-span-12 lg:col-span-7 overflow-hidden bg-[#D4C9B5]" style={{ height: 360 }}>
              <img src={galleryImgs[4].src} alt={galleryImgs[4].alt} className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700" />
            </div>
            <div className="col-span-12 lg:col-span-5 overflow-hidden bg-[#D4C9B5]" style={{ height: 360 }}>
              <img src={galleryImgs[6].src} alt={galleryImgs[6].alt} className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700" />
            </div>
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
              Apa yang Bisa<br />Anda Lakukan
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
              Semua yang<br />Anda Butuhkan
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-px bg-black/8 border border-black/8">
            {facilities.map(({ icon: Icon, label }) => (
              <div key={label} className="bg-[#F7F4EF] flex flex-col items-center justify-center gap-3 py-10 px-4 text-center">
                <Icon className="w-5 h-5 text-[#3A6520]" strokeWidth={1.5} />
                <span className="text-[13px] font-medium text-[#2C2C2A] leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Visitor Information */}
      <section className="py-24 lg:py-32 bg-[#F0EBE3]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-14">
            <span className="text-[#C97C2A] text-[11px] font-bold tracking-[0.18em] uppercase block mb-5">
              Lokasi & Informasi
            </span>
            <h2
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.75rem, 3vw, 2.75rem)", lineHeight: 1.15 }}
              className="font-extrabold text-[#2C2C2A]"
            >
              Rencanakan<br />Kunjungan Anda
            </h2>
          </div>

          <div className="grid lg:grid-cols-[3fr_2fr] gap-8 items-start">
            {/* Map embed */}
            <div className="bg-[#D4C9B5] overflow-hidden" style={{ height: 440 }}>
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
            <div className="bg-white border border-black/5 p-8 flex flex-col gap-7" style={{ minHeight: 440 }}>
              <div>
                <div className="text-[11px] font-bold text-[#7A7065] tracking-[0.15em] uppercase mb-3">Jam Buka</div>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[15px] font-semibold text-[#2C2C2A] mb-1">Senin – Minggu</div>
                <div className="text-[14px] text-[#5A5550]">06.00 – 22.00 WIB</div>
                <div className="text-[13px] text-[#7A7065] mt-1">Check-in tenda mulai pukul 14.00 WIB</div>
              </div>

              <div className="w-full h-px bg-black/8" />

              <div>
                <div className="text-[11px] font-bold text-[#7A7065] tracking-[0.15em] uppercase mb-3">Harga Tiket</div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-[14px]">
                    <span className="text-[#5A5550]">Tiket masuk</span>
                    <span className="font-semibold text-[#2C2C2A]">Rp 10.000</span>
                  </div>
                  <div className="flex justify-between text-[14px]">
                    <span className="text-[#5A5550]">Sewa tenda</span>
                    <span className="font-semibold text-[#2C2C2A]">Rp 100.000 / malam</span>
                  </div>
                  <div className="flex justify-between text-[14px]">
                    <span className="text-[#5A5550]">Parkir kendaraan</span>
                    <span className="font-semibold text-[#2C2C2A]">Rp 5.000</span>
                  </div>
                </div>
              </div>

              <div className="w-full h-px bg-black/8" />

              <div>
                <div className="text-[11px] font-bold text-[#7A7065] tracking-[0.15em] uppercase mb-3">Alamat</div>
                <p className="text-[14px] text-[#5A5550] leading-[1.65]">
                  Dusun Petung, Desa Sidorejo,<br />
                  Kecamatan Kemalang, Kabupaten Klaten, Jawa Tengah
                </p>
              </div>

              <div className="w-full h-px bg-black/8" />

              <div>
                <div className="text-[11px] font-bold text-[#7A7065] tracking-[0.15em] uppercase mb-3">Media Sosial</div>
                <div className="flex flex-col gap-2">
                  <a
                    href="https://www.instagram.com/gumukpetungcamp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[14px] text-[#5A5550] hover:text-[#3A6520] transition-colors"
                  >
                    <Instagram className="w-4 h-4 text-[#3A6520]" />
                    @gumukpetungcamp
                  </a>
                  <a
                    href="https://www.tiktok.com/@gumukpetungcamp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[14px] text-[#5A5550] hover:text-[#3A6520] transition-colors"
                  >
                    <Tiktok className="w-4 h-4 text-[#3A6520]" />
                    @gumukpetungcamp
                  </a>
                </div>
              </div>

              <div className="w-full h-px bg-black/8" />

              <div className="flex flex-col gap-3">
                <a
                  href={`${waUrl}?text=Halo,%20saya%20ingin%20reservasi%20Gumuk%20Petung%20Camp`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#3A6520] text-white text-[13px] font-semibold rounded-full hover:bg-[#2D5016] transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Reservasi via WhatsApp
                </a>
                <a
                  href="https://maps.app.goo.gl/NeYgxRwN3ed3unXdA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3.5 border border-[#3A6520] text-[#3A6520] text-[13px] font-semibold rounded-full hover:bg-[#3A6520]/5 transition-colors"
                >
                  <MapPin className="w-4 h-4" />
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
