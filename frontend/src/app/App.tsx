import { useState, useEffect, useRef } from "react";
import { MapPin, Phone, Menu, X, ArrowRight, ChevronRight, Users, Home, Map, Building2, Mountain, Car, Droplets, Star, Eye, EyeOff, Umbrella, Info, Flame, Camera, Wind, Sunrise, LayoutDashboard, FileText, Settings, Search, Bell, Plus, Pencil, Trash2, Upload, ChevronLeft, LogOut, Filter, Check, Clock, ImageIcon, Instagram, Facebook, Lock, User } from "lucide-react";

import { Page } from "../types";
import { IMGS } from "../config/images";
import { Tiktok } from "../components/Tiktok";
import { ToastContainer } from "../components/ToastContainer";
import { RollingCounter } from "../components/RollingCounter";
import { HomePage } from "../pages/Home";
import { ProfilePage } from "../pages/Profile";
import { SiteFooter } from "../components/SiteFooter";
import { VillageLifePage } from "../pages/VillageLife";
import { CampPage } from "../pages/Camp";
import { LoginPage } from "../pages/Login";
import { AdminPage } from "../pages/Admin";

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

  // App Toast (used for login/logout notifications)
  const [appToast, setAppToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  useEffect(() => {
    if (appToast) {
      const timer = setTimeout(() => setAppToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [appToast]);

  // Dynamic Document Title Updater
  useEffect(() => {
    const vName = settings?.village_name || "Dusun Petung";
    if (page === "home") {
      document.title = `Beranda - ${vName}`;
    } else if (page === "profile") {
      document.title = `Profil Dusun - ${vName}`;
    } else if (page === "village-life") {
      document.title = `Kehidupan Dusun - ${vName}`;
    } else if (page === "camp") {
      document.title = `Gumuk Petung Camp - ${vName}`;
    } else if (page === "admin") {
      document.title = `Admin Panel - ${vName}`;
    }
  }, [page, settings]);

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
        <>
          <LoginPage
            onLogin={(t: string) => {
              setToken(t);
              localStorage.setItem("token", t);
            }}
            nav={nav}
            settings={settings}
          />
          {appToast && <ToastContainer toast={appToast} setToast={setAppToast} />}
        </>
      );
    }
    return (
      <AdminPage
        nav={nav}
        onLogout={() => {
          setToken(null);
          localStorage.removeItem("token");
          setAppToast({ message: "Berhasil keluar!", type: "success" });
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