"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(0,25,75,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(18px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,215,0,0.12)" : "none",
      }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo — minimal */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="text-2xl" style={{ filter: "drop-shadow(0 0 6px rgba(255,215,0,0.5))" }}>🏰</span>
            <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "1.15rem", fontWeight: 700, color: "#FFD700", letterSpacing: "0.04em" }}>
              ParkPlan<span style={{ color: "rgba(220,235,255,0.65)", fontWeight: 400 }}>.ai</span>
            </span>
          </Link>

          {/* Desktop links — very few, very clean */}
          <div className="hidden md:flex items-center gap-7">
            {[
              { label: "Resorts",   href: "#resorts" },
              { label: "Dashboard", href: "/dashboard" },
              { label: "My Trips",  href: "/trips" },
            ].map(({ label, href }) => (
              <a key={label} href={href}
                className="font-body text-sm font-500 transition-colors duration-200 hover:opacity-100"
                style={{ color: "rgba(220,235,255,0.85)", fontFamily: "var(--font-nunito)" }}>
                {label}
              </a>
            ))}
          </div>

          {/* Single CTA */}
          <div className="hidden md:block">
            <Link href="/plan" className="btn-primary px-6 py-2.5 text-sm font-800">
              ✨ Start Planning
            </Link>
          </div>

          <button className="md:hidden p-2 rounded-lg" style={{ color: "#C8D8F0" }}
            onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t px-5 py-6 flex flex-col gap-5"
          style={{ background: "rgba(0,25,75,0.98)", borderColor: "rgba(255,215,0,0.12)" }}>
          {[
            { label: "Resorts",   href: "#resorts" },
            { label: "Dashboard", href: "/dashboard" },
            { label: "My Trips",  href: "/trips" },
          ].map(({ label, href }) => (
            <a key={label} href={href} onClick={() => setOpen(false)}
              className="text-base font-500" style={{ color: "rgba(220,235,255,0.92)", fontFamily: "var(--font-nunito)" }}>
              {label}
            </a>
          ))}
          <Link href="/plan" onClick={() => setOpen(false)}
            className="btn-primary py-3.5 text-base font-800 mt-1">
            ✨ Start Planning Free
          </Link>
        </div>
      )}
    </nav>
  );
}
