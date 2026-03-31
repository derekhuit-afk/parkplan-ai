import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ParkPlan.ai — AI-Powered Theme Park Trip Planner",
  description: "Skip the overwhelm. Get AI-built itineraries, live wait times, budget breakdowns, and hotel picks for every Disney resort and Universal park — free forever.",
  keywords: "Disney trip planner, AI itinerary, Walt Disney World, Disneyland, theme park wait times, park budget planner",
  openGraph: {
    title: "ParkPlan.ai — Plan Your Perfect Park Day",
    description: "AI-powered itineraries for every Disney resort and Universal park. Free forever.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
