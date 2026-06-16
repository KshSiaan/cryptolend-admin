"use client";

import { AnimatePresence, motion } from "motion/react";
import { Briefcase, Building2, Layers, Wifi } from "lucide-react";
import Image from "next/image";
import { type ElementType, useEffect, useState } from "react";

// ── Donut geometry ──────────────────────────────────────────────────────────
const CX = 120;
const CY = 120;
const OR = 86; // outer radius
const IR = 58; // inner radius (hole)
const GAP = 5; // degrees gap between segments

function toRad(deg: number) {
  return ((deg - 90) * Math.PI) / 180;
}
function pt(r: number, deg: number): [number, number] {
  return [CX + r * Math.cos(toRad(deg)), CY + r * Math.sin(toRad(deg))];
}
function arcPath(s: number, e: number): string {
  const large = e - s > 180 ? 1 : 0;
  const [x1, y1] = pt(OR, s);
  const [x2, y2] = pt(OR, e);
  const [x3, y3] = pt(IR, e);
  const [x4, y4] = pt(IR, s);
  return `M${x1.toFixed(2)},${y1.toFixed(2)} A${OR},${OR},0,${large},1,${x2.toFixed(2)},${y2.toFixed(2)} L${x3.toFixed(2)},${y3.toFixed(2)} A${IR},${IR},0,${large},0,${x4.toFixed(2)},${y4.toFixed(2)} Z`;
}

// ── Segment definitions ─────────────────────────────────────────────────────
const SEG_DEFS = [
  { id: "loans", pct: 0.25 },
  { id: "realestate", pct: 0.28 },
  { id: "bonds", pct: 0.12 },
  { id: "etfs", pct: 0.2 },
  { id: "smartcash", pct: 0.08 },
  { id: "crypto", pct: 0.07 },
];

const AVAIL = 360 - SEG_DEFS.length * GAP; // 330°

const SEGMENTS = (() => {
  let cursor = 0;
  return SEG_DEFS.map(({ id, pct }) => {
    const span = pct * AVAIL;
    const seg = { id, path: arcPath(cursor, cursor + span) };
    cursor += span + GAP;
    return seg;
  });
})();

// Inactive fill per segment — subtle shade variation
const INACTIVE: Record<string, string> = {
  loans: "#2a4d39",
  realestate: "#1f3a2c",
  bonds: "#27483600",
  etfs: "#1e3228",
  smartcash: "#234030",
  crypto: "#203a2c",
};

// Fix bonds to have a valid color
INACTIVE.bonds = "#274836";

const ACTIVE_FILL = "#e8e2d4"; // cream / off-white

// ── Card cycle data ─────────────────────────────────────────────────────────
type CardDef = { segId: string; label: string; Icon: ElementType };

const CARDS: CardDef[] = [
  { segId: "smartcash", label: "Smart Cash", Icon: Wifi },
  { segId: "etfs", label: "ETFs", Icon: Layers },
  { segId: "loans", label: "Loans", Icon: Briefcase },
  { segId: "realestate", label: "Real estate", Icon: Building2 },
];

const BG_URL =
  "https://images.unsplash.com/photo-1507041957456-9c397ce39c97?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

// ── Component ───────────────────────────────────────────────────────────────
export function HeroCard() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % CARDS.length), 1200);
    return () => clearInterval(t);
  }, []);

  const card = CARDS[active];

  return (
    <div className="relative h-[60dvh] rounded-4xl overflow-hidden">
      {/* Bokeh background */}
      <Image
        src={BG_URL}
        alt=""
        fill
        className="object-cover blur-xs"
        unoptimized
        aria-hidden="true"
      />

      {/* Dark green card — inset so bg peeks around edges */}
      <div className="absolute inset-12 bg-[#203828] rounded-3xl flex items-center justify-center">
        <div className="relative w-[400px] h-[400px]">
          {/* Donut ring */}
          <svg
            viewBox="0 0 240 240"
            className="w-full h-full"
            aria-hidden="true"
          >
            {SEGMENTS.map((seg) => (
              <motion.path
                key={seg.id}
                d={seg.path}
                animate={{
                  fill: seg.id === card.segId ? ACTIVE_FILL : INACTIVE[seg.id],
                }}
                transition={{ duration: 0.38, ease: "easeInOut" }}
              />
            ))}
          </svg>

          {/* Center icon + label */}
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={card.segId}
                initial={{ opacity: 0, x: -48 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 48 }}
                transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex flex-col items-center gap-2"
              >
                <card.Icon size={22} className="text-white" strokeWidth={1.5} />
                <p className="text-white font-semibold text-sm tracking-tight">
                  {card.label}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
