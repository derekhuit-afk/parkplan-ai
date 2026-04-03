import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ParkPlan.ai — AI-Powered Theme Park Trip Planner",
  description: "Where magic meets intelligence. AI-built itineraries, live wait times, budget breakdowns, and hotel picks for every Disney resort and Universal park — free forever.",
  keywords: "Disney trip planner, AI itinerary, Walt Disney World, Disneyland, theme park wait times, park budget planner",
  openGraph: {
    title: "ParkPlan.ai — Where Magic Meets Intelligence",
    description: "AI-powered theme park planning for families and superfans. Free forever.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
