export type SocialKey =
  | "instagram"
  | "linkedin"
  | "shopee"
  | "tiktok"
  | "tokopedia"
  | "blibli";

export type SocialLink = {
  key: SocialKey;
  label: string;
  /** URL dari env (diutamakan) atau default; "#" bila belum ada. */
  href: string;
};

const PLACEHOLDER = "#";

/** URL bawaan tiap platform. Env NEXT_PUBLIC_*_URL akan menimpa nilai ini. */
const DEFAULTS: Record<SocialKey, string> = {
  instagram: "https://www.instagram.com/rizqyutamaa",
  linkedin: "https://www.linkedin.com/company/rizqy-utama-store/",
  shopee: "https://id.shp.ee/2tXxjAkz",
  tiktok: "https://vt.tiktok.com/ZSqPGBgrD/",
  tokopedia: "https://tk.tokopedia.com/ZSbETw6kt/",
  blibli: "https://blibli.onelink.me/GNtk/eeiqdxb6",
};

function resolve(key: SocialKey, value: string | undefined): string {
  const trimmed = value?.trim();
  return trimmed || DEFAULTS[key] || PLACEHOLDER;
}

/** Daftar link sosial & marketplace. Semua selalu ditampilkan; yang kosong memakai "#". */
export function socialLinks(): SocialLink[] {
  return [
    {
      key: "instagram",
      label: "Instagram",
      href: resolve("instagram", process.env.NEXT_PUBLIC_INSTAGRAM_URL),
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      href: resolve("linkedin", process.env.NEXT_PUBLIC_LINKEDIN_URL),
    },
    {
      key: "shopee",
      label: "Shopee",
      href: resolve("shopee", process.env.NEXT_PUBLIC_SHOPEE_URL),
    },
    {
      key: "tiktok",
      label: "TikTok",
      href: resolve("tiktok", process.env.NEXT_PUBLIC_TIKTOK_URL),
    },
    {
      key: "tokopedia",
      label: "Tokopedia",
      href: resolve("tokopedia", process.env.NEXT_PUBLIC_TOKOPEDIA_URL),
    },
    {
      key: "blibli",
      label: "Blibli",
      href: resolve("blibli", process.env.NEXT_PUBLIC_BLIBLI_URL),
    },
  ];
}
