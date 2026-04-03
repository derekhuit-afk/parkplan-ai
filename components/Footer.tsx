import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t py-12 px-5 sm:px-8"
      style={{ borderColor: "rgba(255,215,0,0.1)", background: "rgba(0,10,30,0.6)" }}>
      <div className="max-w-6xl mx-auto">

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🏰</span>
            <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "1rem", fontWeight: 700, color: "#FFD700" }}>
              ParkPlan.ai
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            {[
              { label: "Plan a Trip",  href: "/plan" },
              { label: "Dashboard",   href: "/dashboard" },
              { label: "My Trips",    href: "/trips" },
              { label: "Privacy",     href: "#" },
            ].map(({ label, href }) => (
              <Link key={label} href={href}
                className="font-body text-sm transition-colors hover:opacity-100"
                style={{ color: "rgba(200,216,240,0.5)", fontFamily: "var(--font-nunito)" }}>
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="gold-divider mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-body text-xs" style={{ color: "rgba(200,216,240,0.3)", fontFamily: "var(--font-nunito)" }}>
            © {new Date().getFullYear()} ParkPlan.ai · Not affiliated with Disney or Universal
          </p>
          <p className="font-body text-xs" style={{ color: "rgba(200,216,240,0.3)", fontFamily: "var(--font-nunito)" }}>
            Free forever · Built for park families ✨
          </p>
        </div>
      </div>
    </footer>
  );
}
