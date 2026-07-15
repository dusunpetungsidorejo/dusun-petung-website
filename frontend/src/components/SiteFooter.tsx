import React from "react";
import { MapPin, Phone, Instagram } from "lucide-react";
import { Page } from "../types";
import { Tiktok } from "./Tiktok";

interface SiteFooterProps {
  nav: (p: Page) => void;
  settings: any;
}

export function SiteFooter({ nav, settings }: SiteFooterProps) {
  const villageName = settings?.village_name || "Dusun Petung";
  const phoneVal = settings?.phone_number || "085138097972";
  let formattedPhone = phoneVal.replace(/[^0-9]/g, "");
  if (formattedPhone.startsWith("0")) {
    formattedPhone = "62" + formattedPhone.slice(1);
  }
  const waUrl = formattedPhone ? `https://wa.me/${formattedPhone}` : "https://wa.me/6285138097972";
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
                  <Tiktok className="w-4 h-4 text-[#3A6520] shrink-0" />
                  TikTok Resmi
                </a>
              ) : null}
            </div>
          </div>
        </div>

        <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-[12px]">© 2026 {villageName} · KKN UPNYK AD.84.242. Hak cipta dilindungi.</p>
          <div className="flex items-center gap-5">
            <p className="text-white/25 text-[12px]">Desa Sidorejo · Kecamatan Kemalang · Kabupaten Klaten · Jawa Tengah</p>
            <button onClick={() => nav("admin")} className="text-white/20 text-[11px] hover:text-white/40 transition-colors">Admin</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
