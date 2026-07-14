import { useState, useEffect, useRef } from "react";
import { MapPin, Phone, Menu, X, ArrowRight, ChevronRight, Users, Home, Map, Building2, Mountain, Car, Droplets, Star, Eye, Umbrella, Info, Flame, Camera, Wind, Sunrise, LayoutDashboard, FileText, Settings, Search, Bell, Plus, Pencil, Trash2, Upload, ChevronLeft, LogOut, Filter, Check, Clock, ImageIcon, Instagram, Facebook, Lock, User } from "lucide-react";

type Page = "home" | "profile" | "village-life" | "camp" | "admin";

const IMGS = {
  hero: "https://images.unsplash.com/photo-1671965448417-0582cb361168?w=1600&h=900&fit=crop&auto=format",
  profileHero: "https://images.unsplash.com/photo-1704288037999-3dc5b65a055c?w=1600&h=700&fit=crop&auto=format",
  aboutVillage: "https://images.unsplash.com/photo-1730697897511-bafe1f939e6b?w=900&h=700&fit=crop&auto=format",
  previewProfile: "https://images.unsplash.com/photo-1775485484472-11a9dd9b0ffa?w=900&h=700&fit=crop&auto=format",
  campMain: "https://images.unsplash.com/photo-1646806512881-1c169782a970?w=1200&h=800&fit=crop&auto=format",
  campTent: "https://images.unsplash.com/photo-1782738666543-96db6633afb0?w=800&h=600&fit=crop&auto=format",
  campPeak: "https://images.unsplash.com/photo-1763224017831-59e2b1a40882?w=800&h=600&fit=crop&auto=format",
  campLake: "https://images.unsplash.com/photo-1713987680233-236782180c6a?w=800&h=600&fit=crop&auto=format",
  life1: "https://images.unsplash.com/photo-1650247452475-b5866374545d?w=600&h=800&fit=crop&auto=format",
  life2: "https://images.unsplash.com/photo-1572908721147-0a9eb395762d?w=700&h=500&fit=crop&auto=format",
  life3: "https://images.unsplash.com/photo-1542897643-cfccd88c7127?w=700&h=500&fit=crop&auto=format",
  life4: "https://images.unsplash.com/photo-1566205865731-51803de32a35?w=600&h=400&fit=crop&auto=format",
  pot1: "https://images.unsplash.com/photo-1623042392888-1f87e36a5b64?w=500&h=360&fit=crop&auto=format",
  pot2: "https://images.unsplash.com/photo-1572908721147-0a9eb395762d?w=500&h=360&fit=crop&auto=format",
  pot3: "https://images.unsplash.com/photo-1650247452475-b5866374545d?w=500&h=360&fit=crop&auto=format",
  pot4: "https://images.unsplash.com/photo-1646806512881-1c169782a970?w=500&h=360&fit=crop&auto=format",
};

export default function App() {
  const [page, setPage] = useState<Page>(() => {
    const path = window.location.pathname;
    if (path === "/admin") return "admin";
    if (path === "/profile") return "profile";
    if (path === "/village-life") return "village-life";
    if (path === "/camp") return "camp";
    return "home";
  });
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [settings, setSettings] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchSettingsAndActivities = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        
        // Fetch Settings
        const settingsRes = await fetch(`${baseUrl}/settings`);
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          setSettings(settingsData);
        }

        // Fetch Activities
        const activitiesRes = await fetch(`${baseUrl}/activities`);
        if (activitiesRes.ok) {
          const activitiesData = await activitiesRes.json();
          setActivities(activitiesData);
        }
      } catch (err) {
        console.error("Failed to fetch settings/activities:", err);
      }
    };
    fetchSettingsAndActivities();
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === "/admin") setPage("admin");
      else if (path === "/profile") setPage("profile");
      else if (path === "/village-life") setPage("village-life");
      else if (path === "/camp") setPage("camp");
      else setPage("home");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 56);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    if (settings?.logo_url && settings.logo_url.trim()) {
      link.href = settings.logo_url;
    } else {
      // Fallback green map pin SVG
      link.href = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%233A6520' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z'/><circle cx='12' cy='10' r='3'/></svg>";
    }
  }, [settings]);

  useEffect(() => {
    const village = settings?.village_name || "Dusun Petung";
    if (page === "home") {
      document.title = `Beranda - ${village}`;
    } else if (page === "profile") {
      document.title = `Profil - ${village}`;
    } else if (page === "village-life") {
      document.title = `Kehidupan Dusun - ${village}`;
    } else if (page === "camp") {
      document.title = `Gumuk Petung Camp - ${village}`;
    } else if (page === "admin") {
      document.title = `Panel Admin - ${village}`;
    } else {
      document.title = village;
    }
  }, [page, settings]);


  useEffect(() => {
    window.scrollTo({ top: 0 });
    setMenuOpen(false);
  }, [page]);

  const nav = (p: Page) => {
    setPage(p);
    setMenuOpen(false);
    const targetPath = p === "home" ? "/" : `/${p}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, "", targetPath);
    }
  };

  const navLinks = [
    { label: "Beranda", page: "home" as Page },
    { label: "Profil Dusun", page: "profile" as Page },
    { label: "Kehidupan Dusun", page: "village-life" as Page },
    { label: "Gumuk Petung Camp", page: "camp" as Page },
  ];

  if (page === "admin") {
    if (!token) {
      return (
        <LoginPage
          onLogin={(t: string) => {
            setToken(t);
            localStorage.setItem("token", t);
          }}
          nav={nav}
        />
      );
    }
    return (
      <AdminPage
        nav={nav}
        onLogout={() => {
          setToken(null);
          localStorage.removeItem("token");
          nav("home");
        }}
        settings={settings}
        onUpdateSettings={(newSettings: any) => {
          setSettings(newSettings);
        }}
        activities={activities}
        onUpdateActivities={(newActivities: any[]) => {
          setActivities(newActivities);
        }}
        token={token}
      />
    );
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} className="min-h-screen bg-[#F7F4EF]">

      {/* ── Navbar ─────────────────────────────────────────── */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#F7F4EF]/96 backdrop-blur-md shadow-[0_1px_0_rgba(44,44,42,0.08)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16">
          <button onClick={() => nav("home")} className="flex items-center gap-2.5 shrink-0">
            <span className="w-7 h-7 rounded-full bg-[#3A6520] flex items-center justify-center shrink-0">
              {settings?.logo_url && settings.logo_url.trim() ? (
                <img src={settings.logo_url} alt="Logo" className="w-full h-full rounded-full object-cover" />
              ) : (
                <MapPin className="w-3.5 h-3.5 text-white" strokeWidth={2} />
              )}
            </span>
            <span
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              className={`font-bold text-[15px] tracking-tight transition-colors ${scrolled ? "text-[#2C2C2A]" : "text-white"}`}
            >
              {settings?.village_name || "Dusun Petung"}
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map(({ label, page: p }) => (
              <button
                key={label}
                onClick={() => nav(p)}
                className={`text-[13px] font-medium transition-colors hover:opacity-60 ${
                  scrolled ? "text-[#2C2C2A]" : "text-white/90"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          <button
            className={`md:hidden p-1 ${scrolled ? "text-[#2C2C2A]" : "text-white"}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-[#F7F4EF] border-t border-black/5 px-6 pb-5 pt-4 flex flex-col gap-4">
            {navLinks.map(({ label, page: p }) => (
              <button key={label} onClick={() => nav(p)} className="text-left text-sm font-medium text-[#2C2C2A]">
                {label}
              </button>
            ))}
          </div>
        )}
      </header>

      {page === "home" && <HomePage nav={nav} settings={settings} />}
      {page === "profile" && <ProfilePage nav={nav} settings={settings} />}
      {page === "village-life" && <VillageLifePage nav={nav} settings={settings} activities={activities} />}
      {page === "camp" && <CampPage nav={nav} settings={settings} />}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   HOME PAGE
──────────────────────────────────────────────────────────── */
function HomePage({ nav, settings }: { nav: (p: Page) => void; settings: any }) {
  const villageName = settings?.village_name || "Dusun Petung";
  const heroImg = (settings?.hero_image_url && settings.hero_image_url.trim()) ? settings.hero_image_url : IMGS.hero;
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
              <button className="px-7 py-3.5 bg-white/12 text-white text-[13px] font-semibold rounded-full border border-white/25 hover:bg-white/22 transition-colors backdrop-blur-sm">
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
              <button className="inline-flex items-center gap-2 text-[#C97C2A] text-[13px] font-bold hover:gap-3 transition-all">
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
              href="https://wa.me/6281234567890"
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
                Keseharian yang<br />Sesungguhnya
              </h2>
            </div>
            <button className="hidden lg:inline-flex items-center gap-2 text-[#3A6520] text-[13px] font-bold hover:gap-3 transition-all">
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

/* ────────────────────────────────────────────────────────────
   PROFILE PAGE
──────────────────────────────────────────────────────────── */
function ProfilePage({ nav, settings }: { nav: (p: Page) => void; settings: any }) {
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
                Identitas<br />Dusun Petung
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
                className="w-full object-cover"
                style={{ height: 540 }}
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

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { Icon: Users, value: "3.247", label: "Jiwa Penduduk" },
              { Icon: Home, value: "892", label: "Kepala Keluarga" },
              { Icon: Map, value: "485 Ha", label: "Luas Wilayah" },
              { Icon: Building2, value: "5", label: "Padukuhan" },
            ].map(({ Icon, value, label }) => (
              <div key={label} className="bg-white p-8 border border-black/5">
                <Icon className="w-[18px] h-[18px] text-[#3A6520] mb-5" strokeWidth={1.5} />
                <div
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  className="text-[2.5rem] font-extrabold text-[#2C2C2A] leading-none mb-2"
                >
                  {value}
                </div>
                <div className="text-[13px] text-[#7A7065] font-medium">{label}</div>
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
              Jejak Perjalanan<br />Dusun Petung
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
                  desc: "Sistem irigasi diperbaiki dan produktivitas pertanian meningkat signifikan. Dusun Petung mulai dikenal sebagai penghasil sayuran dan hasil bumi berkualitas tinggi.",
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
              Yang Membuat<br />Dusun Ini Istimewa
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
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

/* ────────────────────────────────────────────────────────────
   SHARED FOOTER
──────────────────────────────────────────────────────────── */
function SiteFooter({ nav, settings }: { nav: (p: Page) => void; settings: any }) {
  const villageName = settings?.village_name || "Dusun Petung";
  const phoneVal = settings?.phone_number || "+62 812 3456 7890";
  let formattedPhone = phoneVal.replace(/[^0-9]/g, "");
  if (formattedPhone.startsWith("0")) {
    formattedPhone = "62" + formattedPhone.slice(1);
  }
  const waUrl = formattedPhone ? `https://wa.me/${formattedPhone}` : "https://wa.me/6281234567890";
  const instagramUrl = settings?.instagram_url;
  const tiktokUrl = settings?.tiktok_url;

  return (
    <footer className="bg-[#1A1A18] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-10">
        <div className="grid lg:grid-cols-3 gap-12 mb-14">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <span className="w-7 h-7 rounded-full bg-[#3A6520] flex items-center justify-center shrink-0">
                {settings?.logo_url && settings.logo_url.trim() ? (
                  <img src={settings.logo_url} alt="Logo" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <MapPin className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                )}
              </span>
              <span
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                className="font-bold text-[15px]"
              >
                {villageName}
              </span>
            </div>
            <p className="text-white/40 text-[13px] leading-[1.75]" style={{ maxWidth: 240 }}>
              Dusun di kaki Gunung Merapi dengan keindahan alam, kehangatan warga, dan potensi wisata yang luar biasa.
            </p>
          </div>

          {/* Nav */}
          <div>
            <div className="text-[11px] font-bold text-white/30 tracking-[0.18em] uppercase mb-6">Navigasi</div>
            <div className="flex flex-col gap-3.5">
              {[
                { label: "Beranda", p: "home" as Page },
                { label: "Profil Dusun", p: "profile" as Page },
                { label: "Kehidupan Dusun", p: "village-life" as Page },
                { label: "Gumuk Petung Camp", p: "camp" as Page },
              ].map(({ label, p }) => (
                <button
                  key={label}
                  onClick={() => nav(p)}
                  className="text-left text-white/50 text-[13px] hover:text-white transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="text-[11px] font-bold text-white/30 tracking-[0.18em] uppercase mb-6">
              Kontak & Lokasi
            </div>
            <div className="flex flex-col gap-5">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-white/50 text-[13px] leading-[1.6] hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-[#3A6520] mt-0.5 shrink-0" />
                <div>
                  <div>{phoneVal}</div>
                  <span className="text-white/30 text-[11px]">WhatsApp · Hubungi Kami</span>
                </div>
              </a>
              <a
                href="https://maps.google.com/?q=Dusun+Petung+Sidorejo+Klaten"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-white/50 text-[13px] leading-[1.6] hover:text-white transition-colors"
              >
                <MapPin className="w-4 h-4 text-[#3A6520] mt-0.5 shrink-0" />
                {villageName}, Desa Sidorejo<br />Kec. Kemalang, Kab. Klaten, Jawa Tengah
              </a>
              {instagramUrl && instagramUrl.trim() ? (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/50 text-[13px] hover:text-white transition-colors"
                >
                  <Instagram className="w-4 h-4 text-[#3A6520] shrink-0" />
                  Instagram Resmi
                </a>
              ) : null}
              {tiktokUrl && tiktokUrl.trim() ? (
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/50 text-[13px] hover:text-white transition-colors"
                >
                  <span className="w-4 h-4 text-[#3A6520] shrink-0 flex items-center justify-center font-bold text-[10px]">T</span>
                  TikTok Resmi
                </a>
              ) : null}
            </div>
          </div>
        </div>

        <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-[12px]">© 2024 {villageName}. Hak cipta dilindungi.</p>
          <div className="flex items-center gap-5">
            <p className="text-white/25 text-[12px]">Desa Sidorejo · Kecamatan Kemalang · Kabupaten Klaten · Jawa Tengah</p>
            <button onClick={() => nav("admin")} className="text-white/20 text-[11px] hover:text-white/40 transition-colors">Admin</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ────────────────────────────────────────────────────────────
   VILLAGE LIFE PAGE
──────────────────────────────────────────────────────────── */
function VillageLifePage({ nav, settings, activities }: { nav: (p: Page) => void; settings: any; activities: any[] }) {
  const galleryItems = [
    {
      img: "https://images.unsplash.com/photo-1542897643-8158da5b4607?w=900&h=600&fit=crop&auto=format",
      alt: "Pawai budaya warga Dusun Petung di jalan dusun",
      title: "Pawai Budaya",
      caption: "Warga bersama merayakan hari kemerdekaan dengan penuh semangat",
      tall: true,
    },
    {
      img: "https://images.unsplash.com/photo-1585704123905-b89826d5daa6?w=700&h=500&fit=crop&auto=format",
      alt: "Upacara adat wanita berbusana tradisional",
      title: "Upacara Adat",
      caption: "Tradisi yang masih terjaga dan dirayakan dengan penuh makna",
      tall: false,
    },
    {
      img: "https://images.unsplash.com/photo-1572908721147-0a9eb395762d?w=700&h=500&fit=crop&auto=format",
      alt: "Warga menanam padi di sawah bersama-sama",
      title: "Musim Tanam",
      caption: "Gotong royong dalam menanam padi, tradisi yang terus dijaga",
      tall: false,
    },
    {
      img: "https://images.unsplash.com/photo-1701590219284-c3cce0148be1?w=900&h=600&fit=crop&auto=format",
      alt: "Parade bendera warga dusun",
      title: "Hari Kemerdekaan",
      caption: "Semangat persatuan warga dalam merayakan kemerdekaan",
      tall: false,
    },
    {
      img: "https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?w=700&h=900&fit=crop&auto=format",
      alt: "Petani perempuan memanen padi di sawah",
      title: "Panen Raya",
      caption: "Musim panen yang dinantikan — buah dari kerja keras bersama",
      tall: true,
    },
    {
      img: "https://images.unsplash.com/photo-1505471768190-275e2ad7b3f9?w=700&h=500&fit=crop&auto=format",
      alt: "Petani bertopi menanam padi dengan telaten",
      title: "Ketekunan Petani",
      caption: "Setiap benih ditanam dengan penuh kesabaran dan dedikasi",
      tall: false,
    },
    {
      img: "https://images.unsplash.com/photo-1650247452475-b5866374545d?w=700&h=500&fit=crop&auto=format",
      alt: "Warga berjalan bersama di hutan",
      title: "Jelajah Alam",
      caption: "Kebersamaan warga dalam menjaga dan menikmati alam dusun",
      tall: false,
    },
    {
      img: "https://images.unsplash.com/photo-1566205865731-51803de32a35?w=900&h=600&fit=crop&auto=format",
      alt: "Kehidupan sehari-hari di lingkungan dusun",
      title: "Keseharian Dusun",
      caption: "Kehidupan yang sederhana, hangat, dan penuh kebersamaan",
      tall: false,
    },
  ];

  const displayItems = activities.map(act => ({
    img: act.image_url,
    alt: act.title,
    title: act.title,
    caption: act.description,
    tall: false
  }));

  const getItem = (index: number) => {
    return displayItems[index] || galleryItems[index];
  };

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ height: "40vh", minHeight: 300 }}>
        <img
          src="https://images.unsplash.com/photo-1542897643-8158da5b4607?w=1600&h=700&fit=crop&auto=format"
          alt="Pawai komunitas warga Dusun Petung"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative h-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col justify-end pb-14">
          <span className="text-white/50 text-[11px] font-bold tracking-[0.18em] uppercase block mb-3">
            Kehidupan Dusun
          </span>
          <h1
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.1 }}
            className="font-extrabold text-white mb-3"
          >
            Dusun yang Hidup
          </h1>
          <p className="text-white/65 text-[15px] leading-[1.7]" style={{ maxWidth: 480 }}>
            Komunitas yang hangat, tradisi yang terjaga, dan semangat gotong royong yang mengalir dalam setiap keseharian warga Dusun Petung.
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-24 lg:py-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-16 lg:gap-28 items-center">
            <div className="bg-[#D4C9B5]">
              <img
                src="https://images.unsplash.com/photo-1542897643-cfccd88c7127?w=900&h=700&fit=crop&auto=format"
                alt="Komunitas warga dusun dalam kegiatan bersama"
                className="w-full object-cover"
                style={{ height: 500 }}
              />
            </div>
            <div>
              <span className="text-[#C97C2A] text-[11px] font-bold tracking-[0.18em] uppercase block mb-5">
                Komunitas
              </span>
              <h2
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.75rem, 3vw, 2.75rem)", lineHeight: 1.15 }}
                className="font-extrabold text-[#2C2C2A] mb-6"
              >
                Gotong Royong<br />yang Tak Pernah Padam
              </h2>
              <p className="text-[#5A5550] leading-[1.75] text-[15px] mb-4">
                Kehidupan di Dusun Petung berputar di sekitar nilai-nilai kebersamaan yang telah diwariskan turun-temurun. Gotong royong bukan sekadar kata — ia adalah cara hidup yang terlihat dalam setiap aktivitas warga, dari mengerjakan sawah hingga merayakan hari besar.
              </p>
              <p className="text-[#5A5550] leading-[1.75] text-[15px] mb-4">
                Tradisi dan budaya lokal masih dirayakan dengan penuh kebanggaan. Upacara adat, pawai budaya, dan festival dusun menjadi momen di mana seluruh warga bersatu, menjaga akar identitas mereka.
              </p>
              <p className="text-[#5A5550] leading-[1.75] text-[15px]">
                Di tengah modernisasi, Dusun Petung tetap memelihara ritme kehidupan yang autentik — dekat dengan alam, dekat dengan sesama, dan terbuka untuk siapa saja yang ingin merasakannya.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Village Activity Gallery */}
      <section className="pb-24 lg:pb-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-14">
            <span className="text-[#C97C2A] text-[11px] font-bold tracking-[0.18em] uppercase block mb-5">
              Galeri Kegiatan
            </span>
            <h2
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.75rem, 3vw, 2.75rem)", lineHeight: 1.15 }}
              className="font-extrabold text-[#2C2C2A]"
            >
              Momen Nyata,<br />Cerita Sesungguhnya
            </h2>
          </div>

          {/* Masonry-style editorial grid */}
          <div className="grid grid-cols-12 gap-2.5">
            {/* Row 1 */}
            <div className="col-span-12 lg:col-span-5 overflow-hidden bg-[#D4C9B5] group relative" style={{ height: 420 }}>
              <img src={getItem(0).img} alt={getItem(0).alt} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-5">
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-white text-[13px] font-bold block">{getItem(0).title}</span>
                <span className="text-white/60 text-[12px]">{getItem(0).caption}</span>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-7 grid grid-cols-2 gap-2.5">
              {[getItem(1), getItem(2)].map((item) => (
                <div key={item.title} className="overflow-hidden bg-[#D4C9B5] group relative" style={{ height: 420 }}>
                  <img src={item.img} alt={item.alt} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-5">
                    <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-white text-[13px] font-bold block">{item.title}</span>
                    <span className="text-white/60 text-[12px]">{item.caption}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Row 2 */}
            <div className="col-span-12 lg:col-span-4 overflow-hidden bg-[#D4C9B5] group relative" style={{ height: 480 }}>
              <img src={getItem(4).img} alt={getItem(4).alt} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-5">
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-white text-[13px] font-bold block">{getItem(4).title}</span>
                <span className="text-white/60 text-[12px]">{getItem(4).caption}</span>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-8 grid grid-cols-3 gap-2.5">
              {[getItem(3), getItem(5), getItem(6)].map((item) => (
                <div key={item.title} className="overflow-hidden bg-[#D4C9B5] group relative" style={{ height: 480 }}>
                  <img src={item.img} alt={item.alt} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-5">
                    <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-white text-[13px] font-bold block">{item.title}</span>
                    <span className="text-white/60 text-[12px]">{item.caption}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Row 3 — full width banner */}
            <div className="col-span-12 overflow-hidden bg-[#D4C9B5] group relative" style={{ height: 360 }}>
              <img src={getItem(7).img} alt={getItem(7).alt} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-6">
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-white text-[14px] font-bold block">{getItem(7).title}</span>
                <span className="text-white/60 text-[13px]">{getItem(7).caption}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter nav={nav} settings={settings} />
    </>
  );
}

/* ────────────────────────────────────────────────────────────
   GUMUK PETUNG CAMP PAGE
──────────────────────────────────────────────────────────── */
function CampPage({ nav, settings }: { nav: (p: Page) => void; settings: any }) {
  const phoneVal = settings?.phone_number || "+62 812 3456 7890";
  let formattedPhone = phoneVal.replace(/[^0-9]/g, "");
  if (formattedPhone.startsWith("0")) {
    formattedPhone = "62" + formattedPhone.slice(1);
  }
  const waUrl = formattedPhone ? `https://wa.me/${formattedPhone}` : "https://wa.me/6281234567890";

  const activities = [
    { img: "https://images.unsplash.com/photo-1646806512881-1c169782a970?w=600&h=420&fit=crop&auto=format", icon: Mountain, title: "Berkemah", desc: "Rasakan malam di alam terbuka dengan bintang sebagai atap dan semilir gunung sebagai selimut." },
    { img: "https://images.unsplash.com/photo-1775204646778-25a1ce121a85?w=600&h=420&fit=crop&auto=format", icon: Sunrise, title: "Menyambut Fajar", desc: "Saksikan matahari terbit di balik puncak Merapi dari ketinggian bukit yang tenang." },
    { img: "https://images.unsplash.com/photo-1772767511365-c7a5036bd55c?w=600&h=420&fit=crop&auto=format", icon: Star, title: "Mengamati Bintang", desc: "Langit malam yang bersih di kaki Merapi menawarkan pengalaman stargazing yang tak tertandingi." },
    { img: "https://images.unsplash.com/photo-1763224017831-59e2b1a40882?w=600&h=420&fit=crop&auto=format", icon: Camera, title: "Fotografi Alam", desc: "Setiap sudut menawarkan komposisi indah — dari panorama puncak hingga kabut pagi yang dramatis." },
    { img: "https://images.unsplash.com/photo-1744301960280-d6130ce0401d?w=600&h=420&fit=crop&auto=format", icon: Wind, title: "Relaksasi Alam", desc: "Biarkan udara pegunungan dan keheningan alam memulihkan pikiran dan jiwa Anda." },
    { img: "https://images.unsplash.com/photo-1770893876530-68601a346202?w=600&h=420&fit=crop&auto=format", icon: Flame, title: "Api Unggun", desc: "Kumpul bersama di sekitar api unggun, berbagi cerita, dan menikmati hangatnya malam bersama." },
  ];

  const facilities = [
    { icon: Mountain, label: "Area Kemping" },
    { icon: Car, label: "Parkir Luas" },
    { icon: Droplets, label: "Toilet Bersih" },
    { icon: Star, label: "Musala" },
    { icon: Eye, label: "Dek Panorama" },
    { icon: Umbrella, label: "Shelter" },
    { icon: Info, label: "Pusat Informasi" },
    { icon: Flame, label: "Area Api Unggun" },
  ];

  const galleryImgs = [
    { src: "https://images.unsplash.com/photo-1775204646778-25a1ce121a85?w=900&h=640&fit=crop&auto=format", alt: "Kabut tipis di bukit saat fajar, suasana pagi yang tenang" },
    { src: "https://images.unsplash.com/photo-1782738666543-96db6633afb0?w=700&h=500&fit=crop&auto=format", alt: "Tenda berkemah berlatar matahari terbenam yang dramatis" },
    { src: "https://images.unsplash.com/photo-1772767511365-c7a5036bd55c?w=700&h=500&fit=crop&auto=format", alt: "Area kemping di bawah langit malam berbintang" },
    { src: "https://images.unsplash.com/photo-1778381464544-dccb7c660364?w=700&h=500&fit=crop&auto=format", alt: "Tenda kemping dengan Bima Sakti di langit malam" },
    { src: "https://images.unsplash.com/photo-1770893876530-68601a346202?w=900&h=640&fit=crop&auto=format", alt: "Api unggun di atas bukit di bawah langit berbintang" },
    { src: "https://images.unsplash.com/photo-1768746268521-1eb6195e5335?w=700&h=500&fit=crop&auto=format", alt: "Lembah berkabut saat fajar dengan sinar matahari menerobos" },
    { src: "https://images.unsplash.com/photo-1713987680233-236782180c6a?w=700&h=500&fit=crop&auto=format", alt: "Tenda di tepi danau dengan latar pegunungan hijau" },
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
              Wisata Kemping · Dusun Petung
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
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#3A6520] text-white text-[13px] font-semibold rounded-full hover:bg-[#2D5016] transition-colors"
              >
                <Phone className="w-4 h-4" />
                Reservasi via WhatsApp
              </a>
              <a
                href="https://maps.google.com/?q=Gumuk+Petung+Camp+Sidorejo+Klaten"
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
                    href="https://instagram.com/gumukpetung_camp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[14px] text-[#5A5550] hover:text-[#3A6520] transition-colors"
                  >
                    <Instagram className="w-4 h-4 text-[#3A6520]" />
                    @gumukpetung_camp
                  </a>
                  <a
                    href="https://facebook.com/gumukpetung"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[14px] text-[#5A5550] hover:text-[#3A6520] transition-colors"
                  >
                    <Facebook className="w-4 h-4 text-[#3A6520]" />
                    Gumuk Petung Camp
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
                  href="https://maps.google.com/?q=Gumuk+Petung+Sidorejo+Klaten"
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

      <SiteFooter nav={nav} settings={settings} /></>
  );
}

/* ────────────────────────────────────────────────────────────
   ADMIN PAGE
──────────────────────────────────────────────────────────── */
type AdminSection = "dashboard" | "docs" | "add-doc" | "settings";

const DOCS_DATA = [
  { id: 1, title: "Festival Dusun 2024", date: "15 Jan 2024", status: "published", thumb: "https://images.unsplash.com/photo-1542897643-8158da5b4607?w=80&h=60&fit=crop&auto=format" },
  { id: 2, title: "Gotong Royong RT 03", date: "22 Feb 2024", status: "published", thumb: "https://images.unsplash.com/photo-1650247452475-b5866374545d?w=80&h=60&fit=crop&auto=format" },
  { id: 3, title: "Pelatihan UMKM Warga", date: "8 Mar 2024", status: "draft", thumb: "https://images.unsplash.com/photo-1572908721147-0a9eb395762d?w=80&h=60&fit=crop&auto=format" },
  { id: 4, title: "Kemah Pemuda Petung", date: "5 Apr 2024", status: "published", thumb: "https://images.unsplash.com/photo-1646806512881-1c169782a970?w=80&h=60&fit=crop&auto=format" },
  { id: 5, title: "Kerja Bakti Lingkungan", date: "20 Apr 2024", status: "draft", thumb: "https://images.unsplash.com/photo-1566205865731-51803de32a35?w=80&h=60&fit=crop&auto=format" },
  { id: 6, title: "Panen Raya Bersama", date: "3 Mei 2024", status: "published", thumb: "https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?w=80&h=60&fit=crop&auto=format" },
];

/* ────────────────────────────────────────────────────────────
   LOGIN PAGE
──────────────────────────────────────────────────────────── */
function LoginPage({ onLogin, nav }: { onLogin: (token: string) => void; nav: (p: Page) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Username atau password salah");
      }

      onLogin(data.token);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan pada server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} className="min-h-screen bg-[#F7F4EF] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <button onClick={() => nav("home")} className="flex items-center gap-2.5 mb-6">
          <span className="w-9 h-9 rounded-full bg-[#3A6520] flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" strokeWidth={2} />
          </span>
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="font-extrabold text-[18px] text-[#2C2C2A] tracking-tight">
            Dusun Petung
          </span>
        </button>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-center text-2xl font-extrabold text-[#2C2C2A]">
          Masuk ke Panel Admin
        </h2>
        <p className="mt-2 text-center text-sm text-[#7A7065]">
          Gunakan akun administrator Anda untuk mengelola konten website
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 border border-black/[0.06] rounded-2xl sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-[13px] flex items-center gap-2">
              <span className="font-semibold">Error:</span> {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[13px] font-semibold text-[#2C2C2A] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-4.5 w-4.5 text-[#B8AFA3]" />
                </span>
                <input
                  type="text"
                  required
                  disabled={loading}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full pl-10 pr-4 py-3 bg-[#F7F4EF] border border-black/[0.09] rounded-lg text-[13px] text-[#2C2C2A] placeholder:text-[#B8AFA3] outline-none focus:ring-1 focus:ring-[#3A6520]/30 focus:border-[#3A6520]/40 transition disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#2C2C2A] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Kata Sandi
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4.5 w-4.5 text-[#B8AFA3]" />
                </span>
                <input
                  type="password"
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-[#F7F4EF] border border-black/[0.09] rounded-lg text-[13px] text-[#2C2C2A] placeholder:text-[#B8AFA3] outline-none focus:ring-1 focus:ring-[#3A6520]/30 focus:border-[#3A6520]/40 transition disabled:opacity-60"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 bg-[#3A6520] hover:bg-[#2D5016] text-white text-[13px] font-semibold rounded-full shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3A6520] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Menghubungkan..." : "Masuk"}
              </button>
            </div>
          </form>

          <div className="mt-6 flex justify-center">
            <button
              onClick={() => nav("home")}
              className="text-[12px] font-medium text-[#7A7065] hover:text-[#2C2C2A] transition-colors"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   ADMIN PAGE
──────────────────────────────────────────────────────────── */
function AdminPage({ nav, onLogout, settings, onUpdateSettings, activities, onUpdateActivities, token }: { nav: (p: Page) => void; onLogout: () => void; settings: any; onUpdateSettings: (newSettings: any) => void; activities: any[]; onUpdateActivities: (newActivities: any[]) => void; token: string }) {
  const [section, setSection] = useState<AdminSection>("dashboard");
  const [search, setSearch] = useState("");
  const [docs, setDocs] = useState<any[]>(activities);
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

  // Toast Notification States
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
  };
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Settings states
  const [villageNameInput, setVillageNameInput] = useState(settings?.village_name || "");
  const [logoUrlInput, setLogoUrlInput] = useState(settings?.logo_url || "");
  const [heroImageUrlInput, setHeroImageUrlInput] = useState(settings?.hero_image_url || "");
  const [phoneNumberInput, setPhoneNumberInput] = useState(settings?.phone_number || "");
  const [instagramUrlInput, setInstagramUrlInput] = useState(settings?.instagram_url || "");
  const [tiktokUrlInput, setTiktokUrlInput] = useState(settings?.tiktok_url || "");
  const [savingSettings, setSavingSettings] = useState(false);

  const logoFileRef = useRef<HTMLInputElement>(null);
  const heroFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDocs(activities);
  }, [activities]);

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

  const sideNav: { icon: React.ElementType; label: string; key: AdminSection }[] = [
    { icon: LayoutDashboard, label: "Dashboard", key: "dashboard" },
    { icon: FileText, label: "Dokumentasi", key: "docs" },
    { icon: Settings, label: "Pengaturan Website", key: "settings" },
  ];

  const filteredDocs = docs.filter(d =>
    (d.title || "").toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (isoString: string) => {
    if (!isoString) return "-";
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    } catch (e) {
      return isoString;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/activities/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        onUpdateActivities(activities.filter(a => a.id !== id));
        showToast("Dokumentasi berhasil dihapus", "success");
      } else {
        const errData = await res.json();
        showToast(errData.message || "Gagal menghapus dokumentasi", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Kesalahan koneksi saat menghapus", "error");
    } finally {
      setDeleteId(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadedFile(URL.createObjectURL(file));
      setRawFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(URL.createObjectURL(file));
      setRawFile(file);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(`${baseUrl}/upload`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setLogoUrlInput(data.url);
        showToast("Logo berhasil diunggah", "success");
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(errData.message || "Gagal mengunggah logo", "error");
      }
    } catch (err) {
      showToast("Kesalahan koneksi saat mengunggah", "error");
    }
  };

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(`${baseUrl}/upload`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setHeroImageUrlInput(data.url);
        showToast("Foto hero berhasil diunggah", "success");
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(errData.message || "Gagal mengunggah foto hero", "error");
      }
    } catch (err) {
      showToast("Kesalahan koneksi saat mengunggah", "error");
    }
  };

  const handleSaveDoc = async () => {
    if (!titleInput.trim()) {
      showToast("Judul wajib diisi", "error");
      return;
    }
    if (!rawFile && !uploadedFile) {
      showToast("Foto dokumentasi wajib diunggah", "error");
      return;
    }

    setSubmittingDoc(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      let finalImageUrl = uploadedFile || "";

      if (rawFile) {
        const formData = new FormData();
        formData.append("image", rawFile);
        const uploadRes = await fetch(`${baseUrl}/upload`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          },
          body: formData
        });
        if (!uploadRes.ok) {
          const errData = await uploadRes.json().catch(() => ({}));
          throw new Error(errData.message || "Gagal mengunggah foto");
        }
        const uploadData = await uploadRes.json();
        finalImageUrl = uploadData.url;
      }

      const isEdit = editingDocId !== null;
      const url = isEdit ? `${baseUrl}/activities/${editingDocId}` : `${baseUrl}/activities`;
      const method = isEdit ? "PUT" : "POST";

      const actRes = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: titleInput,
          description: descInput,
          image_url: finalImageUrl
        })
      });

      if (!actRes.ok) {
        throw new Error(isEdit ? "Gagal memperbarui dokumentasi" : "Gagal menyimpan dokumentasi");
      }

      const savedAct = await actRes.json();

      if (isEdit) {
        onUpdateActivities(activities.map(a => a.id === editingDocId ? { ...a, ...savedAct } : a));
      } else {
        const newActObj = {
          id: savedAct.activity_id || Date.now(),
          title: titleInput,
          description: descInput,
          image_url: finalImageUrl,
          uploaded_at: new Date().toISOString()
        };
        onUpdateActivities([newActObj, ...activities]);
      }

      setTitleInput("");
      setDescInput("");
      setUploadedFile(null);
      setRawFile(null);
      setEditingDocId(null);
      setSection("docs");
      showToast(isEdit ? "Dokumentasi berhasil diperbarui!" : "Dokumentasi berhasil ditambahkan!", "success");
    } catch (err: any) {
      showToast(err.message || "Terjadi kesalahan saat menyimpan", "error");
    } finally {
      setSubmittingDoc(false);
    }
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          village_name: villageNameInput,
          logo_url: logoUrlInput,
          hero_image_url: heroImageUrlInput,
          phone_number: phoneNumberInput,
          instagram_url: instagramUrlInput,
          tiktok_url: tiktokUrlInput
        })
      });

      if (!res.ok) {
        throw new Error("Gagal menyimpan pengaturan");
      }

      const updatedSettings = await res.json();
      onUpdateSettings(updatedSettings);
      showToast("Pengaturan website berhasil diperbarui!", "success");
    } catch (err: any) {
      showToast(err.message || "Terjadi kesalahan saat menyimpan", "error");
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F4EF]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-[9999] animate-slide-in">
          <div className={`flex items-center gap-3 px-5 py-4 rounded-xl border shadow-xl transition-all duration-300 ${
            toast.type === "success" 
              ? "bg-[#E6F4EA] border-[#3A6520]/20 text-[#2D5016]" 
              : "bg-red-50 border-red-200 text-red-700"
          }`}>
            {toast.type === "success" ? (
              <span className="w-5 h-5 rounded-full bg-[#3A6520] flex items-center justify-center text-white shrink-0">
                <Check className="w-3.5 h-3.5" strokeWidth={3} />
              </span>
            ) : (
              <span className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white shrink-0">
                <X className="w-3.5 h-3.5" strokeWidth={3} />
              </span>
            )}
            <span className="text-[13px] font-semibold tracking-wide" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {toast.message}
            </span>
            <button onClick={() => setToast(null)} className="text-black/30 hover:text-black/60 transition-colors ml-2 shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Sidebar ──────────────────────────────────── */}
      <aside className="w-60 shrink-0 flex flex-col bg-white border-r border-black/[0.07] h-full">
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-black/[0.07]">
          <span className="w-7 h-7 rounded-full bg-[#3A6520] flex items-center justify-center shrink-0">
            <MapPin className="w-3.5 h-3.5 text-white" strokeWidth={2} />
          </span>
          <div>
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[13px] font-bold text-[#2C2C2A] leading-tight">
              Dusun Petung
            </div>
            <div className="text-[10px] text-[#7A7065]">Panel Admin</div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          <div className="text-[10px] font-bold text-[#B8AFA3] tracking-[0.14em] uppercase px-2 mb-2">Menu</div>
          {sideNav.map(({ icon: Icon, label, key }) => (
            <button
              key={key}
              onClick={() => setSection(key)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors w-full text-left ${
                section === key
                  ? "bg-[#3A6520]/10 text-[#3A6520] font-semibold"
                  : "text-[#5A5550] hover:bg-[#F0EBE3] hover:text-[#2C2C2A]"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
              {label}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-black/[0.07] flex flex-col gap-1">
          <button
            onClick={() => nav("home")}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-[#5A5550] hover:bg-[#F0EBE3] hover:text-[#2C2C2A] transition-colors w-full text-left"
          >
            <ChevronLeft className="w-4 h-4 shrink-0" strokeWidth={1.75} />
            Kembali ke Website
          </button>
          <button onClick={onLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-[#5A5550] hover:bg-red-50 hover:text-red-600 transition-colors w-full text-left">
            <LogOut className="w-4 h-4 shrink-0" strokeWidth={1.75} />
            Keluar
          </button>
        </div>
      </aside>

      {/* ── Main area ────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="h-14 shrink-0 flex items-center justify-between px-6 bg-white border-b border-black/[0.07]">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-[#B8AFA3]" strokeWidth={1.75} />
            <input
              type="text"
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                if (section !== "docs") {
                  setSection("docs");
                }
              }}
              placeholder="Cari dokumentasi..."
              className="pl-9 pr-4 py-2 bg-[#F7F4EF] rounded-lg text-[13px] text-[#2C2C2A] placeholder:text-[#B8AFA3] border-none outline-none w-60 focus:ring-1 focus:ring-[#3A6520]/30"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg text-[#7A7065] hover:bg-[#F0EBE3] transition-colors">
              <Bell className="w-4 h-4" strokeWidth={1.75} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#C97C2A] rounded-full" />
            </button>
            <div className="flex items-center gap-2.5 pl-3 border-l border-black/[0.07]">
              <div className="w-8 h-8 rounded-full bg-[#3A6520]/15 flex items-center justify-center">
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[12px] font-bold text-[#3A6520]">AP</span>
              </div>
              <div className="hidden sm:block">
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[13px] font-semibold text-[#2C2C2A] leading-tight">Admin Petung</div>
                <div className="text-[11px] text-[#7A7065]">Administrator</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-6 py-6">

          {/* ── DASHBOARD ──────────────────────────── */}
          {section === "dashboard" && (
            <div className="max-w-5xl">
              <div className="mb-7">
                <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[22px] font-extrabold text-[#2C2C2A] mb-1">Dashboard</h1>
                <p className="text-[13px] text-[#7A7065]">Selamat datang, Admin Petung. Berikut ringkasan konten website.</p>
              </div>

              {/* Stat cards */}
              {(() => {
                const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
                const recentCount = docs.filter(d => {
                  const dateVal = d.uploaded_at || d.date;
                  if (!dateVal) return false;
                  try {
                    return new Date(dateVal).getTime() > oneWeekAgo;
                  } catch (e) {
                    return false;
                  }
                }).length.toString();

                const stats = [
                  { label: "Total Dokumentasi", value: docs.length.toString(), icon: FileText, color: "#3A6520" },
                  { label: "Baru Ditambahkan (7 Hari Terakhir)", value: recentCount, icon: Clock, color: "#C97C2A" },
                  { label: "Sudah Dipublikasikan", value: docs.filter(d => (d.status || "published") === "published").length.toString(), icon: Check, color: "#3A6520" },
                ];

                return (
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {stats.map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="bg-white rounded-xl border border-black/[0.07] px-6 py-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: color + "15" }}>
                        <Icon className="w-4.5 h-4.5" style={{ color }} strokeWidth={1.75} />
                      </div>
                    </div>
                    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[2rem] font-extrabold text-[#2C2C2A] leading-none mb-1">{value}</div>
                    <div className="text-[13px] text-[#7A7065]">{label}</div>
                  </div>
                ))}
                  </div>
                );
              })()}

              {/* Quick actions */}
              <div className="mb-8">
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[14px] font-bold text-[#2C2C2A] mb-3">Aksi Cepat</h2>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSection("add-doc")}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#3A6520] text-white text-[13px] font-semibold rounded-full hover:bg-[#2D5016] transition-colors"
                  >
                    <Plus className="w-4 h-4" strokeWidth={2} />
                    Tambah Dokumentasi
                  </button>
                  <button
                    onClick={() => setSection("settings")}
                    className="flex items-center gap-2 px-5 py-2.5 border border-[#3A6520] text-[#3A6520] text-[13px] font-semibold rounded-full hover:bg-[#3A6520]/5 transition-colors"
                  >
                    <Settings className="w-4 h-4" strokeWidth={1.75} />
                    Pengaturan Website
                  </button>
                </div>
              </div>

              {/* Recent activity */}
              <div>
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[14px] font-bold text-[#2C2C2A] mb-3">Aktivitas Terbaru</h2>
                <div className="bg-white rounded-xl border border-black/[0.07] overflow-hidden">
                  {docs.slice(0, 5).map((doc, i) => (
                    <div key={doc.id} className={`flex items-center gap-4 px-5 py-4 ${i < docs.length - 1 ? "border-b border-black/[0.05]" : ""}`}>
                      <div className="w-10 h-8 rounded overflow-hidden bg-[#F0EBE3] shrink-0">
                        <img src={doc.image_url || doc.thumb} alt={doc.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[13px] font-semibold text-[#2C2C2A] truncate">{doc.title}</div>
                        <div className="text-[12px] text-[#7A7065]">{formatDate(doc.uploaded_at || doc.date)}</div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        (doc.status || "published") === "published"
                          ? "bg-[#3A6520]/10 text-[#3A6520]"
                          : "bg-[#C97C2A]/10 text-[#C97C2A]"
                      }`}>
                        {(doc.status || "published") === "published" ? "Dipublikasikan" : "Draft"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── DOCS LIST ──────────────────────────── */}
          {section === "docs" && (
            <div className="max-w-5xl">
              <div className="flex items-start justify-between mb-7">
                <div>
                  <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[22px] font-extrabold text-[#2C2C2A] mb-1">Dokumentasi</h1>
                  <p className="text-[13px] text-[#7A7065]">Kelola semua dokumentasi kegiatan dusun.</p>
                </div>
                <button
                  onClick={() => setSection("add-doc")}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#3A6520] text-white text-[13px] font-semibold rounded-full hover:bg-[#2D5016] transition-colors shrink-0"
                >
                  <Plus className="w-4 h-4" strokeWidth={2} />
                  Tambah Dokumentasi
                </button>
              </div>

              {/* Toolbar */}
              <div className="flex items-center gap-3 mb-5">
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8AFA3]" strokeWidth={1.75} />
                  <input
                    type="text"
                    placeholder="Cari judul..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-black/[0.09] rounded-lg text-[13px] text-[#2C2C2A] placeholder:text-[#B8AFA3] outline-none focus:ring-1 focus:ring-[#3A6520]/30"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-black/[0.09] rounded-lg text-[13px] text-[#5A5550] hover:border-[#3A6520]/30 transition-colors">
                  <Filter className="w-4 h-4" strokeWidth={1.75} />
                  Filter
                </button>
              </div>

              {/* Table */}
              <div className="bg-white rounded-xl border border-black/[0.07] overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-black/[0.06] bg-[#F7F4EF]">
                      <th className="text-left px-5 py-3 text-[11px] font-bold text-[#7A7065] tracking-[0.1em] uppercase w-16">Foto</th>
                      <th className="text-left px-4 py-3 text-[11px] font-bold text-[#7A7065] tracking-[0.1em] uppercase">Judul</th>
                      <th className="text-left px-4 py-3 text-[11px] font-bold text-[#7A7065] tracking-[0.1em] uppercase w-36">Tanggal Upload</th>
                      <th className="text-left px-4 py-3 text-[11px] font-bold text-[#7A7065] tracking-[0.1em] uppercase w-36">Status</th>
                      <th className="text-left px-4 py-3 text-[11px] font-bold text-[#7A7065] tracking-[0.1em] uppercase w-24">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocs.map((doc, i) => (
                      <tr key={doc.id} className={`group ${i < filteredDocs.length - 1 ? "border-b border-black/[0.05]" : ""} hover:bg-[#F7F4EF]/60 transition-colors`}>
                        <td className="px-5 py-3.5">
                          <div className="w-12 h-9 rounded overflow-hidden bg-[#EDE8DF] shrink-0">
                            <img src={doc.image_url || doc.thumb} alt={doc.title} className="w-full h-full object-cover" />
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[13px] font-semibold text-[#2C2C2A]">{doc.title}</div>
                          {doc.description && (
                            <div className="text-[11px] text-[#7A7065] mt-1 line-clamp-1 max-w-lg">
                              {doc.description}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-[13px] text-[#7A7065]">{formatDate(doc.uploaded_at || doc.date)}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            (doc.status || "published") === "published"
                              ? "bg-[#3A6520]/10 text-[#3A6520]"
                              : "bg-[#C97C2A]/10 text-[#C97C2A]"
                          }`}>
                            {(doc.status || "published") === "published" ? "Dipublikasikan" : "Draft"}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setTitleInput(doc.title);
                                setDescInput(doc.description || "");
                                setUploadedFile(doc.image_url || doc.thumb || null);
                                setRawFile(null);
                                setEditingDocId(doc.id);
                                setSection("add-doc");
                              }}
                              className="p-1.5 rounded-md text-[#7A7065] hover:bg-[#3A6520]/10 hover:text-[#3A6520] transition-colors"
                              title="Edit"
                            >
                              <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />
                            </button>
                            <button
                              onClick={() => setDeleteId(doc.id)}
                              className="p-1.5 rounded-md text-[#7A7065] hover:bg-red-50 hover:text-red-500 transition-colors"
                              title="Hapus"
                            >
                              <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredDocs.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-5 py-10 text-center text-[13px] text-[#B8AFA3]">
                          Tidak ada dokumentasi ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── ADD DOC ────────────────────────────── */}
          {section === "add-doc" && (
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-7">
                <button
                  onClick={() => {
                    setTitleInput("");
                    setDescInput("");
                    setUploadedFile(null);
                    setRawFile(null);
                    setEditingDocId(null);
                    setSection("docs");
                  }}
                  className="p-1.5 rounded-lg text-[#7A7065] hover:bg-[#F0EBE3] transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" strokeWidth={1.75} />
                </button>
                <div>
                  <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[22px] font-extrabold text-[#2C2C2A] leading-tight">
                    {editingDocId !== null ? "Edit Dokumentasi" : "Tambah Dokumentasi"}
                  </h1>
                  <p className="text-[13px] text-[#7A7065]">
                    {editingDocId !== null ? "Ubah detail dokumentasi kegiatan." : "Unggah foto dan isi detail dokumentasi kegiatan."}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-black/[0.07] p-7 flex flex-col gap-6">

                {/* Upload area */}
                <div>
                  <label className="block text-[13px] font-semibold text-[#2C2C2A] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Foto Dokumentasi
                  </label>
                  <div
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-xl cursor-pointer transition-colors flex flex-col items-center justify-center text-center overflow-hidden ${
                      dragOver ? "border-[#3A6520] bg-[#3A6520]/5" : "border-black/[0.12] hover:border-[#3A6520]/40 hover:bg-[#F7F4EF]"
                    }`}
                    style={{ height: 220 }}
                  >
                    {uploadedFile ? (
                      <img src={uploadedFile} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-3 py-8">
                        <div className="w-12 h-12 rounded-full bg-[#3A6520]/10 flex items-center justify-center">
                          <Upload className="w-5 h-5 text-[#3A6520]" strokeWidth={1.75} />
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-[#2C2C2A]">Seret foto ke sini atau klik untuk memilih</p>
                          <p className="text-[12px] text-[#7A7065] mt-1">PNG, JPG, WEBP · Maks. 5 MB</p>
                        </div>
                      </div>
                    )}
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
                  </div>
                  {uploadedFile && (
                    <button onClick={() => setUploadedFile(null)} className="mt-2 text-[12px] text-[#7A7065] hover:text-red-500 transition-colors">
                      Hapus foto
                    </button>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-[13px] font-semibold text-[#2C2C2A] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Judul Dokumentasi <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={titleInput}
                    onChange={e => setTitleInput(e.target.value)}
                    placeholder="contoh: Festival Dusun 2024"
                    className="w-full px-4 py-3 bg-[#F7F4EF] border border-black/[0.09] rounded-lg text-[13px] text-[#2C2C2A] placeholder:text-[#B8AFA3] outline-none focus:ring-1 focus:ring-[#3A6520]/30 focus:border-[#3A6520]/40 transition"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[13px] font-semibold text-[#2C2C2A] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Deskripsi Singkat
                  </label>
                  <textarea
                    rows={4}
                    value={descInput}
                    onChange={e => setDescInput(e.target.value)}
                    placeholder="Tulis deskripsi singkat tentang kegiatan ini..."
                    className="w-full px-4 py-3 bg-[#F7F4EF] border border-black/[0.09] rounded-lg text-[13px] text-[#2C2C2A] placeholder:text-[#B8AFA3] outline-none focus:ring-1 focus:ring-[#3A6520]/30 focus:border-[#3A6520]/40 transition resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-1">
                  <button onClick={handleSaveDoc} disabled={submittingDoc} className="px-6 py-2.5 bg-[#3A6520] text-white text-[13px] font-semibold rounded-full hover:bg-[#2D5016] transition-colors disabled:opacity-50">
                    {submittingDoc ? "Menyimpan..." : (editingDocId !== null ? "Simpan Perubahan" : "Simpan Dokumentasi")}
                  </button>
                  <button onClick={() => {
                    setTitleInput("");
                    setDescInput("");
                    setUploadedFile(null);
                    setRawFile(null);
                    setEditingDocId(null);
                    setSection("docs");
                  }} className="px-6 py-2.5 border border-black/[0.12] text-[#5A5550] text-[13px] font-medium rounded-full hover:bg-[#F0EBE3] transition-colors">
                    Batal
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── SETTINGS ──────────────────────────── */}
          {section === "settings" && (
            <div className="max-w-2xl">
              <div className="mb-7">
                <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[22px] font-extrabold text-[#2C2C2A] mb-1">Pengaturan Website</h1>
                <p className="text-[13px] text-[#7A7065]">Kelola informasi umum dan kontak yang ditampilkan di website publik.</p>
              </div>

              <div className="flex flex-col gap-5">

                {/* General Information */}
                <div className="bg-white rounded-xl border border-black/[0.07] p-7">
                  <div className="flex items-center gap-2.5 mb-6">
                    <div className="w-1 h-5 rounded-full bg-[#3A6520]" />
                    <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[15px] font-bold text-[#2C2C2A]">Informasi Umum</h2>
                  </div>
                  <div className="flex flex-col gap-5">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#2C2C2A] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Nama Dusun</label>
                      <input type="text" value={villageNameInput} onChange={e => setVillageNameInput(e.target.value)} className="w-full px-4 py-3 bg-[#F7F4EF] border border-black/[0.09] rounded-lg text-[13px] text-[#2C2C2A] outline-none focus:ring-1 focus:ring-[#3A6520]/30 transition" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[13px] font-semibold text-[#2C2C2A] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Logo Dusun</label>
                        <div onClick={() => logoFileRef.current?.click()} className="border border-dashed border-black/[0.12] rounded-xl p-5 flex flex-col items-center justify-center gap-2 text-center cursor-pointer hover:border-[#3A6520]/40 hover:bg-[#F7F4EF] transition-colors relative overflow-hidden" style={{ minHeight: 110 }}>
                          {logoUrlInput ? (
                            <img src={logoUrlInput} alt="Logo" className="max-h-16 object-contain" />
                          ) : (
                            <>
                              <ImageIcon className="w-5 h-5 text-[#B8AFA3]" strokeWidth={1.5} />
                              <p className="text-[12px] text-[#B8AFA3] leading-snug">PNG atau JPG · Maks 2 MB</p>
                              <span className="text-[11px] font-semibold text-[#3A6520]">Pilih file</span>
                            </>
                          )}
                          <input ref={logoFileRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                        </div>
                        {logoUrlInput && (
                          <button onClick={() => setLogoUrlInput("")} className="mt-2 text-[12px] text-[#7A7065] hover:text-red-500 transition-colors">Hapus Logo</button>
                        )}
                      </div>
                      <div>
                        <label className="block text-[13px] font-semibold text-[#2C2C2A] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Foto Hero Halaman Utama</label>
                        <div onClick={() => heroFileRef.current?.click()} className="border border-dashed border-black/[0.12] rounded-xl p-5 flex flex-col items-center justify-center gap-2 text-center cursor-pointer hover:border-[#3A6520]/40 hover:bg-[#F7F4EF] transition-colors relative overflow-hidden" style={{ minHeight: 110 }}>
                          {heroImageUrlInput ? (
                            <img src={heroImageUrlInput} alt="Hero" className="max-h-16 w-full object-cover" />
                          ) : (
                            <>
                              <ImageIcon className="w-5 h-5 text-[#B8AFA3]" strokeWidth={1.5} />
                              <p className="text-[12px] text-[#B8AFA3] leading-snug">JPG atau WEBP · Maks 5 MB</p>
                              <span className="text-[11px] font-semibold text-[#3A6520]">Pilih file</span>
                            </>
                          )}
                          <input ref={heroFileRef} type="file" accept="image/*" className="hidden" onChange={handleHeroUpload} />
                        </div>
                        {heroImageUrlInput && (
                          <button onClick={() => setHeroImageUrlInput("")} className="mt-2 text-[12px] text-[#7A7065] hover:text-red-500 transition-colors">Hapus Foto Hero</button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-xl border border-black/[0.07] p-7">
                  <div className="flex items-center gap-2.5 mb-6">
                    <div className="w-1 h-5 rounded-full bg-[#C97C2A]" />
                    <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[15px] font-bold text-[#2C2C2A]">Informasi Kontak</h2>
                  </div>
                  <div className="flex flex-col gap-5">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#2C2C2A] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Nomor WhatsApp</label>
                      <input type="tel" value={phoneNumberInput} onChange={e => setPhoneNumberInput(e.target.value)} placeholder="+62 812 3456 7890" className="w-full px-4 py-3 bg-[#F7F4EF] border border-black/[0.09] rounded-lg text-[13px] text-[#2C2C2A] outline-none focus:ring-1 focus:ring-[#3A6520]/30 transition" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[13px] font-semibold text-[#2C2C2A] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Instagram (opsional)</label>
                        <input type="text" value={instagramUrlInput} onChange={e => setInstagramUrlInput(e.target.value)} placeholder="https://instagram.com/dusunpetung" className="w-full px-4 py-3 bg-[#F7F4EF] border border-black/[0.09] rounded-lg text-[13px] text-[#2C2C2A] outline-none focus:ring-1 focus:ring-[#3A6520]/30 transition" />
                      </div>
                      <div>
                        <label className="block text-[13px] font-semibold text-[#2C2C2A] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>TikTok (opsional)</label>
                        <input type="text" value={tiktokUrlInput} onChange={e => setTiktokUrlInput(e.target.value)} placeholder="https://tiktok.com/@dusunpetung" className="w-full px-4 py-3 bg-[#F7F4EF] border border-black/[0.09] rounded-lg text-[13px] text-[#2C2C2A] outline-none focus:ring-1 focus:ring-[#3A6520]/30 transition" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save/Reset */}
                <div className="flex items-center gap-3 pb-4">
                  <button onClick={handleSaveSettings} disabled={savingSettings} className="px-6 py-2.5 bg-[#3A6520] text-white text-[13px] font-semibold rounded-full hover:bg-[#2D5016] transition-colors disabled:opacity-50">
                    {savingSettings ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                  <button
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
                    className="px-6 py-2.5 border border-black/[0.12] text-[#5A5550] text-[13px] font-medium rounded-full hover:bg-[#F0EBE3] transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Delete confirmation modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl border border-black/[0.08] shadow-lg p-7 w-80 flex flex-col gap-5">
            <div>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[16px] font-bold text-[#2C2C2A] mb-1.5">Hapus Dokumentasi?</h3>
              <p className="text-[13px] text-[#7A7065] leading-relaxed">Tindakan ini tidak dapat dibatalkan. Dokumentasi akan dihapus permanen dari sistem.</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 bg-red-500 text-white text-[13px] font-semibold rounded-full hover:bg-red-600 transition-colors">
                Ya, Hapus
              </button>
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 border border-black/[0.12] text-[#5A5550] text-[13px] font-medium rounded-full hover:bg-[#F0EBE3] transition-colors">
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
