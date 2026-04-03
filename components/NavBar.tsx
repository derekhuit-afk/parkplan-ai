"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Menu, X, Sparkles, Bookmark } from "lucide-react";

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
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(13,27,42,0.95)"
          : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(245,200,66,0.1)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin size={15} className="text-park-night" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-park-coral animate-pulse" />
            </div>
            <span className="font-display font-700 text-xl text-park-cream">
              Park<span className="text-park-gold">Plan</span>
              <span className="text-park-mist text-sm font-body font-normal ml-1">.ai</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: "Resorts", href: "#resorts" },
              { label: "Features", href: "#features" },
              { label: "How It Works", href: "#how-it-works" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-park-mist hover:text-park-gold transition-colors text-sm font-body font-medium tracking-wide"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/plan"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-body font-600 text-park-night transition-all duration-200 hover:scale-105 animate-pulse-gold"
              style={{ background: "linear-gradient(135deg, #F5C842, #E8A020)" }}
            >
              <Sparkles size={14} />
              Plan My Trip
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-park-mist hover:text-park-gold transition-colors p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t px-4 py-4 flex flex-col gap-4"
          style={{
            background: "rgba(13,27,42,0.98)",
            borderColor: "rgba(245,200,66,0.15)",
          }}
        >
          {[
            { label: "Resorts", href: "#resorts" },
            { label: "Features", href: "#features" },
            { label: "How It Works", href: "#how-it-works" },
            { label: "Dashboard", href: "/dashboard" },
            { label: "My Trips", href: "/trips" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="text-park-mist hover:text-park-gold transition-colors text-base font-body font-medium py-1"
            >
              {item.label}
            </a>
          ))}
          <Link
            href="/plan"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-body font-600 text-park-night mt-2"
            style={{ background: "linear-gradient(135deg, #F5C842, #E8A020)" }}
          >
            <Sparkles size={14} />
            Plan My Trip Free
          </Link>
        </div>
      )}
    </nav>
  );
}
