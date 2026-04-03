"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Sparkles } from "lucide-react";

const STARS = Array.from({ length: 6 }, (_, i) => ({
  top: `${[20,70,40,80,30,60][i]}%`,
  left: `${[10,85,50,25,70,40][i]}%`,
  delay: `${i * 0.4}s`,
  size: [2,3,2,3,2,2][i],
}));

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled
          ? "rgba(0,25,75,0.95)"
          : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,215,0,0.15)" : "none",
        boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.4)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* Castle icon */}
            <div className="relative w-9 h-9 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full animate-pulse-gold"
                style={{ background: "radial-gradient(circle, rgba(255,215,0,0.15) 0%, transparent 70%)" }} />
              <span className="text-xl relative z-10" style={{ filter: "drop-shadow(0 0 8px rgba(255,215,0,0.8))" }}>🏰</span>
            </div>
            <div className="leading-none">
              <div className="font-display text-lg font-700 tracking-wide"
                style={{ color: "#FFD700", textShadow: "0 0 20px rgba(255,215,0,0.5)" }}>
                ParkPlan
              </div>
              <div className="font-script text-xs" style={{ color: "rgba(200,216,240,0.8)" }}>
                Where Magic Meets Intelligence
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: "Resorts", href: "#resorts" },
              { label: "Features", href: "#features" },
              { label: "Dashboard", href: "/dashboard" },
              { label: "My Trips", href: "/trips" },
            ].map((item) => (
              <a key={item.label} href={item.href}
                className="font-body text-sm font-500 transition-all duration-200 hover:scale-105 relative group"
                style={{ color: "rgba(200,216,240,0.85)" }}>
                {item.label}
                <span className="absolute -bottom-1 left-0 right-0 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                  style={{ background: "linear-gradient(90deg, transparent, #FFD700, transparent)" }} />
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/plan"
              className="btn-magic flex items-center gap-2 px-5 py-2.5 text-sm font-body font-700"
              style={{ fontFamily: "var(--font-nunito)" }}>
              <Sparkles size={14} className="text-park-night" />
              <span style={{ color: "#00194B" }}>Plan My Trip</span>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 rounded-xl transition-colors hover:bg-white/5"
            style={{ color: "#C8D8F0" }}
            onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t px-4 py-5 flex flex-col gap-4"
          style={{ background: "rgba(0,25,75,0.98)", borderColor: "rgba(255,215,0,0.15)" }}>
          {[
            { label: "Resorts",   href: "#resorts" },
            { label: "Features",  href: "#features" },
            { label: "Dashboard", href: "/dashboard" },
            { label: "My Trips",  href: "/trips" },
          ].map((item) => (
            <a key={item.label} href={item.href}
              onClick={() => setMenuOpen(false)}
              className="font-body text-base font-500 py-1 transition-colors"
              style={{ color: "rgba(200,216,240,0.9)" }}>
              {item.label}
            </a>
          ))}
          <Link href="/plan" onClick={() => setMenuOpen(false)}
            className="btn-magic flex items-center justify-center gap-2 py-3 mt-2 font-body font-700">
            <Sparkles size={15} />
            <span style={{ color: "#00194B" }}>Plan My Trip Free</span>
          </Link>
        </div>
      )}
    </nav>
  );
}
