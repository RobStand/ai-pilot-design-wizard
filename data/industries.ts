export const INDUSTRIES = [
  "Banking & Capital Markets",
  "Credit Union / Community Banking",
  "Insurance",
  "Healthcare & Life Sciences",
  "Retail & Consumer Goods",
  "Manufacturing & Industrial",
  "Energy & Utilities",
  "Telecommunications",
  "Media & Entertainment",
  "Transportation & Logistics",
  "Public Sector & Government",
  "Higher Education",
  "Professional Services",
  "Technology & Software",
  "Real Estate",
  "Hospitality & Travel",
  "Other",
] as const;

export type Industry = (typeof INDUSTRIES)[number];
