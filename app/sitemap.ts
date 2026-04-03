import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://parkplan-ai.vercel.app";
  const resorts = ["wdw","disneyland","paris","tokyo","hongkong","shanghai","universal-orlando"];
  
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/plan`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/dashboard`, changeFrequency: "daily", priority: 0.85 },
    { url: `${base}/trips`, changeFrequency: "weekly", priority: 0.6 },
    ...resorts.map(id => ({
      url: `${base}/resorts/${id}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
