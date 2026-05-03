import React from "react";
import libertySrc from "@assets/statue-liberty_1055740-206_1777798510048.avif";
import eagleSrc from "@assets/american-eagle-flag-wings-patriotic-symbol-vector_1777798505708.jpg";
import capitolSrc from "@assets/istockphoto-1324470339-612x612_1777798514504.jpg";
import flagSrc from "@assets/striped-american-flag-with-stars-stripes-design-white-backgro_1777798489446.avif";
import libertyRoundSrc from "@assets/Screenshot_2026-05-03_at_12.28.08_AM_1777798612292.png";
import sealSrc from "@assets/Screenshot_2026-05-03_at_12.30.31_AM_1777798612297.png";
import medalSrc from "@assets/Screenshot_2026-05-03_at_12.35.21_AM_1777798612299.png";
import shieldSrc from "@assets/Screenshot_2026-05-03_at_12.35.26_AM_1777798612305.png";

export function StatueOfLiberty({ className = "", opacity = 0.18 }: { className?: string; opacity?: number }) {
  return <img src={libertySrc} alt="Statue of Liberty" className={className} style={{ opacity, objectFit: "contain" }} />;
}

export function BaldEagle({ className = "", opacity = 0.18 }: { className?: string; opacity?: number }) {
  return <img src={eagleSrc} alt="American eagle" className={className} style={{ opacity, objectFit: "contain" }} />;
}

export function CapitolBuilding({ className = "", opacity = 0.18 }: { className?: string; opacity?: number }) {
  return <img src={capitolSrc} alt="U.S. Capitol" className={className} style={{ opacity, objectFit: "contain" }} />;
}

export function WavingFlag({ className = "", opacity = 0.18 }: { className?: string; opacity?: number }) {
  return <img src={flagSrc} alt="American flag" className={className} style={{ opacity, objectFit: "contain" }} />;
}

export function WashingtonMonument({ className = "", opacity = 0.12 }: { className?: string; opacity?: number }) {
  return <img src={medalSrc} alt="Patriotic emblem" className={className} style={{ opacity, objectFit: "contain" }} />;
}

export function CongressSeal({ className = "", opacity = 0.12 }: { className?: string; opacity?: number }) {
  return <img src={sealSrc} alt="Congress seal" className={className} style={{ opacity, objectFit: "contain" }} />;
}

export function StarSpangleBanner({ className = "", opacity = 0.12 }: { className?: string; opacity?: number }) {
  return <img src={shieldSrc} alt="Patriotic shield" className={className} style={{ opacity, objectFit: "contain" }} />;
}

export function LincolnMemorial({ className = "", opacity = 0.12 }: { className?: string; opacity?: number }) {
  return <img src={libertyRoundSrc} alt="Patriotic emblem" className={className} style={{ opacity, objectFit: "contain" }} />;
}
