export type SocialKey =
  | "instagram"
  | "linkedin"
  | "tokopedia"
  | "shopee"
  | "blibli";

export type SocialLink = {
  key: SocialKey;
  label: string;
  /** URL dari env; "#" bila belum diisi. */
  href: string;
  /** Huruf untuk badge marketplace. */
  short: string;
};

const PLACEHOLDER = "#";

function url(value: string | undefined): string {
  return value && value.trim() ? value.trim() : PLACEHOLDER;
}

/** Daftar link sosial & marketplace. Semua selalu ditampilkan; yang kosong memakai "#". */
export function socialLinks(): SocialLink[] {
  return [
    {
      key: "instagram",
      label: "Instagram",
      short: "Ig",
      href: url(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      short: "In",
      href: url(process.env.NEXT_PUBLIC_LINKEDIN_URL),
    },
    {
      key: "tokopedia",
      label: "Tokopedia",
      short: "T",
      href: url(process.env.NEXT_PUBLIC_TOKOPEDIA_URL),
    },
    {
      key: "shopee",
      label: "Shopee",
      short: "S",
      href: url(process.env.NEXT_PUBLIC_SHOPEE_URL),
    },
    {
      key: "blibli",
      label: "Blibli",
      short: "B",
      href: url(process.env.NEXT_PUBLIC_BLIBLI_URL),
    },
  ];
}
