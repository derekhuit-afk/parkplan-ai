import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        park: {
          // Disney midnight sky
          night:   "#00194B",
          deep:    "#0A1F5C",
          navy:    "#12296E",
          // Magical purples
          violet:  "#3D1A78",
          purple:  "#5B2D9E",
          lilac:   "#9B72D0",
          // Castle gold
          gold:    "#FFD700",
          amber:   "#FFA500",
          bronze:  "#C8860A",
          // Warm light
          cream:   "#FFF8E7",
          parchment: "#FAF0D7",
          ivory:   "#FFFDF5",
          // Accent
          coral:   "#FF6B9D",
          rose:    "#FF4785",
          mint:    "#7FDBCA",
          sky:     "#87CEEB",
          // Text
          mist:    "#C8D8F0",
          fog:     "#8AA0C8",
        },
      },
      fontFamily: {
        display: ["var(--font-cinzel)", "Georgia", "serif"],
        body:    ["var(--font-nunito)", "system-ui", "sans-serif"],
        script:  ["var(--font-dancing)", "cursive"],
      },
      backgroundImage: {
        "disney-sky":    "radial-gradient(ellipse 120% 80% at 50% 100%, #3D1A78 0%, #12296E 40%, #00194B 70%)",
        "disney-hero":   "radial-gradient(ellipse 80% 60% at 30% 60%, #3D1A78 0%, #0A1F5C 50%, #00194B 100%)",
        "gold-shimmer":  "linear-gradient(90deg, #C8860A 0%, #FFD700 30%, #FFF8C0 50%, #FFD700 70%, #C8860A 100%)",
        "magic-glow":    "radial-gradient(ellipse at 50% 50%, rgba(255,215,0,0.15) 0%, transparent 70%)",
        "castle-glow":   "radial-gradient(ellipse 60% 80% at 50% 100%, rgba(255,215,0,0.12) 0%, transparent 60%)",
        "fairy-dust":    "radial-gradient(circle at 50% 50%, rgba(155,114,208,0.2) 0%, transparent 70%)",
      },
      boxShadow: {
        "magic":    "0 0 40px rgba(255,215,0,0.2), 0 8px 32px rgba(0,0,0,0.4)",
        "castle":   "0 0 60px rgba(61,26,120,0.5), inset 0 1px 0 rgba(255,215,0,0.2)",
        "gold-glow":"0 0 20px rgba(255,215,0,0.4), 0 4px 16px rgba(0,0,0,0.3)",
        "card":     "0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
        "wand":     "0 0 30px rgba(155,114,208,0.6), 0 0 60px rgba(255,215,0,0.2)",
      },
      animation: {
        "float":        "float 6s ease-in-out infinite",
        "float-slow":   "float 9s ease-in-out infinite",
        "float-fast":   "float 4s ease-in-out infinite",
        "shimmer":      "shimmer 3s linear infinite",
        "twinkle":      "twinkle 2s ease-in-out infinite",
        "twinkle-slow": "twinkle 3.5s ease-in-out infinite",
        "sparkle":      "sparkle 1.5s ease-in-out infinite",
        "pulse-gold":   "pulse-gold 2.5s ease-in-out infinite",
        "slide-up":     "slide-up 0.7s cubic-bezier(0.16,1,0.3,1) forwards",
        "slide-up-slow":"slide-up 1s cubic-bezier(0.16,1,0.3,1) forwards",
        "fade-in":      "fade-in 0.8s ease-out forwards",
        "magic-appear": "magic-appear 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards",
        "firework":     "firework 0.8s ease-out forwards",
        "wand-sweep":   "wand-sweep 2s ease-in-out infinite",
        "castle-glow":  "castle-glow 4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-14px)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.2", transform: "scale(0.8)" },
          "50%":      { opacity: "1",   transform: "scale(1.2)" },
        },
        sparkle: {
          "0%, 100%": { opacity: "0", transform: "scale(0) rotate(0deg)" },
          "50%":      { opacity: "1", transform: "scale(1) rotate(180deg)" },
        },
        "pulse-gold": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(255,215,0,0.4)" },
          "50%":      { boxShadow: "0 0 0 16px rgba(255,215,0,0)" },
        },
        "slide-up": {
          "0%":   { opacity: "0", transform: "translateY(32px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "magic-appear": {
          "0%":   { opacity: "0", transform: "scale(0.7) translateY(10px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "firework": {
          "0%":   { opacity: "0", transform: "scale(0)" },
          "60%":  { opacity: "1", transform: "scale(1.1)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "wand-sweep": {
          "0%, 100%": { transform: "rotate(-15deg)", filter: "brightness(0.8)" },
          "50%":      { transform: "rotate(15deg)",  filter: "brightness(1.3)" },
        },
        "castle-glow": {
          "0%, 100%": { opacity: "0.6" },
          "50%":      { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
