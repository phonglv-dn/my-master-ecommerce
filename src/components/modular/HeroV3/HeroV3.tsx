import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { getTranslations, getLocale } from 'next-intl/server';
import type { HomepageContent, Locale, LocalizedString } from '../../../../types';

interface HeroV3Props {
  content?: HomepageContent | null;
}

export default async function HeroV3({ content }: HeroV3Props) {
  const t = await getTranslations('hero');
  const tc = await getTranslations('common');
  const locale = (await getLocale()) as Locale;

  const pick = (key: string, fallbackKey: string) => {
    const ld = content?.text_data?.[key] as LocalizedString | undefined;
    return ld?.[locale] || t(fallbackKey);
  };

  return (
    <section className="w-full px-5 md:px-8 lg:px-12 py-12 md:py-16">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

        {/* Left Column (Content & Typography) */}
        <div className="w-full lg:w-1/2 flex flex-col gap-8">
          <div>
            <h1 className="font-black tracking-tighter uppercase text-black leading-[0.85] text-[clamp(2.25rem,7.5vw,7.5rem)]">
              {pick('titleLine1', 'titleLine1')}<br />{pick('titleLine2', 'titleLine2')}
            </h1>
            <p className="mt-4 text-lg font-medium text-gray-600">
              {pick('subtitle', 'subtitle')}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-6 mt-4">
            {/* Go To Shop Button Group */}
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white text-[12px] font-bold z-10 -mr-2 shadow-sm">
                S
              </div>
              <button className="flex items-center h-10 pl-5 pr-4 bg-gray-200 text-black text-[11px] font-bold tracking-wider hover:bg-gray-300 transition-colors">
                {pick('shopCta', 'shopCta')}
                <ArrowRight strokeWidth={1.5} size={16} className="ml-2" />
              </button>
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button
                className="w-10 h-10 border border-gray-300 flex items-center justify-center text-gray-600 hover:text-black hover:border-black transition-colors"
                aria-label={tc('previous')}
              >
                <ChevronLeft strokeWidth={1} size={20} />
              </button>
              <button
                className="w-10 h-10 border border-gray-300 flex items-center justify-center text-gray-600 hover:text-black hover:border-black transition-colors"
                aria-label={tc('next')}
              >
                <ChevronRight strokeWidth={1} size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (Product Images) */}
        <div className="w-full lg:w-1/2 flex gap-4">

          {/* Image 1 — Black fabric / minimalist macro texture */}
          <div className="w-1/2 aspect-[4/5] bg-gray-100 relative overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1400&auto=format&fit=crop"
              fill
              className="object-cover hover:brightness-90 transition-all duration-500 ease-out"
              alt={t('imageAlt1')}
              priority
              sizes="(max-width: 1024px) 50vw, 25vw"
            />
          </div>

          {/* Image 2 — Streetwear model in all-black */}
          <div className="w-1/2 aspect-[4/5] bg-gray-100 relative overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1400&auto=format&fit=crop"
              fill
              className="object-cover hover:brightness-90 transition-all duration-500 ease-out"
              alt={t('imageAlt2')}
              priority
              sizes="(max-width: 1024px) 50vw, 25vw"
            />
          </div>

        </div>

      </div>
    </section>
  );
}
