import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Page, Activity } from "../types";
import { SiteFooter } from "../components/SiteFooter";

interface VillageLifePageProps {
  nav: (p: Page) => void;
  settings: any;
  activities: Activity[];
}

export function VillageLifePage({ nav, settings, activities }: VillageLifePageProps) {
  const [activeLightboxItem, setActiveLightboxItem] = useState<any | null>(null);

  const handleCardClick = (item: any) => {
    if (window.innerWidth < 768) {
      setActiveLightboxItem(item);
    }
  };

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

  const sortOrder = [
    "pertanian",
    "peternakan",
    "gumuk petung camp",
    "merapi",
    "produksi arang",
    "pembuatan arang",
    "pawai budaya",
    "upacara adat",
    "musim tanam",
    "hari panen raya",
    "panen raya",
    "ketekunan petani",
    "jelajah alam",
    "keseharian dusun"
  ];

  const getSortIndex = (title: string) => {
    const t = title.toLowerCase();
    for (let index = 0; index < sortOrder.length; index++) {
      const keyword = sortOrder[index];
      if (t === keyword || t.includes(keyword)) {
        return index;
      }
    }
    return 999;
  };

  allItems.sort((a, b) => getSortIndex(a.title) - getSortIndex(b.title));

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
      <section className="relative overflow-hidden pt-16 pb-12 h-auto sm:py-0 sm:h-[40vh] sm:min-h-[300px]">
        <img
          src="https://images.unsplash.com/photo-1542897643-8158da5b4607?w=1600&h=700&fit=crop&auto=format"
          alt="Pawai komunitas warga Dusun Petung"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 flex flex-col justify-end h-auto sm:h-full pb-0 sm:pb-14">
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
      <section className="py-8 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-16 lg:gap-28 items-start">
            <div className="bg-[#D4C9B5]">
              <img
                src="/images/village-life/description.webp"
                alt="Komunitas warga dusun dalam kegiatan bersama"
                className="w-full object-cover h-[280px] sm:h-[380px] lg:h-[500px]"
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
                Semangat Gumregah <br className="hidden sm:inline" />yang Terus Hidup
              </h2>
              <p className="text-[#5A5550] leading-[1.75] text-[15px] mb-4">
                Di Dusun Petung, gumregah bukan sekadar semangat, melainkan nilai yang hidup dalam keseharian masyarakat. Semangat untuk bergerak bersama, saling membantu, dan menjaga warisan leluhur hadir dalam setiap langkah kehidupan warga.
              </p>
              <p className="text-[#5A5550] leading-[1.75] text-[15px] mb-4">
                Nilai itu tercermin dalam tradisi Nyadran, Babat Makam, Gumbretan, Wiwit, Kenduri, dan Mitoni yang terus dilestarikan sebagai wujud rasa syukur, kepedulian, serta kebersamaan antarwarga dari generasi ke generasi.
              </p>
              <p className="text-[#5A5550] leading-[1.75] text-[15px]">
                Semangat gumregah juga tumbuh melalui berbagai inisiatif masyarakat, salah satunya Gumuk Petung Camp. Berawal dari keinginan menyediakan ruang berkegiatan bagi para pemuda, tempat ini kini menjadi simbol bahwa kebersamaan dapat melahirkan gagasan yang bermanfaat bagi dusun.
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
                Momen Nyata, <br className="hidden sm:inline" />Cerita Sesungguhnya
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
                const widthClass = idx % 4 === 0 
                  ? "w-[270px] xs:w-[320px] sm:w-[400px] lg:w-[440px]" 
                  : "w-[300px] xs:w-[350px] sm:w-[460px] lg:w-[520px]";
                return (
                  <div 
                    key={idx} 
                    onClick={() => handleCardClick(item)}
                    className={`${widthClass} h-[300px] sm:h-[380px] lg:h-[460px] shrink-0 overflow-hidden bg-[#D4C9B5] group relative snap-start cursor-pointer md:cursor-default`}
                  >
                    <img src={item.img} alt={item.alt} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-5">
                      <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-white text-[14px] font-bold block mb-1">{item.title}</span>
                      <span className="text-white/70 text-[12px] line-clamp-2 leading-relaxed">{item.caption}</span>
                      <span className="text-white/90 text-[11px] font-semibold mt-1.5 underline block md:hidden">Lihat Detail...</span>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={idx} className="flex flex-col gap-2.5 sm:gap-3.5 w-[240px] xs:w-[280px] sm:w-[320px] lg:w-[360px] h-[300px] sm:h-[380px] lg:h-[460px] shrink-0 snap-start">
                    {col.items.map((item, subIdx) => (
                      <div 
                        key={subIdx} 
                        onClick={() => handleCardClick(item)}
                        className="flex-1 overflow-hidden bg-[#D4C9B5] group relative cursor-pointer md:cursor-default"
                      >
                        <img src={item.img} alt={item.alt} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4">
                          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-white text-[13px] font-bold block mb-0.5">{item.title}</span>
                          <span className="text-white/70 text-[11.5px] line-clamp-2 leading-relaxed">{item.caption}</span>
                          <span className="text-white/90 text-[10px] font-semibold mt-1 underline block md:hidden">Lihat Detail...</span>
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

      {/* Lightbox Modal for Detail Documentation */}
      {activeLightboxItem && (
        <div 
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveLightboxItem(null)}
        >
          <div 
            className="bg-white rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button 
              onClick={() => setActiveLightboxItem(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/75 transition-colors text-[14px]"
            >
              ✕
            </button>
            
            <div className="flex flex-col md:grid md:grid-cols-[1.1fr_0.9fr] h-full overflow-y-auto">
              {/* Image container */}
              <div className="bg-black flex items-center justify-center min-h-[220px] sm:min-h-[320px] md:h-full relative">
                <img 
                  src={activeLightboxItem.img} 
                  alt={activeLightboxItem.alt} 
                  className="w-full h-full max-h-[35vh] md:max-h-[75vh] object-contain"
                />
              </div>
              
              {/* Content Details */}
              <div className="p-6 sm:p-8 flex flex-col justify-between h-full bg-[#FAF8F5]">
                <div>
                  <span className="text-[#C97C2A] text-[10px] font-bold tracking-[0.15em] uppercase block mb-2">
                    Detail Kegiatan Dusun
                  </span>
                  <h3 
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} 
                    className="text-[20px] sm:text-[24px] font-extrabold text-[#2C2C2A] leading-tight mb-4"
                  >
                    {activeLightboxItem.title}
                  </h3>
                  <div className="w-12 h-0.5 bg-[#3A6520] mb-5" />
                  
                  <div className="overflow-y-auto max-h-[180px] sm:max-h-[240px] pr-2 text-[#5A5550]">
                    <p className="text-[13.5px] sm:text-[14.5px] leading-[1.7] whitespace-pre-line">
                      {activeLightboxItem.caption}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-black/5 flex justify-end">
                  <button
                    onClick={() => setActiveLightboxItem(null)}
                    className="px-6 py-2.5 bg-[#3A6520] hover:bg-[#2D5016] text-white text-[12px] font-semibold rounded-full transition-colors uppercase tracking-wider"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <SiteFooter nav={nav} settings={settings} />
    </>
  );
}
