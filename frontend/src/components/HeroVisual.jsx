import { useEffect, useState } from "react";

const pexels = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800`;

const unsplash = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;

// Each arch cycles through its own set. Swap in new photos here anytime.
const leftArchImages = [
  unsplash("1600596542815-ffad4c1539a9"), // original exterior
  pexels(8082328),                         // villa from the front yard
  pexels(7031604),                         // villa courtyard with glass walls
];

const rightArchImages = [
  unsplash("1600607687939-ce8a6c25118c"), // original living room
  pexels(29012619),                        // bright living room, white sofas
  pexels(8089172),                         // open living room and kitchen
];

// Sample data for the landing page preview. Not real tenants.
const samplePayments = [
  { name: "Kwame A. · Unit 2B", detail: "18 Sep · MTN MoMo", amount: "GH₵ 1,200" },
  { name: "Esi M. · Unit 1A", detail: "15 Sep · Bank transfer", amount: "GH₵ 950" },
  { name: "Yaw O. · Unit 3C", detail: "9 Sep · Cash", amount: "GH₵ 1,100" },
  { name: "Ama K. · Unit 2A", detail: "3 Sep · Telecel Cash", amount: "GH₵ 1,000" },
];

function ArchSlideshow({ images, startDelay = 0, className = "" }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let timer;
    const delay = setTimeout(() => {
      setCurrent((i) => (i + 1) % images.length);
      timer = setInterval(() => {
        setCurrent((i) => (i + 1) % images.length);
      }, 6000);
    }, 6000 + startDelay);

    return () => {
      clearTimeout(delay);
      clearInterval(timer);
    };
  }, [images.length, startDelay]);

  return (
    <div className={`absolute overflow-hidden rounded-t-full rounded-b-2xl ${className}`}>
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}

export default function HeroVisual() {
  return (
    <div
      className="relative h-[520px] sm:h-[560px] lg:h-[clamp(480px,calc(100vh-190px),600px)]"
      aria-hidden="true"
    >
      {/* Gold ring: sized by width on phones and tablets, by height on desktop */}
      <div className="absolute left-[6%] top-[2%] w-[88%] aspect-square lg:left-[22%] lg:top-[4%] lg:w-auto lg:h-[92%] rounded-full border-2 border-sun" />

      {/* Two stepped arches, each with its own slideshow */}
      <ArchSlideshow
        images={leftArchImages}
        className="left-[6%] top-0 w-[46%] h-[58%] lg:left-[26%] lg:w-[37%] lg:h-[70%]"
      />
      <ArchSlideshow
        images={rightArchImages}
        startDelay={3000}
        className="left-[56%] top-[12%] w-[40%] h-[50%] lg:left-[65%] lg:top-[20%] lg:w-[35%] lg:h-[66%]"
      />

      {/* Payments card */}
      <div className="absolute left-0 bottom-0 w-full sm:w-[360px] bg-white rounded-2xl p-4 shadow-[0_24px_60px_rgba(44,87,97,0.18)] text-left">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-display text-sm md:text-base font-semibold text-bayou whitespace-nowrap">
            September payments
          </p>
          <p className="hidden sm:block text-xs text-ebony/60 whitespace-nowrap">
            East Legon · 4 units
          </p>
        </div>
        <p className="mt-1 font-display text-xl md:text-2xl font-bold text-bayou">
          GH₵ 4,250
          <span className="ml-2 text-xs font-normal text-ebony/60">recorded</span>
        </p>
        <ul className="mt-2">
          {samplePayments.map((p, i) => (
            <li
              key={p.name}
              className={`items-center justify-between py-2 border-t border-pearl/60 ${
                i === samplePayments.length - 1 ? "hidden sm:flex" : "flex"
              }`}
            >
              <div>
                <p className="text-xs md:text-sm font-semibold text-bayou">{p.name}</p>
                <p className="text-[11px] md:text-xs text-ebony/60">{p.detail}</p>
              </div>
              <span className="text-xs md:text-sm font-semibold text-bayou tabular-nums">
                {p.amount}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Vacancy card (hidden on small phones to avoid clutter) */}
      <div className="hidden sm:flex absolute right-0 top-[6%] items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-[0_16px_36px_rgba(44,87,97,0.15)] text-left">
        <span className="w-9 h-9 rounded-full bg-sun flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2c5761" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1z" />
            <path d="M9 21v-6h6v6" />
          </svg>
        </span>
        <div>
          <p className="text-sm font-semibold text-bayou">1 unit vacant</p>
          <p className="text-xs text-ebony/60">Unit 1B · Osu Flats · GH₵ 900/mo</p>
        </div>
      </div>
    </div>
  );
}