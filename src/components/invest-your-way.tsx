"use client";

import { AnimatePresence, motion } from "motion/react";
import { RefreshCcw } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const tabs = [
  {
    id: "complement",
    title: "Complement your portfolio",
    body: "You've invested before and want to go further. Solbridge helps you diversify into a broad selection of assets and earn steady returns.",
    photo: "/1.jpg",
  },
  {
    id: "diy",
    title: "DIY investments",
    body: "You want to take full control of your investments. Solbridge shows you what's under the hood so you can create your own automation or hand-pick each investment yourself.",
    photo: "/2.jpg",
  },
  {
    id: "hassle",
    title: "Invest without hassle",
    body: "You want to get started without spending a lot of time and energy. Solbridge gets you off the ground in minutes with ready-made portfolios.",
    photo: "/0.jpg",
  },
];

function BondListCard() {
  const bonds = [
    {
      type: "Senior Secured Bond",
      name: "ACL Holdings Feb 2027",
      bg: "#7b2d8b",
      initial: "A",
    },
    {
      type: "Secured Bond",
      name: "IPF Dec 2029",
      bg: "#e84c3d",
      initial: "IPF",
    },
    {
      type: "Senior Secured Bond",
      name: "Azerion Group Oct 2029",
      bg: "#1b3f8b",
      initial: "A",
    },
    { type: "LVX0000NNSP4", name: "Rental apartment", photo: "/4.jpg" },
    { type: "LVX0000NOWD0", name: "Rental apartment", photo: "/5.jpg" },
  ];
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {bonds.map((item, i) => (
        <div
          key={item.type + item.name}
          className={`flex items-center gap-3 px-5 py-4${i < bonds.length - 1 ? " border-b border-[#f5f5f5]" : ""}`}
        >
          <div
            className="w-9 h-9 rounded-full shrink-0 overflow-hidden flex items-center justify-center text-xs font-bold text-white"
            style={{ backgroundColor: item.photo ? undefined : item.bg }}
          >
            {item.photo ? (
              <Image
                src={item.photo}
                alt={item.name}
                width={36}
                height={36}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              item.initial
            )}
          </div>
          <div>
            <p className="text-[11px] text-[#9ca3af] leading-none mb-0.5">
              {item.type}
            </p>
            <p className="text-[13px] font-semibold text-[#111827]">
              {item.name}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

const barData = [
  { id: "b1", h: 10 },
  { id: "b2", h: 18 },
  { id: "b3", h: 28 },
  { id: "b4", h: 40 },
  { id: "b5", h: 52 },
  { id: "b6", h: 58 },
  { id: "b7", h: 60 },
  { id: "b8", h: 54 },
  { id: "b9", h: 44 },
  { id: "b10", h: 32 },
  { id: "b11", h: 20 },
  { id: "b12", h: 12 },
];
const BAR_W = 14;
const BAR_GAP = 3;
const MAX_H = 62;
const TOTAL_W = barData.length * (BAR_W + BAR_GAP) - BAR_GAP;

function RiskScoreCard() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <p className="font-semibold text-[#111827] mb-5">Risk Score</p>
      <div className="flex items-center gap-2 mb-3">
        <span className="bg-[#fde8e8] text-[#e05555] text-sm font-bold px-2.5 py-1 rounded">
          1.0
        </span>
        <span className="text-[#6b7280] text-sm flex-1">Min</span>
        <span className="text-[#6b7280] text-sm">Max</span>
        <span className="bg-[#d1fae5] text-[#059669] text-sm font-bold px-2.5 py-1 rounded">
          10.0
        </span>
      </div>
      <div className="relative h-4 flex items-center mb-1">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#203828] rounded-full" />
        <div className="absolute left-0 w-3 h-3 rounded-full border-2 border-[#203828] bg-white" />
        <div className="absolute right-0 w-3 h-3 rounded-full border-2 border-[#203828] bg-white" />
      </div>
      <div className="flex justify-between text-[11px] text-[#9ca3af] mb-6">
        <span>Higher risk</span>
        <span>Lower risk</span>
      </div>
      <p className="font-semibold text-[#111827] mb-3">Interest rate</p>
      <svg
        viewBox={`0 0 ${TOTAL_W} ${MAX_H}`}
        className="w-full h-14 mb-3"
        aria-hidden="true"
      >
        {barData.map(({ id, h }, i) => (
          <rect
            key={id}
            x={i * (BAR_W + BAR_GAP)}
            y={MAX_H - h}
            width={BAR_W}
            height={h}
            fill="#203828"
            rx="3"
          />
        ))}
      </svg>
      <div className="relative h-4 flex items-center mb-2">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#e5e7eb] rounded-full" />
        <div className="absolute left-[12%] w-3 h-3 rounded-full border-2 border-[#203828] bg-white" />
        <div className="absolute right-[12%] w-3 h-3 rounded-full border-2 border-[#203828] bg-white" />
      </div>
      <div className="flex justify-between items-center text-[13px] text-[#6b7280] mt-1">
        <span>
          5 <span className="text-[#9ca3af] text-[11px]">%</span>
        </span>
        <span className="text-[#9ca3af]">—</span>
        <span>
          15 <span className="text-[#9ca3af] text-[11px]">%</span>
        </span>
      </div>
    </div>
  );
}

function GoalCard() {
  const r = 50;
  const circ = 2 * Math.PI * r;
  const dash = 0.28 * circ;
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <p className="text-[#9ca3af] text-sm mb-1">Goal</p>
      <p className="text-[2rem] font-bold text-[#111827] mb-5">€ 10 000</p>
      <div className="relative flex justify-center mb-5">
        <svg viewBox="0 0 120 120" className="w-44 h-44" aria-hidden="true">
          <circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke="#f0f0f0"
            strokeWidth="10"
          />
          <circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke="#203828"
            strokeWidth="10"
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="font-bold text-[#111827] text-lg leading-tight">
            € 2 842,74
          </p>
          <p className="text-[#9ca3af] text-sm">28% Reached</p>
        </div>
      </div>
      <div className="bg-[#f0fdf4] rounded-xl px-4 py-3 flex items-center gap-3">
        <RefreshCcw size={15} className="text-[#203828] shrink-0" />
        <p className="text-[#203828] text-sm leading-snug">
          Funds are automatically allocated to this portfolio.
        </p>
      </div>
    </div>
  );
}

const CARDS = [BondListCard, RiskScoreCard, GoalCard];

export function InvestYourWay() {
  const [active, setActive] = useState(0);
  const Card = CARDS[active];

  return (
    <section className="py-24 px-[7%] bg-[#203828]">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-[3rem] font-bold text-white leading-[1.1] mb-4">
            Invest your way
          </h2>
          <p className="text-white/60 text-[15px] max-w-[560px] mx-auto leading-relaxed">
            Whether you&apos;re experienced or just getting started, we make it
            easy to build a portfolio that works for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[5fr_7fr] gap-8 md:gap-16 items-start">
          {/* Left — accordion tabs */}
          <div>
            {tabs.map((tab, i) => {
              const isActive = i === active;
              return (
                // biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
                // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                <div
                  key={tab.id}
                  className={`border-l-2 pl-7 py-6 cursor-pointer transition-all duration-200 ${
                    isActive
                      ? "border-white"
                      : "border-white/20 hover:border-white/40"
                  }`}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => setActive(i)}
                >
                  <h3
                    className={`font-bold text-[1.1rem] mb-2 transition-colors duration-200 ${
                      isActive ? "text-white" : "text-white/40"
                    }`}
                  >
                    {tab.title}
                  </h3>
                  <p
                    className={`text-[14px] leading-relaxed transition-colors duration-200 ${
                      isActive ? "text-white/70" : "text-white/30"
                    }`}
                  >
                    {tab.body}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right — animated card + photo */}
          <div className="relative h-auto md:h-125">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.24, ease: [0.25, 0.1, 0.25, 1] }}
                className="relative md:absolute md:top-0 md:left-0 w-full md:w-[72%] z-10"
              >
                <Card />
              </motion.div>
            </AnimatePresence>
            <div className="hidden md:block">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`photo-${active}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-0 right-0 w-[54%] h-75 rounded-3xl overflow-hidden z-0"
                >
                  <Image
                    src={tabs[active].photo}
                    alt="Investor"
                    width={320}
                    height={300}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
