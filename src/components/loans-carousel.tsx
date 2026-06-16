"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { useState } from "react";

const slides = [
  {
    title: "Core Loans",
    badge: "Effortless investing",
    subtitle: "Start fast with a ready-to-use portfolio.",
    features: [
      "Minimal setup",
      "Automated diversification",
      "Cash out anytime",
    ],
    stat: "9.4%",
    statLabel: "APY",
  },
  {
    title: "Custom Loans",
    badge: "Advanced automation",
    subtitle: "Build your own automated portfolio.",
    features: [
      "Personalized automation",
      "Custom diversification",
      "Liquidity via the Secondary Market",
    ],
    stat: "140k+",
    statLabel: "Portfolios created",
  },
  {
    title: "Manual Loans",
    badge: "Full control",
    subtitle: "Hand-pick your individual investments",
    features: [
      "Large selection of investments",
      "Filter by 10+ investment criteria",
      "Liquidity via the Secondary Market",
    ],
    stat: "16k+",
    statLabel: "Investment opportunities",
  },
];

const variants = {
  enter: (d: number) => ({ x: d > 0 ? 72 : -72, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d > 0 ? -72 : 72, opacity: 0 }),
};

export function LoansCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = (dir: number) => {
    setDirection(dir);
    setCurrent((c) => (c + dir + slides.length) % slides.length);
  };

  const jumpTo = (i: number) => {
    setDirection(i > current ? 1 : -1);
    setCurrent(i);
  };

  const slide = slides[current];

  return (
    <div>
      <div className="overflow-hidden rounded-3xl">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
            className="bg-[#f2f2f0] rounded-3xl p-9"
          >
            <div className="flex items-start justify-between mb-2">
              <p className="font-bold text-[#111827] text-xl">{slide.title}</p>
              <span className="bg-[#35de8d] text-[#111827] text-xs font-semibold px-3 py-1 rounded-full shrink-0">
                {slide.badge}
              </span>
            </div>
            <p className="text-[#6b7280] text-sm mb-7">{slide.subtitle}</p>
            <ul className="space-y-3.5 mb-9">
              {slide.features.map((f) => (
                <li key={f} className="flex items-center gap-2.5">
                  <Check
                    size={14}
                    className="text-[#203828] shrink-0"
                    strokeWidth={3}
                  />
                  <span className="text-[#203828] text-[13px] font-semibold">
                    {f}
                  </span>
                </li>
              ))}
            </ul>
            <div>
              <p className="text-[2rem] font-bold text-[#111827] leading-none mb-1">
                {slide.stat}
              </p>
              <p className="text-[#6b7280] text-sm flex items-center gap-1">
                {slide.statLabel}
                <Info size={13} className="text-[#9ca3af]" />
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4 mt-6 w-full ">
        <button
          type="button"
          onClick={() => go(-1)}
          className="w-9 h-9 rounded-full bg-[#f0f0ef] flex items-center justify-center hover:bg-[#e5e5e3] transition-colors"
        >
          <ChevronLeft size={15} className="text-[#111827]" />
        </button>
        <div className="flex gap-2 items-center">
          {slides.map((_, i) => (
            <button
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={i}
              type="button"
              onClick={() => jumpTo(i)}
              className={`rounded-full transition-all ${
                i === current ? "w-2 h-2 bg-[#111827]" : "w-2 h-2 bg-[#d1d5db]"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          className="w-9 h-9 rounded-full bg-[#f0f0ef] flex items-center justify-center hover:bg-[#e5e5e3] transition-colors"
        >
          <ChevronRight size={15} className="text-[#111827]" />
        </button>
      </div>
    </div>
  );
}
