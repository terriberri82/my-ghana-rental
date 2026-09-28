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
const statusStyles = {
  paid: "bg-green-100 text-green-800",
  due: "bg-amber-100 text-amber-800",
  overdue: "bg-red-100 text-brick",
};

const sampleTenants = [
  { name: "Kwame A. · Unit 2B", detail: "GH₵ 1,200 · MTN MoMo", status: "Paid", type: "paid" },
  { name: "Esi M. · Unit 1A", detail: "GH₵ 950 · Bank transfer", status: "Paid", type: "paid" },
  { name: "Yaw O. · Unit 3C", detail: "GH₵ 1,100 · due Oct 1", status: "Due in 3 days", type: "due" },
  { name: "Ama K. · Unit 2A", detail: "GH₵ 1,000 · Telecel Cash", status: "Overdue", type: "overdue" },
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
      className="relative h-[560px] md:h-[clamp(480px,calc(100vh-190px),600px)]"
      aria-hidden="true"
    >
      {/* Gold ring behind the arches */}
      <div className="absolute left-[22%] top-[4%] w-[74%] aspect-square rounded-full border-2 border-sun" />

      {/* Two stepped arches, each with its own slideshow */}
      <ArchSlideshow
        images={leftArchImages}
        className="left-[26%] top-0 w-[37%] h-[70%]"
      />
      <ArchSlideshow
        images={rightArchImages}
        startDelay={3000}
        className="left-[65%] top-[20%] w-[35%] h-[66%]"
      />

      {/* Tenant list card */}
      <div className="absolute left-0 bottom-0 w-[88%] sm:w-[360px] bg-white rounded-2xl p-4 shadow-[0_24px_60px_rgba(44,87,97,0.18)]">
        <div className="flex items-baseline justify-between">
          <p className="font-display font-semibold text-bayou">September rent</p>
          <p className="text-xs text-ebony/60">East Legon · 4 units</p>
        </div>
        <div className="mt-3 h-2 rounded-full bg-pearl/60 overflow-hidden">
          <div className="h-full w-1/2 bg-bayou" />
        </div>
        <ul className="mt-1">
          {sampleTenants.map((t) => (
            <li
              key={t.name}
              className="flex items-center justify-between py-2 border-t border-pearl/60 first:border-t-0"
            >
              <div>
                <p className="text-sm font-semibold text-bayou">{t.name}</p>
                <p className="text-xs text-ebony/60">{t.detail}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[t.type]}`}>
                {t.status}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Lease reminder card (hidden on small phones to avoid clutter) */}
      <div className="hidden sm:flex absolute right-0 top-[6%] items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-[0_16px_36px_rgba(44,87,97,0.15)]">
        <span className="w-9 h-9 rounded-full bg-sun flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#2c5761" strokeWidth="2">
            <rect x="2.5" y="3.5" width="13" height="12" rx="2" />
            <path d="M2.5 7.5h13M6 2v3M12 2v3" />
          </svg>
        </span>
        <div>
          <p className="text-sm font-semibold text-bayou">Lease ends in 30 days</p>
          <p className="text-xs text-ebony/60">Yaw O. · Unit 3C · Renew or list</p>
        </div>
      </div>
    </div>
  );
}