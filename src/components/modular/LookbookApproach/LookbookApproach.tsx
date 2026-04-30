import Image from "next/image";

export default function LookbookApproach() {
  return (
    <section className="bg-[#f4f4f4] py-24 w-full overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
        {/* Title & Description */}
        <div className="flex flex-col items-center mb-24">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-widest uppercase text-center mb-8 text-black">
            SBLVK: Beyond the Black
          </h2>
          <p className="text-gray-500 text-center max-w-2xl text-sm leading-[2] tracking-wide">
            Chúng tôi tin rằng màu đen không phải là sự thiếu vắng màu sắc,
            <br className="hidden md:block" />
            mà là sự tập trung tuyệt đối vào phom dáng và bản sắc.
          </p>
        </div>

        {/* Asymmetrical Grid */}
        <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8 overflow-x-auto pb-12 snap-x snap-mandatory md:snap-none hide-scrollbar">
          {/* Image 1 — Architectural night */}
          <div className="w-full md:w-1/4 shrink-0 min-w-[85vw] md:min-w-0 snap-center">
            <div className="relative aspect-[3/4] w-full group overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1519659528534-7fd733a832a0?w=800&q=80"
                alt="Dark minimalist - architectural night"
                fill
                className="object-cover grayscale transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>
          </div>

          {/* Image 2 — Box Tee model (shifted down) */}
          <div className="w-full md:w-1/4 shrink-0 min-w-[85vw] md:min-w-0 md:translate-y-12 snap-center">
            <div className="relative aspect-[3/4] w-full group overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"
                alt="Dark minimalist - black box tee"
                fill
                className="object-cover grayscale transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>
          </div>

          {/* Image 3 — Night street (white frame) */}
          <div className="w-full md:w-1/4 shrink-0 min-w-[85vw] md:min-w-0 md:-translate-y-12 snap-center">
            <div className="relative aspect-[3/4] w-full bg-white p-3 md:p-4 group">
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80"
                  alt="Dark minimalist - night street"
                  fill
                  className="object-cover grayscale transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </div>
            </div>
          </div>

          {/* Image 4 — Brutalist concrete */}
          <div className="w-full md:w-1/4 shrink-0 min-w-[85vw] md:min-w-0 md:translate-y-12 snap-center">
            <div className="relative aspect-[3/4] w-full group overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80"
                alt="Dark minimalist - brutalist silhouette"
                fill
                className="object-cover grayscale transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
