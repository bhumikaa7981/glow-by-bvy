import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Heart, Bookmark, ShoppingBag, Search, Menu, X, Star, ChevronRight,
  ChevronLeft, Sparkles, Gem, Circle, MessageCircle, Plus, Minus,
  Trash2, Sun, Moon, Instagram, Facebook, Mail, Filter, SlidersHorizontal,
  Truck, ShieldCheck, RotateCcw, ArrowRight, Eye
} from "lucide-react";

/* ============================================================
   GLOW BY BVY — a fictional Gen-Z fashion jewelry brand
   Design tokens — trendy pastel, dreamy, floaty
   ink:      #564B72   (soft plum-grey, readable but never harsh)
   base:     #FFF8FB   (blush-white, light bg)
   baseDark: #241E38   (deep lavender-night, dark bg)
   plum:     #8C7FD1   (lilac anchor, replaces old luxury-deep-plum)
   coral:    #FFB4CB   (candy-pink, gradient start)
   fuchsia:  #C6A8F7   (lavender, gradient end)
   gold:     #FFD9A0   (peach-gold, metallic-adjacent accent)
   mint:     #AEEBD2   (colorful pop, tags/badges)
   Display face: Fraunces (soft-serif, editorial, quirky ball terminals)
   Body/UI face: Manrope
   Motion direction: everything drifts — cards, icons, blobs all get a
   slow continuous float, like they're suspended in a bubble bath.
   ============================================================ */

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..800&family=Manrope:wght@400;500;600;700;800&display=swap');`;

const C = {
  ink: "#564B72",
  base: "#FFF8FB",
  baseDark: "#241E38",
  plum: "#8C7FD1",
  plumDeep: "#6E5FB8",
  coral: "#FFB4CB",
  fuchsia: "#C6A8F7",
  gold: "#FFD9A0",
  mint: "#AEEBD2",
  card: "#FFFFFF",
  cardDark: "#2E2648",
};

const grad = `linear-gradient(135deg, ${C.coral} 0%, ${C.fuchsia} 100%)`;
const gradGold = `linear-gradient(135deg, ${C.gold} 0%, #FFEFD1 100%)`;

/* ---------------- mock data ---------------- */
const CATS = [
  { name: "Necklaces", icon: "necklace" },
  { name: "Earrings", icon: "earring" },
  { name: "Rings", icon: "ring" },
  { name: "Bracelets", icon: "bracelet" },
  { name: "Anklets", icon: "anklet" },
  { name: "Sets", icon: "set" },
];

const TILE_BGS = [
  `linear-gradient(140deg,#FFDCE8,#FFB4CB)`,
  `linear-gradient(140deg,#EBDCFF,#C6A8F7)`,
  `linear-gradient(140deg,#FFF0D6,#FFD9A0)`,
  `linear-gradient(140deg,#D6F5E7,#AEEBD2)`,
  `linear-gradient(140deg,#DCEBFF,#B4D4FF)`,
  `linear-gradient(140deg,#FFE3D6,#FFC4A8)`,
];

function seedProducts() {
  const names = [
    "Halo Drop Earrings", "Luna Choker", "Stacked Signet Ring", "Twist Cuff Bracelet",
    "Aria Pendant Necklace", "Coin Anklet", "Marquise Studs", "Everyday Layer Set",
    "Baguette Huggie Hoops", "Cascade Necklace", "Knot Ring Duo", "Charm Bangle",
    "Pearl Drop Studs", "Orbit Necklace", "Chevron Anklet", "Statement Cocktail Ring",
  ];
  const cats = ["Earrings","Necklaces","Rings","Bracelets","Necklaces","Anklets","Earrings","Sets","Earrings","Necklaces","Rings","Bracelets","Earrings","Necklaces","Anklets","Rings"];
  const materials = ["Gold Plated","Sterling Silver","Rose Gold","Oxidised Silver"];
  return names.map((n, i) => {
    const mrp = 799 + (i % 6) * 250;
    const discount = [10,15,20,25,30,0][i % 6];
    const sale = Math.round(mrp * (1 - discount / 100));
    return {
      id: `BVY-${1000 + i}`,
      name: n,
      category: cats[i],
      material: materials[i % materials.length],
      mrp, sale, discount,
      rating: (3.8 + ((i * 7) % 12) / 10).toFixed(1),
      reviews: 12 + i * 9,
      tag: i % 5 === 0 ? "Bestseller" : i % 4 === 0 ? "New" : i % 7 === 0 ? "Trending" : null,
      bg: TILE_BGS[i % TILE_BGS.length],
      inStock: i % 9 !== 0,
    };
  });
}

const PRODUCTS = seedProducts();

function CatIcon({ type, size = 22, color = C.ink }) {
  const props = { size, color, strokeWidth: 1.6 };
  switch (type) {
    case "ring": return <Circle {...props} />;
    default: return <Gem {...props} />;
  }
}

/* ---------------- shared bits ---------------- */

function GlintLogo({ dark }) {
  return (
    <div className="flex items-baseline gap-1.5 select-none">
      <Sparkles size={18} color={dark ? C.gold : C.coral} className="self-center animate-[float_4s_ease-in-out_infinite]" />
      <span
        style={{ fontFamily: "Fraunces, serif", fontWeight: 600, letterSpacing: "0.01em", color: dark ? "#F5EAF8" : C.ink }}
        className="text-xl"
      >
        Glow
      </span>
      <span
        style={{ fontFamily: "Manrope", fontWeight: 700, letterSpacing: "0.06em", color: dark ? C.gold : C.plum, fontSize: 10 }}
        className="uppercase"
      >
        by BVY
      </span>
    </div>
  );
}

function Badge({ children, style, className = "" }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide ${className}`}
      style={style}
    >
      {children}
    </span>
  );
}

function Price({ mrp, sale, discount, size = "base", dark }) {
  const sizes = { sm: "text-sm", base: "text-base", lg: "text-2xl" };
  return (
    <div className="flex items-baseline gap-2 flex-wrap">
      <span className={`font-bold ${sizes[size]}`} style={{ color: dark ? "#fff" : C.ink, fontFamily: "Manrope" }}>₹{sale}</span>
      {discount > 0 && (
        <>
          <span className="text-xs line-through opacity-50" style={{ color: dark ? "#fff" : C.ink }}>₹{mrp}</span>
          <span className="text-xs font-bold" style={{ color: C.fuchsia }}>{discount}% off</span>
        </>
      )}
    </div>
  );
}

/* Signature element: the "glint" jewelry card — a light sweep glides across
   the tile on hover, like a catch-light moving across a polished stone. */
function ProductCard({ p, onOpen, wishlist, toggleWishlist, bookmarks, toggleBookmark, dark, floatDelay = 0 }) {
  const [hover, setHover] = useState(false);
  const isWished = wishlist.has(p.id);
  const isBooked = bookmarks.has(p.id);
  return (
    <div
      className="group relative rounded-[22px] overflow-hidden cursor-pointer transition-transform duration-300"
      style={{
        background: dark ? C.cardDark : C.card,
        boxShadow: hover
          ? "0 22px 40px -18px rgba(43,20,58,0.35)"
          : "0 8px 20px -14px rgba(43,20,58,0.18)",
        transform: hover ? "translateY(-6px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onOpen(p)}
    >
      <div className="relative aspect-[4/5] overflow-hidden" style={{ background: p.bg }}>
        {/* glint sweep */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.55) 48%, transparent 66%)",
            transform: hover ? "translateX(60%)" : "translateX(-120%)",
            transition: "transform 0.85s cubic-bezier(.2,.8,.2,1)",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="rounded-full flex items-center justify-center animate-[float_5s_ease-in-out_infinite]"
            style={{
              width: 84, height: 84, background: "rgba(255,255,255,0.4)", backdropFilter: "blur(6px)",
              animationDelay: `${floatDelay}s`,
              transform: hover ? "scale(1.1) rotate(6deg)" : undefined,
              transition: "transform 0.5s",
            }}
          >
            <Gem size={34} color="#fff" strokeWidth={1.4} />
          </div>
        </div>

        {p.tag && (
          <Badge className="absolute top-3 left-3 text-white" style={{ background: p.tag === "Bestseller" ? C.plum : p.tag === "New" ? "#1F8F5F" : C.fuchsia }}>
            {p.tag}
          </Badge>
        )}
        {p.discount > 0 && (
          <Badge className="absolute top-3 right-3" style={{ background: "rgba(255,255,255,0.9)", color: C.ink }}>
            -{p.discount}%
          </Badge>
        )}

        {/* quick actions */}
        <div
          className="absolute bottom-3 right-3 flex flex-col gap-2 transition-all duration-300"
          style={{ opacity: hover ? 1 : 0, transform: hover ? "translateX(0)" : "translateX(8px)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            aria-label="Wishlist"
            onClick={() => toggleWishlist(p.id)}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-110"
            style={{ background: "rgba(255,255,255,0.92)" }}
          >
            <Heart size={16} color={isWished ? C.coral : C.ink} fill={isWished ? C.coral : "none"} />
          </button>
          <button
            aria-label="Bookmark"
            onClick={() => toggleBookmark(p.id)}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-110"
            style={{ background: "rgba(255,255,255,0.92)" }}
          >
            <Bookmark size={16} color={isBooked ? C.plum : C.ink} fill={isBooked ? C.plum : "none"} />
          </button>
          <button
            aria-label="Quick view"
            onClick={() => onOpen(p)}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-110"
            style={{ background: "rgba(255,255,255,0.92)" }}
          >
            <Eye size={16} color={C.ink} />
          </button>
        </div>

        {!p.inStock && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(20,10,25,0.45)" }}>
            <Badge className="text-white" style={{ background: C.ink }}>Out of stock</Badge>
          </div>
        )}
      </div>

      <div className="p-3.5">
        <p className="text-[11px] uppercase tracking-wider opacity-55 mb-0.5" style={{ color: dark ? "#eee" : C.ink, fontFamily: "Manrope" }}>{p.material}</p>
        <h3 className="text-[15px] font-semibold mb-1.5 leading-snug" style={{ color: dark ? "#fff" : C.ink, fontFamily: "Manrope" }}>{p.name}</h3>
        <div className="flex items-center gap-1 mb-1.5">
          <Star size={13} color={C.gold} fill={C.gold} />
          <span className="text-xs opacity-70" style={{ color: dark ? "#fff" : C.ink }}>{p.rating} ({p.reviews})</span>
        </div>
        <Price mrp={p.mrp} sale={p.sale} discount={p.discount} dark={dark} />
      </div>
    </div>
  );
}

function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setShown(true); }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function Countdown() {
  const [t, setT] = useState(3 * 3600 + 47 * 60 + 12);
  useEffect(() => {
    const id = setInterval(() => setT((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), s = t % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return (
    <div className="flex gap-2">
      {[["H", h], ["M", m], ["S", s]].map(([label, val]) => (
        <div key={label} className="rounded-xl px-3 py-2 text-center min-w-[54px]" style={{ background: "rgba(255,255,255,0.16)", backdropFilter: "blur(8px)" }}>
          <div className="text-lg font-bold text-white" style={{ fontFamily: "Fraunces" }}>{pad(val)}</div>
          <div className="text-[10px] text-white/70 tracking-wide">{label}</div>
        </div>
      ))}
    </div>
  );
}

function Counter({ to, suffix = "" }) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return;
    let f = 0;
    const id = setInterval(() => {
      f += 1;
      setVal(Math.round((to * f) / 30));
      if (f >= 30) clearInterval(id);
    }, 25);
    return () => clearInterval(id);
  }, [started, to]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ---------------- layout: navbar / footer ---------------- */

function NavBar({ view, setView, dark, setDark, cartCount, wishCount, menuOpen, setMenuOpen, query, setQuery }) {
  const links = [
    { id: "home", label: "Home" },
    { id: "shop", label: "Shop" },
    { id: "wishlist", label: "Wishlist" },
  ];
  return (
    <div
      className="sticky top-0 z-40 backdrop-blur-xl border-b"
      style={{ background: dark ? "rgba(23,15,28,0.75)" : "rgba(251,246,243,0.75)", borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(36,23,38,0.06)" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <button onClick={() => setMenuOpen((v) => !v)} className="md:hidden p-1.5 -ml-1.5" aria-label="Menu">
          {menuOpen ? <X size={22} color={dark ? "#fff" : C.ink} /> : <Menu size={22} color={dark ? "#fff" : C.ink} />}
        </button>
        <button onClick={() => setView("home")}><GlintLogo dark={dark} /></button>

        <div className="hidden md:flex items-center gap-7 ml-6">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => setView(l.id)}
              className="text-sm font-semibold tracking-wide transition-opacity hover:opacity-70 relative pb-1"
              style={{ color: dark ? "#F5EAF8" : C.ink, fontFamily: "Manrope", opacity: view === l.id ? 1 : 0.65 }}
            >
              {l.label}
              {view === l.id && <span className="absolute left-0 -bottom-0.5 w-full h-[2px] rounded-full" style={{ background: grad }} />}
            </button>
          ))}
        </div>

        <div className="hidden sm:flex items-center flex-1 max-w-xs ml-4 relative">
          <Search size={15} className="absolute left-3" color={dark ? "#bbb" : "#8a7a8f"} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search hoops, rings…"
            className="w-full pl-8 pr-3 py-2 rounded-full text-sm outline-none"
            style={{ background: dark ? "rgba(255,255,255,0.08)" : "rgba(36,23,38,0.05)", color: dark ? "#fff" : C.ink, fontFamily: "Manrope" }}
          />
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
          <button onClick={() => setDark(!dark)} className="p-2 rounded-full transition-transform hover:scale-110" aria-label="Toggle theme">
            {dark ? <Sun size={19} color="#fff" /> : <Moon size={19} color={C.ink} />}
          </button>
          <button onClick={() => setView("wishlist")} className="relative p-2 rounded-full transition-transform hover:scale-110" aria-label="Wishlist">
            <Heart size={19} color={dark ? "#fff" : C.ink} />
            {wishCount > 0 && <span className="absolute -top-0.5 -right-0.5 text-[10px] w-4 h-4 rounded-full flex items-center justify-center text-white font-bold" style={{ background: C.coral }}>{wishCount}</span>}
          </button>
          <button onClick={() => setView("cart")} className="relative p-2 rounded-full transition-transform hover:scale-110" aria-label="Bag">
            <ShoppingBag size={19} color={dark ? "#fff" : C.ink} />
            {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 text-[10px] w-4 h-4 rounded-full flex items-center justify-center text-white font-bold" style={{ background: C.plum }}>{cartCount}</span>}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 pb-3 flex flex-col gap-2">
          {links.map((l) => (
            <button key={l.id} onClick={() => { setView(l.id); setMenuOpen(false); }} className="text-left text-sm font-semibold py-1.5" style={{ color: dark ? "#fff" : C.ink }}>
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Footer({ dark }) {
  const cols = [
    { title: "Shop", items: ["Necklaces", "Earrings", "Rings", "New Arrivals", "Sale"] },
    { title: "Help", items: ["Track Order", "Shipping Policy", "Return Policy", "FAQ", "Contact Us"] },
    { title: "Glow", items: ["About Us", "Privacy Policy", "Terms & Conditions"] },
  ];
  return (
    <footer className="mt-16 pt-14 pb-8 px-6" style={{ background: dark ? C.plumDeep : C.ink, color: "#F3EAF6" }}>
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2">
          <GlintLogo dark />
          <p className="text-sm opacity-60 mt-3 max-w-xs" style={{ fontFamily: "Manrope" }}>Soft, dreamy jewelry with just enough sparkle. Designed for the way you actually live — layered, stacked, worn out the door.</p>
          <div className="flex gap-3 mt-4">
            {[Instagram, Facebook, MessageCircle, Mail].map((Icon, i) => (
              <div key={i} className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110" style={{ background: "rgba(255,255,255,0.1)" }}>
                <Icon size={16} />
              </div>
            ))}
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h4 className="text-sm font-bold mb-3 tracking-wide" style={{ fontFamily: "Manrope" }}>{c.title}</h4>
            <ul className="space-y-2 text-sm opacity-60" style={{ fontFamily: "Manrope" }}>
              {c.items.map((i) => <li key={i} className="cursor-pointer hover:opacity-100 transition-opacity">{i}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-2 text-xs opacity-45" style={{ fontFamily: "Manrope" }}>
        <span>© 2026 Glow by BVY. All rights reserved.</span>
        <span>Made for the ones who like to glow softly.</span>
      </div>
    </footer>
  );
}

/* ---------------- HOME ---------------- */

function Home({ dark, onOpen, wishlist, toggleWishlist, bookmarks, toggleBookmark, setView }) {
  const trending = PRODUCTS.slice(0, 4);
  const newArrivals = PRODUCTS.slice(4, 8);
  const bestSellers = PRODUCTS.slice(8, 12);
  const flash = PRODUCTS.slice(2, 6);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden px-4 sm:px-6 pt-10 pb-16" style={{ background: dark ? `radial-gradient(120% 100% at 50% -10%, ${C.plum} 0%, ${C.baseDark} 60%)` : `radial-gradient(120% 100% at 50% -10%, #FDEFF3 0%, ${C.base} 55%)` }}>
        {/* floating blobs */}
        <div className="absolute -top-10 -left-16 w-64 h-64 rounded-full opacity-40 blur-3xl animate-pulse" style={{ background: grad }} />
        <div className="absolute top-24 right-0 w-72 h-72 rounded-full opacity-30 blur-3xl" style={{ background: gradGold }} />

        <div className="max-w-6xl mx-auto relative flex flex-col items-center text-center pt-8">
          <Reveal>
            <Badge className="mb-5" style={{ background: dark ? "rgba(255,255,255,0.12)" : "rgba(59,31,77,0.08)", color: dark ? "#F3E4FF" : C.plum }}>
              <Sparkles size={12} className="mr-1" /> New drop · Soft Glow collection
            </Badge>
          </Reveal>
          <Reveal delay={0.08}>
            <h1
              className="text-[13vw] sm:text-6xl md:text-7xl leading-[0.98] max-w-3xl"
              style={{ fontFamily: "Fraunces, serif", fontWeight: 500, color: dark ? "#FBF3FF" : C.ink }}
            >
              Jewelry with a
              <span
                className="block italic"
                style={{ backgroundImage: grad, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", fontWeight: 600 }}
              >
                soft glow.
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="max-w-md mt-5 text-base opacity-70" style={{ color: dark ? "#e9d9f0" : C.ink, fontFamily: "Manrope" }}>
              Dreamy pastel pieces that stack, layer, and float through your everyday. New styles dropped weekly — starting under ₹899.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="flex flex-wrap gap-3 mt-7 justify-center">
              <button onClick={() => setView("shop")} className="px-6 py-3 rounded-full font-semibold text-sm text-white flex items-center gap-2 transition-transform hover:scale-105 active:scale-95" style={{ background: grad, fontFamily: "Manrope" }}>
                Shop the drop <ArrowRight size={15} />
              </button>
              <button onClick={() => setView("shop")} className="px-6 py-3 rounded-full font-semibold text-sm transition-transform hover:scale-105 active:scale-95" style={{ background: dark ? "rgba(255,255,255,0.1)" : "#fff", color: dark ? "#fff" : C.ink, fontFamily: "Manrope" }}>
                Explore categories
              </button>
            </div>
          </Reveal>

          {/* floating jewelry cards */}
          <div className="relative w-full mt-14 h-44 sm:h-56 hidden sm:block">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute rounded-3xl shadow-2xl flex items-center justify-center animate-[float_6s_ease-in-out_infinite]"
                style={{
                  width: 130, height: 160,
                  background: TILE_BGS[i * 2],
                  left: `calc(50% + ${(i - 1) * 150}px)`,
                  top: i === 1 ? 0 : 22,
                  transform: `rotate(${(i - 1) * 8}deg)`,
                  animationDelay: `${i * 0.4}s`,
                }}
              >
                <Gem size={30} color="#fff" strokeWidth={1.3} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-14">
        <Reveal><h2 className="text-2xl font-semibold mb-5" style={{ fontFamily: "Fraunces", color: dark ? "#fff" : C.ink }}>Shop by category</h2></Reveal>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {CATS.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.05}>
              <button onClick={() => setView("shop")} className="w-full flex flex-col items-center gap-2 p-4 rounded-2xl transition-all hover:-translate-y-1" style={{ background: TILE_BGS[i % TILE_BGS.length] }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center animate-[float_4.5s_ease-in-out_infinite]" style={{ background: "rgba(255,255,255,0.4)", animationDelay: `${i * 0.2}s` }}>
                  <CatIcon type={c.icon} color="#fff" />
                </div>
                <span className="text-xs font-bold text-white" style={{ fontFamily: "Manrope" }}>{c.name}</span>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FLASH SALE */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-16">
        <Reveal>
          <div className="rounded-[28px] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5" style={{ background: `linear-gradient(120deg, ${C.plum}, ${C.fuchsia})` }}>
            <div>
              <p className="text-xs font-bold tracking-widest text-white/70 mb-1" style={{ fontFamily: "Manrope" }}>ENDS SOON</p>
              <h3 className="text-2xl sm:text-3xl font-semibold text-white" style={{ fontFamily: "Fraunces" }}>Flash Sale — up to 40% off</h3>
            </div>
            <Countdown />
          </div>
        </Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          {flash.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <ProductCard p={p} onOpen={onOpen} wishlist={wishlist} toggleWishlist={toggleWishlist} bookmarks={bookmarks} toggleBookmark={toggleBookmark} dark={dark} floatDelay={i * 0.3} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* TRENDING */}
      <SectionGrid title="Trending now" items={trending} {...{ dark, onOpen, wishlist, toggleWishlist, bookmarks, toggleBookmark }} />
      {/* NEW ARRIVALS */}
      <SectionGrid title="New arrivals" items={newArrivals} {...{ dark, onOpen, wishlist, toggleWishlist, bookmarks, toggleBookmark }} />
      {/* BEST SELLERS */}
      <SectionGrid title="Best sellers" items={bestSellers} {...{ dark, onOpen, wishlist, toggleWishlist, bookmarks, toggleBookmark }} />

      {/* STATS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-16">
        <div className="grid grid-cols-3 gap-4 rounded-[28px] p-8" style={{ background: dark ? "rgba(255,255,255,0.05)" : "#fff" }}>
          {[["50K+", "Happy customers"], ["4.8", "Average rating"], ["180+", "New styles / month"]].map(([n, l]) => (
            <div key={l} className="text-center">
              <div className="text-3xl sm:text-4xl font-semibold" style={{ fontFamily: "Fraunces", color: dark ? "#fff" : C.plum }}>
                {n.includes("K") ? <><Counter to={50} />K+</> : n.includes(".") ? n : <><Counter to={180} />+</>}
              </div>
              <p className="text-xs sm:text-sm opacity-60 mt-1" style={{ color: dark ? "#fff" : C.ink, fontFamily: "Manrope" }}>{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-16">
        <Reveal><h2 className="text-2xl font-semibold mb-5" style={{ fontFamily: "Fraunces", color: dark ? "#fff" : C.ink }}>Loved by 50,000+</h2></Reveal>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            ["Ritika S.", "The Aria pendant is literally stuck to my neck now. Doesn't tarnish, doesn't itch. Obsessed.", 5],
            ["Devika M.", "Ordered the stacking rings for a friend's wedding — got so many compliments. Packaging was gorgeous too.", 5],
            ["Aanya P.", "WhatsApp ordering made it so easy, no app download drama. Got my hoops in 3 days.", 4],
          ].map(([name, text, rating], i) => (
            <Reveal key={name} delay={i * 0.08}>
              <div className="rounded-2xl p-5 h-full" style={{ background: dark ? "rgba(255,255,255,0.05)" : "#fff", boxShadow: "0 8px 24px -18px rgba(43,20,58,0.25)" }}>
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, s) => <Star key={s} size={13} color={C.gold} fill={s < rating ? C.gold : "none"} />)}
                </div>
                <p className="text-sm opacity-80 mb-3" style={{ color: dark ? "#fff" : C.ink, fontFamily: "Manrope" }}>"{text}"</p>
                <p className="text-xs font-bold opacity-60" style={{ color: dark ? "#fff" : C.ink }}>{name}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* INSTAGRAM GALLERY */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-16">
        <Reveal>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-semibold" style={{ fontFamily: "Fraunces", color: dark ? "#fff" : C.ink }}>@glow.bvy on Instagram</h2>
            <Instagram size={20} color={dark ? "#fff" : C.ink} />
          </div>
        </Reveal>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
          {TILE_BGS.concat(TILE_BGS).slice(0, 6).map((bg, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <div className="aspect-square rounded-xl transition-transform hover:scale-95 cursor-pointer" style={{ background: bg }} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-16">
        <Reveal>
          <div className="rounded-[28px] p-8 sm:p-10 text-center" style={{ background: dark ? "rgba(255,255,255,0.05)" : "#fff" }}>
            <h3 className="text-2xl font-semibold mb-2" style={{ fontFamily: "Fraunces", color: dark ? "#fff" : C.ink }}>Get first access to new drops</h3>
            <p className="text-sm opacity-60 mb-5" style={{ color: dark ? "#fff" : C.ink, fontFamily: "Manrope" }}>Plus 10% off your first order. No spam, just sparkle.</p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input placeholder="you@email.com" className="flex-1 px-4 py-3 rounded-full text-sm outline-none" style={{ background: dark ? "rgba(255,255,255,0.08)" : C.base, color: dark ? "#fff" : C.ink, fontFamily: "Manrope" }} />
              <button className="px-6 py-3 rounded-full font-semibold text-sm text-white transition-transform hover:scale-105" style={{ background: grad, fontFamily: "Manrope" }}>Subscribe</button>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function SectionGrid({ title, items, dark, onOpen, wishlist, toggleWishlist, bookmarks, toggleBookmark }) {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-16">
      <Reveal><h2 className="text-2xl font-semibold mb-5" style={{ fontFamily: "Fraunces", color: dark ? "#fff" : C.ink }}>{title}</h2></Reveal>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {items.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.06}>
            <ProductCard p={p} onOpen={onOpen} wishlist={wishlist} toggleWishlist={toggleWishlist} bookmarks={bookmarks} toggleBookmark={toggleBookmark} dark={dark} floatDelay={i * 0.3} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- SHOP ---------------- */

function Shop({ dark, onOpen, wishlist, toggleWishlist, bookmarks, toggleBookmark, query }) {
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("popularity");
  const [maxPrice, setMaxPrice] = useState(2500);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visible, setVisible] = useState(8);

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => p.sale <= maxPrice);
    if (cat !== "All") list = list.filter((p) => p.category === cat);
    if (query) list = list.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
    if (sort === "price-low") list = [...list].sort((a, b) => a.sale - b.sale);
    if (sort === "price-high") list = [...list].sort((a, b) => b.sale - a.sale);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === "newest") list = [...list].reverse();
    return list;
  }, [cat, sort, maxPrice, query]);

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-xs font-bold tracking-wide uppercase opacity-60 mb-3" style={{ color: dark ? "#fff" : C.ink }}>Category</h4>
        <div className="flex flex-col gap-1.5">
          {["All", ...CATS.map((c) => c.name)].map((c) => (
            <button key={c} onClick={() => setCat(c)} className="text-left text-sm py-1 px-2 rounded-lg transition-colors" style={{ background: cat === c ? (dark ? "rgba(255,255,255,0.1)" : C.base) : "transparent", color: dark ? "#fff" : C.ink, fontWeight: cat === c ? 700 : 500, fontFamily: "Manrope" }}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-xs font-bold tracking-wide uppercase opacity-60 mb-3" style={{ color: dark ? "#fff" : C.ink }}>Price up to ₹{maxPrice}</h4>
        <input type="range" min="500" max="2500" step="100" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-fuchsia-500" />
      </div>
      <div>
        <h4 className="text-xs font-bold tracking-wide uppercase opacity-60 mb-3" style={{ color: dark ? "#fff" : C.ink }}>Material</h4>
        <div className="flex flex-wrap gap-2">
          {["Gold Plated", "Sterling Silver", "Rose Gold", "Oxidised Silver"].map((m) => (
            <Badge key={m} style={{ background: dark ? "rgba(255,255,255,0.08)" : C.base, color: dark ? "#fff" : C.ink }}>{m}</Badge>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-xs font-bold tracking-wide uppercase opacity-60 mb-3" style={{ color: dark ? "#fff" : C.ink }}>Availability</h4>
        <label className="flex items-center gap-2 text-sm" style={{ color: dark ? "#fff" : C.ink, fontFamily: "Manrope" }}>
          <input type="checkbox" /> In stock only
        </label>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-16">
      <Reveal>
        <div className="flex items-end justify-between mb-1">
          <h1 className="text-3xl font-semibold" style={{ fontFamily: "Fraunces", color: dark ? "#fff" : C.ink }}>Shop all jewelry</h1>
        </div>
        <p className="text-sm opacity-60 mb-6" style={{ color: dark ? "#fff" : C.ink, fontFamily: "Manrope" }}>{filtered.length} styles{query ? ` for “${query}”` : ""}</p>
      </Reveal>

      <div className="flex items-center justify-between mb-6 sm:hidden">
        <button onClick={() => setFiltersOpen(true)} className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full" style={{ background: dark ? "rgba(255,255,255,0.08)" : "#fff", color: dark ? "#fff" : C.ink }}>
          <SlidersHorizontal size={14} /> Filters
        </button>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="text-sm rounded-full px-3 py-2" style={{ background: dark ? "rgba(255,255,255,0.08)" : "#fff", color: dark ? "#fff" : C.ink }}>
          <option value="popularity">Popularity</option>
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      <div className="flex gap-8">
        <aside className="hidden sm:block w-56 flex-shrink-0">
          <FilterPanel />
        </aside>

        <div className="flex-1">
          <div className="hidden sm:flex justify-end mb-5">
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="text-sm rounded-full px-4 py-2 outline-none" style={{ background: dark ? "rgba(255,255,255,0.08)" : "#fff", color: dark ? "#fff" : C.ink, fontFamily: "Manrope" }}>
              <option value="popularity">Sort: Popularity</option>
              <option value="newest">Sort: Newest</option>
              <option value="price-low">Sort: Price low to high</option>
              <option value="price-high">Sort: Price high to low</option>
              <option value="rating">Sort: Rating</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 opacity-60" style={{ color: dark ? "#fff" : C.ink, fontFamily: "Manrope" }}>No pieces match those filters yet — try widening your price range.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filtered.slice(0, visible).map((p, i) => (
                <Reveal key={p.id} delay={(i % 6) * 0.05}>
                  <ProductCard p={p} onOpen={onOpen} wishlist={wishlist} toggleWishlist={toggleWishlist} bookmarks={bookmarks} toggleBookmark={toggleBookmark} dark={dark} floatDelay={i * 0.25} />
                </Reveal>
              ))}
            </div>
          )}

          {visible < filtered.length && (
            <div className="flex justify-center mt-8">
              <button onClick={() => setVisible((v) => v + 8)} className="px-6 py-3 rounded-full text-sm font-semibold transition-transform hover:scale-105" style={{ background: dark ? "rgba(255,255,255,0.08)" : "#fff", color: dark ? "#fff" : C.ink }}>
                Load more
              </button>
            </div>
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 flex" onClick={() => setFiltersOpen(false)}>
          <div className="absolute inset-0" style={{ background: "rgba(20,10,25,0.5)" }} />
          <div className="relative ml-auto w-72 h-full p-5 overflow-y-auto" style={{ background: dark ? C.baseDark : "#fff" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold" style={{ color: dark ? "#fff" : C.ink }}>Filters</h3>
              <X size={18} onClick={() => setFiltersOpen(false)} color={dark ? "#fff" : C.ink} />
            </div>
            <FilterPanel />
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- PRODUCT DETAIL ---------------- */

function ProductDetail({ p, dark, addToCart, wishlist, toggleWishlist, bookmarks, toggleBookmark, onOpen }) {
  const [qty, setQty] = useState(1);
  const [thumb, setThumb] = useState(0);
  const [tab, setTab] = useState("desc");
  const isWished = wishlist.has(p.id);
  const isBooked = bookmarks.has(p.id);
  const related = PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);

  const waMessage = encodeURIComponent(
    `Hi Glow by BVY! I'd like to order:\n• ${p.name} (${p.id}) x${qty} — ₹${p.sale * qty}\n\nCould you confirm availability and delivery time?`
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-16">
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <div className="aspect-square rounded-3xl overflow-hidden relative flex items-center justify-center mb-3" style={{ background: p.bg }}>
            <div className="w-32 h-32 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.35)" }}>
              <Gem size={54} color="#fff" strokeWidth={1.2} />
            </div>
            <Badge className="absolute top-4 left-4" style={{ background: "rgba(255,255,255,0.9)", color: C.ink }}>360° view available</Badge>
          </div>
          <div className="flex gap-2">
            {[0, 1, 2, 3].map((i) => (
              <button key={i} onClick={() => setThumb(i)} className="w-16 h-16 rounded-xl flex-shrink-0 transition-all" style={{ background: p.bg, opacity: thumb === i ? 1 : 0.45, outline: thumb === i ? `2px solid ${C.fuchsia}` : "none" }} />
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs opacity-50 mb-1" style={{ color: dark ? "#fff" : C.ink, fontFamily: "Manrope" }}>{p.id} · {p.material}</p>
          <h1 className="text-3xl font-semibold mb-2" style={{ fontFamily: "Fraunces", color: dark ? "#fff" : C.ink }}>{p.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, s) => <Star key={s} size={14} color={C.gold} fill={s < Math.round(p.rating) ? C.gold : "none"} />)}</div>
            <span className="text-sm opacity-60" style={{ color: dark ? "#fff" : C.ink }}>{p.rating} · {p.reviews} reviews</span>
          </div>
          <Price mrp={p.mrp} sale={p.sale} discount={p.discount} size="lg" dark={dark} />

          <p className={`text-sm font-semibold mt-4 flex items-center gap-1.5`} style={{ color: p.inStock ? "#1F8F5F" : "#D64545" }}>
            <Circle size={7} fill="currentColor" /> {p.inStock ? "In stock, ready to ship" : "Currently out of stock"}
          </p>
          <p className="text-sm opacity-60 mt-1 flex items-center gap-1.5" style={{ color: dark ? "#fff" : C.ink, fontFamily: "Manrope" }}>
            <Truck size={14} /> Delivers in 3–5 business days
          </p>

          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center rounded-full overflow-hidden" style={{ background: dark ? "rgba(255,255,255,0.08)" : C.base }}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3"><Minus size={14} color={dark ? "#fff" : C.ink} /></button>
              <span className="px-3 font-semibold" style={{ color: dark ? "#fff" : C.ink }}>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="p-3"><Plus size={14} color={dark ? "#fff" : C.ink} /></button>
            </div>
            <button onClick={() => toggleWishlist(p.id)} className="p-3 rounded-full transition-transform hover:scale-110" style={{ background: dark ? "rgba(255,255,255,0.08)" : C.base }}>
              <Heart size={18} color={isWished ? C.coral : (dark ? "#fff" : C.ink)} fill={isWished ? C.coral : "none"} />
            </button>
            <button onClick={() => toggleBookmark(p.id)} className="p-3 rounded-full transition-transform hover:scale-110" style={{ background: dark ? "rgba(255,255,255,0.08)" : C.base }}>
              <Bookmark size={18} color={isBooked ? C.plum : (dark ? "#fff" : C.ink)} fill={isBooked ? C.plum : "none"} />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-5">
            <button onClick={() => addToCart(p, qty)} disabled={!p.inStock} className="flex-1 py-3.5 rounded-full font-semibold text-sm text-white flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-40" style={{ background: grad, fontFamily: "Manrope" }}>
              <ShoppingBag size={16} /> Add to Cart
            </button>
            <a href={`https://wa.me/919999999999?text=${waMessage}`} target="_blank" rel="noreferrer" className="flex-1 py-3.5 rounded-full font-semibold text-sm text-white flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-95" style={{ background: "#25D366", fontFamily: "Manrope" }}>
              <MessageCircle size={16} /> Buy on WhatsApp
            </a>
          </div>

          <div className="flex gap-5 mt-6 text-xs opacity-60" style={{ color: dark ? "#fff" : C.ink, fontFamily: "Manrope" }}>
            <span className="flex items-center gap-1.5"><ShieldCheck size={14} /> Tarnish resistant</span>
            <span className="flex items-center gap-1.5"><RotateCcw size={14} /> 7-day returns</span>
          </div>

          {/* tabs */}
          <div className="mt-8 border-t pt-5" style={{ borderColor: dark ? "rgba(255,255,255,0.1)" : "rgba(36,23,38,0.1)" }}>
            <div className="flex gap-5 mb-4">
              {[["desc", "Description"], ["reviews", `Reviews (${p.reviews})`]].map(([id, label]) => (
                <button key={id} onClick={() => setTab(id)} className="text-sm font-semibold pb-1" style={{ color: dark ? "#fff" : C.ink, opacity: tab === id ? 1 : 0.5, borderBottom: tab === id ? `2px solid ${C.fuchsia}` : "none" }}>
                  {label}
                </button>
              ))}
            </div>
            {tab === "desc" ? (
              <p className="text-sm opacity-70 leading-relaxed" style={{ color: dark ? "#fff" : C.ink, fontFamily: "Manrope" }}>
                Handcrafted in {p.material.toLowerCase()}, the {p.name} is built for daily wear — water-resistant plating, hypoallergenic posts, and a finish that holds its shine. Pairs beautifully layered with the rest of the Layered Light collection.
              </p>
            ) : (
              <div className="space-y-4">
                {[["Meera K.", 5, "Exactly like the photos, feels sturdy."], ["Sana R.", 4, "Lovely piece, slightly smaller than I imagined."]].map(([n, r, t], i) => (
                  <div key={i} className="text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold" style={{ color: dark ? "#fff" : C.ink }}>{n}</span>
                      <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, s) => <Star key={s} size={11} color={C.gold} fill={s < r ? C.gold : "none"} />)}</div>
                    </div>
                    <p className="opacity-70" style={{ color: dark ? "#fff" : C.ink, fontFamily: "Manrope" }}>{t}</p>
                  </div>
                ))}
                <p className="text-xs opacity-40" style={{ color: dark ? "#fff" : C.ink }}>Only admin-approved reviews are shown publicly.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-5" style={{ fontFamily: "Fraunces", color: dark ? "#fff" : C.ink }}>You may also like</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {related.map((rp, i) => (
            <ProductCard key={rp.id} p={rp} onOpen={onOpen} wishlist={wishlist} toggleWishlist={toggleWishlist} bookmarks={bookmarks} toggleBookmark={toggleBookmark} dark={dark} floatDelay={i * 0.25} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- CART ---------------- */

function Cart({ dark, cart, updateQty, removeFromCart, setView }) {
  const subtotal = cart.reduce((s, c) => s + c.sale * c.qty, 0);
  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 79;
  const tax = Math.round(subtotal * 0.03);
  const total = subtotal + shipping + tax;

  const waMessage = encodeURIComponent(
    `New order from Glow by BVY website:\n\n${cart.map((c) => `• ${c.name} (${c.id}) x${c.qty} — ₹${c.sale * c.qty}`).join("\n")}\n\nSubtotal: ₹${subtotal}\nShipping: ₹${shipping}\nTax: ₹${tax}\nGrand Total: ₹${total}\n\nPlease confirm my order.`
  );

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <ShoppingBag size={40} className="mx-auto mb-4 opacity-30" color={dark ? "#fff" : C.ink} />
        <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: "Fraunces", color: dark ? "#fff" : C.ink }}>Your bag is empty</h2>
        <p className="text-sm opacity-60 mb-5" style={{ color: dark ? "#fff" : C.ink, fontFamily: "Manrope" }}>Add a piece you'll actually reach for daily.</p>
        <button onClick={() => setView("shop")} className="px-6 py-3 rounded-full font-semibold text-sm text-white" style={{ background: grad }}>Start shopping</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-16">
      <h1 className="text-3xl font-semibold mb-6" style={{ fontFamily: "Fraunces", color: dark ? "#fff" : C.ink }}>Your bag</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-3">
          {cart.map((c) => (
            <div key={c.id} className="flex gap-4 p-3 rounded-2xl" style={{ background: dark ? "rgba(255,255,255,0.05)" : "#fff" }}>
              <div className="w-20 h-20 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: c.bg }}>
                <Gem size={22} color="#fff" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm" style={{ color: dark ? "#fff" : C.ink, fontFamily: "Manrope" }}>{c.name}</h3>
                <p className="text-xs opacity-50 mb-2" style={{ color: dark ? "#fff" : C.ink }}>{c.material}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-full overflow-hidden" style={{ background: dark ? "rgba(255,255,255,0.08)" : C.base }}>
                    <button onClick={() => updateQty(c.id, -1)} className="p-2"><Minus size={12} color={dark ? "#fff" : C.ink} /></button>
                    <span className="px-2 text-sm font-semibold" style={{ color: dark ? "#fff" : C.ink }}>{c.qty}</span>
                    <button onClick={() => updateQty(c.id, 1)} className="p-2"><Plus size={12} color={dark ? "#fff" : C.ink} /></button>
                  </div>
                  <span className="font-bold text-sm" style={{ color: dark ? "#fff" : C.ink }}>₹{c.sale * c.qty}</span>
                </div>
              </div>
              <button onClick={() => removeFromCart(c.id)} className="self-start p-1.5 opacity-50 hover:opacity-100 transition-opacity"><Trash2 size={16} color={dark ? "#fff" : C.ink} /></button>
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-5 h-fit" style={{ background: dark ? "rgba(255,255,255,0.05)" : "#fff" }}>
          <h3 className="font-semibold mb-4" style={{ color: dark ? "#fff" : C.ink, fontFamily: "Manrope" }}>Order summary</h3>
          <div className="flex gap-2 mb-4">
            <input placeholder="Coupon code" className="flex-1 px-3 py-2 rounded-full text-sm outline-none" style={{ background: dark ? "rgba(255,255,255,0.08)" : C.base, color: dark ? "#fff" : C.ink }} />
            <button className="px-4 py-2 rounded-full text-sm font-semibold" style={{ background: C.ink, color: "#fff" }}>Apply</button>
          </div>
          <div className="space-y-2 text-sm" style={{ color: dark ? "#fff" : C.ink, fontFamily: "Manrope" }}>
            <div className="flex justify-between opacity-70"><span>Subtotal</span><span>₹{subtotal}</span></div>
            <div className="flex justify-between opacity-70"><span>Shipping</span><span>{shipping === 0 ? "Free" : `₹${shipping}`}</span></div>
            <div className="flex justify-between opacity-70"><span>Tax</span><span>₹{tax}</span></div>
            <div className="flex justify-between font-bold text-base pt-2 border-t" style={{ borderColor: dark ? "rgba(255,255,255,0.1)" : "rgba(36,23,38,0.1)" }}><span>Grand total</span><span>₹{total}</span></div>
          </div>
          <a href={`https://wa.me/919999999999?text=${waMessage}`} target="_blank" rel="noreferrer" className="mt-5 w-full py-3.5 rounded-full font-semibold text-sm text-white flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]" style={{ background: "#25D366" }}>
            <MessageCircle size={16} /> Checkout via WhatsApp
          </a>
          <button className="mt-2 w-full py-3.5 rounded-full font-semibold text-sm transition-transform hover:scale-[1.02]" style={{ background: dark ? "rgba(255,255,255,0.08)" : C.base, color: dark ? "#fff" : C.ink }}>
            Cash on Delivery
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- WISHLIST ---------------- */

function Wishlist({ dark, wishlist, toggleWishlist, bookmarks, toggleBookmark, onOpen, setView }) {
  const items = PRODUCTS.filter((p) => wishlist.has(p.id));
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-16">
      <h1 className="text-3xl font-semibold mb-1" style={{ fontFamily: "Fraunces", color: dark ? "#fff" : C.ink }}>Your wishlist</h1>
      <p className="text-sm opacity-60 mb-6" style={{ color: dark ? "#fff" : C.ink, fontFamily: "Manrope" }}>{items.length} saved pieces</p>
      {items.length === 0 ? (
        <div className="text-center py-16">
          <Heart size={40} className="mx-auto mb-4 opacity-30" color={dark ? "#fff" : C.ink} />
          <p className="opacity-60 mb-5" style={{ color: dark ? "#fff" : C.ink, fontFamily: "Manrope" }}>Nothing here yet — tap the heart on anything you love.</p>
          <button onClick={() => setView("shop")} className="px-6 py-3 rounded-full font-semibold text-sm text-white" style={{ background: grad }}>Browse shop</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {items.map((p, i) => <ProductCard key={p.id} p={p} onOpen={onOpen} wishlist={wishlist} toggleWishlist={toggleWishlist} bookmarks={bookmarks} toggleBookmark={toggleBookmark} dark={dark} floatDelay={i * 0.25} />)}
        </div>
      )}
    </div>
  );
}

/* ---------------- APP ---------------- */

export default function App() {
  const [dark, setDark] = useState(false);
  const [view, setView] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeProduct, setActiveProduct] = useState(null);
  const [wishlist, setWishlist] = useState(new Set());
  const [bookmarks, setBookmarks] = useState(new Set());
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(null), 1800); };

  const toggleWishlist = (id) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : (next.add(id), flash("Saved to wishlist"));
      return next;
    });
  };
  const toggleBookmark = (id) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : (next.add(id), flash("Bookmarked"));
      return next;
    });
  };
  const addToCart = (p, qty) => {
    setCart((prev) => {
      const exists = prev.find((c) => c.id === p.id);
      if (exists) return prev.map((c) => (c.id === p.id ? { ...c, qty: c.qty + qty } : c));
      return [...prev, { ...p, qty }];
    });
    flash("Added to bag");
  };
  const updateQty = (id, delta) => setCart((prev) => prev.map((c) => (c.id === id ? { ...c, qty: Math.max(1, c.qty + delta) } : c)));
  const removeFromCart = (id) => setCart((prev) => prev.filter((c) => c.id !== id));

  const openProduct = (p) => { setActiveProduct(p); setView("product"); window.scrollTo?.(0, 0); };

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const shared = { dark, onOpen: openProduct, wishlist, toggleWishlist, bookmarks, toggleBookmark };

  return (
    <div style={{ background: dark ? C.baseDark : C.base, minHeight: "100%", fontFamily: "Manrope, sans-serif" }} className="relative">
      <style>{`
        ${FONT_IMPORT}
        * { box-sizing: border-box; }
        @keyframes float { 0%,100% { transform: translateY(0) rotate(var(--r,0deg)); } 50% { transform: translateY(-14px) rotate(var(--r,0deg)); } }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }
        input[type=range] { height: 4px; border-radius: 4px; background: ${dark ? "rgba(255,255,255,0.15)" : "rgba(36,23,38,0.12)"}; }
      `}</style>

      <NavBar view={view} setView={setView} dark={dark} setDark={setDark} cartCount={cartCount} wishCount={wishlist.size} menuOpen={menuOpen} setMenuOpen={setMenuOpen} query={query} setQuery={(q) => { setQuery(q); if (view !== "shop") setView("shop"); }} />

      {view === "home" && <Home {...shared} setView={setView} />}
      {view === "shop" && <Shop {...shared} query={query} />}
      {view === "product" && activeProduct && <ProductDetail p={activeProduct} addToCart={addToCart} {...shared} />}
      {view === "cart" && <Cart dark={dark} cart={cart} updateQty={updateQty} removeFromCart={removeFromCart} setView={setView} />}
      {view === "wishlist" && <Wishlist {...shared} setView={setView} />}

      <Footer dark={dark} />

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-full text-sm font-semibold text-white z-50 shadow-xl" style={{ background: C.ink, fontFamily: "Manrope" }}>
          {toast}
        </div>
      )}
    </div>
  );
}
