import React, { useState } from "react";
import { MapPin, User, Lock, Eye, EyeOff } from "lucide-react";
import { Page } from "../types";
import { IMGS } from "../config/images";

interface LoginPageProps {
  onLogin: (token: string) => void;
  nav: (p: Page) => void;
  settings: any;
}

export function LoginPage({ onLogin, nav, settings }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  const heroUrl = settings?.hero_image_url || IMGS.hero;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} className="min-h-screen bg-white flex flex-col md:flex-row">
      
      {/* Left Side: Welcome Panel (Full Screen half) */}
      <div className="relative bg-[#3A6520] p-8 xs:p-10 sm:p-12 md:p-16 flex flex-col justify-between text-white overflow-hidden md:w-[42%] shrink-0 min-h-[340px] md:min-h-screen">
        
        {/* Logo Brand */}
        <div className="flex items-center gap-2.5 z-10">
          {settings?.logo_url ? (
            <img src={settings.logo_url} alt="Logo" className="w-8 h-8 rounded-full object-cover border border-white/20" />
          ) : (
            <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center backdrop-blur-sm">
              <MapPin className="w-4 h-4 text-white" strokeWidth={2.1} />
            </span>
          )}
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="font-extrabold text-[15px] tracking-tight">
            {settings?.village_name || "Dusun Petung"}
          </span>
        </div>

        {/* Text Content */}
        <div className="my-auto z-10 flex flex-col gap-4 py-6 sm:py-8 max-w-sm">
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", lineHeight: 1.15 }} className="font-extrabold tracking-tight">
            Selamat Datang <br className="hidden sm:inline" />di Panel Admin
          </h2>
          <p className="text-[13.5px] text-white/80 leading-relaxed">
            Kelola konten publikasi, galeri foto, kontak, dan dokumentasi kegiatan Dusun Petung.
          </p>
        </div>

        {/* Footer Card Info */}
        <div className="text-[11px] text-white/50 z-10">
          © 2026 Dusun Petung · KKN BN UPNYK AD.84.242
        </div>

        {/* Decorative Circular shapes containing Petung Hero Image */}
        <div 
          className="absolute -bottom-24 -left-12 w-72 h-72 rounded-full border-8 border-white/10 opacity-70 bg-center pointer-events-none shadow-inner"
          style={{ backgroundImage: `url(${heroUrl})`, backgroundSize: "180%", backgroundPosition: "center" }}
        />
        <div 
          className="absolute -top-16 -right-16 w-56 h-56 rounded-full border-8 border-white/10 opacity-80 bg-center pointer-events-none shadow-2xl"
          style={{ backgroundImage: `url(${heroUrl})`, backgroundSize: "180%", backgroundPosition: "center" }}
        />
        <div 
          className="absolute bottom-1/4 -right-12 w-36 h-36 rounded-full border-4 border-white/15 opacity-60 bg-center pointer-events-none shadow-xl"
          style={{ backgroundImage: `url(${heroUrl})`, backgroundSize: "180%", backgroundPosition: "center" }}
        />
      </div>

      {/* Right Side: Form Panel (Centered half) */}
      <div className="flex-1 bg-white p-6 xs:p-8 sm:p-12 md:p-20 flex flex-col justify-center items-center min-h-[460px] md:min-h-screen">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-2xl font-extrabold text-[#2C2C2A] mb-2">
              Log In
            </h3>
            <p className="text-[13.5px] text-[#7A7065]">
              Gunakan kredensial admin Anda untuk melanjutkan
            </p>
          </div>

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
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-[#F7F4EF] border border-black/[0.09] rounded-lg text-[13px] text-[#2C2C2A] placeholder:text-[#B8AFA3] outline-none focus:ring-1 focus:ring-[#3A6520]/30 focus:border-[#3A6520]/40 transition disabled:opacity-60"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#B8AFA3] hover:text-[#3A6520] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4.5 h-4.5" strokeWidth={1.75} />
                  ) : (
                    <Eye className="w-4.5 h-4.5" strokeWidth={1.75} />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 bg-[#3A6520] hover:bg-[#2D5016] text-white text-[13px] font-semibold rounded-full shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3A6520] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Menghubungkan..." : "Log In"}
              </button>
            </div>
          </form>

          <div className="mt-6 flex justify-center">
            <button
              onClick={() => nav("home")}
              className="text-[12px] font-medium text-[#7A7065] hover:text-[#2C2C2A] transition-colors"
            >
            Beranda Website
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
