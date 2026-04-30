import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import type {
  HomepageContent,
  Locale,
  LocalizedString,
  LookbookImage,
} from "../../../../types";

interface LookbookApproachProps {
  content?: HomepageContent | null;
}

const FALLBACK_IMAGES: LookbookImage[] = [
  {
    url: "https://images.unsplash.com/photo-1519659528534-7fd733a832a0?w=800&q=80",
    alt_vi: "",
    alt_en: "",
  },
  {
    url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    alt_vi: "",
    alt_en: "",
  },
  {
    url: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
    alt_vi: "",
    alt_en: "",
  },
  {
    url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
    alt_vi: "",
    alt_en: "",
  },
];

const SLOT_WRAPPER_CLASS = [
  "w-full md:w-1/4 shrink-0 min-w-[85vw] md:min-w-0 snap-center",
  "w-full md:w-1/4 shrink-0 min-w-[85vw] md:min-w-0 md:translate-y-12 snap-center",
  "w-full md:w-1/4 shrink-0 min-w-[85vw] md:min-w-0 md:-translate-y-12 snap-center",
  "w-full md:w-1/4 shrink-0 min-w-[85vw] md:min-w-0 md:translate-y-12 snap-center",
];

export default async function LookbookApproach({ content }: LookbookApproachProps) {
  const t = await getTranslations("lookbook");
  const locale = (await getLocale()) as Locale;

  const titleLd = content?.text_data?.title as LocalizedString | undefined;
  const descLd = content?.text_data?.description as LocalizedString | undefined;
  const title = titleLd?.[locale] || t("title");
  const description = descLd?.[locale] || t("description");

  const dbImages = content?.image_data?.images ?? [];
  const images: LookbookImage[] = FALLBACK_IMAGES.map((fb, i) => {
    const fromDb = dbImages[i];
    if (!fromDb || !fromDb.url) return fb;
    return fromDb;
  });

  const altFor = (img: LookbookImage, i: number): string => {
    const fromImg = locale === "vi" ? img.alt_vi : img.alt_en;
    if (fromImg) return fromImg;
    return t(`imageAlt${i + 1}` as `imageAlt${1 | 2 | 3 | 4}`);
  };

  return (
    <section className="bg-[#f4f4f4] py-24 w-full overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
        {/* Title & Description */}
        <div className="flex flex-col items-center mb-24">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-widest uppercase text-center mb-8 text-black">
            {title}
          </h2>
          <p className="text-gray-500 text-center max-w-2xl text-sm leading-[2] tracking-wide whitespace-pre-line">
            {description}
          </p>
        </div>

        {/* Asymmetrical Grid */}
        <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8 overflow-x-auto pb-12 snap-x snap-mandatory md:snap-none hide-scrollbar">
          {images.map((img, i) => {
            const isFramed = i === 2;
            return (
              <div key={i} className={SLOT_WRAPPER_CLASS[i]}>
                {isFramed ? (
                  <div className="relative aspect-[3/4] w-full bg-white p-3 md:p-4 group">
                    <div className="relative w-full h-full overflow-hidden">
                      <Image
                        src={img.url}
                        alt={altFor(img, i)}
                        fill
                        className="object-cover grayscale transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="relative aspect-[3/4] w-full group overflow-hidden">
                    <Image
                      src={img.url}
                      alt={altFor(img, i)}
                      fill
                      className="object-cover grayscale transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
