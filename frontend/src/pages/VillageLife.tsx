import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Page, Activity } from "../types";
import { SiteFooter } from "../components/SiteFooter";

interface VillageLifePageProps {
  nav: (p: Page) => void;
  settings: any;
  activities: Activity[];
}

export function VillageLifePage({ nav, settings, activities }: VillageLifePageProps) {
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

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth"
      });
    }
  };

  const displayItems = activities.map(act => ({
    img: act.image_url,
    alt: act.title,
    title: act.title,
    caption: act.description,
    tall: false
  }));

  const allItems: any[] = [...displayItems];
  galleryItems.forEach(item => {
    if (!displayItems.some(act => act.title.toLowerCase() === item.title.toLowerCase())) {
      allItems.push(item);
    }
  });

  // Group allItems into collage columns
  const columns: { type: "single" | "double"; items: any[] }[] = [];
  let i = 0;
  while (i < allItems.length) {
    const colIndex = columns.length;
    if (colIndex % 2 === 0) {
      columns.push({
        type: "single",
        items: [allItems[i]]
      });
      i += 1;
    } else {
      const nextItems = allItems.slice(i, i + 2);
      columns.push({
        type: "double",
        items: nextItems
      });
      i += nextItems.length;
    }
  }

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
      <section className="pb-24 lg:pb-36 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
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
            {/* Scroll Navigation Buttons */}
            <div className="flex items-center gap-3 self-start md:self-end">
              <button 
                onClick={() => scroll("left")}
                className="w-11 h-11 rounded-full border border-black/10 flex items-center justify-center hover:bg-[#3A6520] hover:text-white transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => scroll("right")}
                className="w-11 h-11 rounded-full border border-black/10 flex items-center justify-center hover:bg-[#3A6520] hover:text-white transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Horizontally scrolling dynamic masonry collage */}
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-3.5 pb-6 scrollbar-none snap-x snap-mandatory"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {columns.map((col, idx) => {
              if (col.type === "single") {
                const item = col.items[0];
                if (!item) return null;
                const widthClass = idx % 4 === 0 ? "w-[440px]" : "w-[520px]";
                return (
                  <div 
                    key={idx} 
                    className={`${widthClass} h-[460px] shrink-0 overflow-hidden bg-[#D4C9B5] group relative snap-start`}
                  >
                    <img src={item.img} alt={item.alt} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-5">
                      <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-white text-[14px] font-bold block mb-1">{item.title}</span>
                      <span className="text-white/70 text-[12px] line-clamp-2 leading-relaxed">{item.caption}</span>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={idx} className="flex flex-col gap-3.5 w-[360px] shrink-0 snap-start">
                    {col.items.map((item, subIdx) => (
                      <div 
                        key={subIdx} 
                        className="h-[223px] overflow-hidden bg-[#D4C9B5] group relative"
                      >
                        <img src={item.img} alt={item.alt} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4">
                          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-white text-[13px] font-bold block mb-0.5">{item.title}</span>
                          <span className="text-white/70 text-[11.5px] line-clamp-2 leading-relaxed">{item.caption}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              }
            })}
          </div>
        </div>
      </section>

      <SiteFooter nav={nav} settings={settings} />
    </>
  );
}
