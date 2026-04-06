"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Redirects to /trips where the hash is read and trips are imported
export default function ImportPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/trips" + window.location.hash);
  }, [router]);
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#00194B" }}>
      <div className="text-center">
        <div className="text-4xl mb-3">🏰</div>
        <p style={{ fontFamily: "var(--font-cinzel)", color: "#FFD700" }}>Importing trips…</p>
      </div>
    </div>
  );
}
