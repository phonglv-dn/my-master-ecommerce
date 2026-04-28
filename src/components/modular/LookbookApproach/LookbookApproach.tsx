import Image from "next/image";

export default function LookbookApproach() {
  const renderTitle = (text: string) => {
    return text.split("").map((char, index) => {
      if (char.toUpperCase() === "A") {
        return (
          <span key={index} className="inline-block" aria-hidden="true">
            Λ
          </span>
        );
      }
      return <span key={index}>{char}</span>;
    });
  };

  return (
    <section className="bg-[#f4f4f4] py-24 w-full overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
        {/* Title & Description */}
        <div className="flex flex-col items-center mb-24">
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-thin tracking-[0.25em] md:tracking-[0.4em] uppercase text-center mb-8 text-black"
            aria-label="Our Approach To Fashion Design"
          >
            {renderTitle("Our Approach To Fashion Design")}
          </h2>
          <p className="text-gray-500 text-center max-w-2xl text-sm leading-[2] tracking-wide">
            at elegant vogue, we blend creativity with craftsmanship to create<br className="hidden md:block" />
            fashion that transcends trends and stands the test of time. each<br className="hidden md:block" />
            design is meticulously crafted, ensuring the highest quality<br className="hidden md:block" />
            exquisite finish
          </p>
        </div>

        {/* Asymmetrical Grid */}
        <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8 overflow-x-auto pb-12 snap-x snap-mandatory md:snap-none hide-scrollbar">
          {/* Image 1 */}
          <div className="w-full md:w-1/4 shrink-0 min-w-[85vw] md:min-w-0 snap-center">
            <div className="relative aspect-[3/4] w-full group overflow-hidden">
              <Image 
                src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80" 
                alt="Fashion approach - street style"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>
          </div>
          
          {/* Image 2 (Shifted down) */}
          <div className="w-full md:w-1/4 shrink-0 min-w-[85vw] md:min-w-0 md:translate-y-16 lg:translate-y-24 snap-center">
            <div className="relative aspect-[3/4] w-full group overflow-hidden">
              <Image 
                src="https://images.unsplash.com/photo-1520975954732-57dd22299614?w=800&q=80" 
                alt="Fashion approach - detail"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>
          </div>

          {/* Image 3 (With white border/padding in the design) */}
          <div className="w-full md:w-1/4 shrink-0 min-w-[85vw] md:min-w-0 md:-translate-y-8 snap-center">
            <div className="relative aspect-[3/4] w-full bg-white p-3 md:p-4 group">
              <div className="relative w-full h-full overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1517423568366-8b83523034fd?w=800&q=80" 
                  alt="Fashion approach - casual"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </div>
            </div>
          </div>

          {/* Image 4 */}
          <div className="w-full md:w-1/4 shrink-0 min-w-[85vw] md:min-w-0 md:translate-y-8 snap-center">
            <div className="relative aspect-[3/4] w-full group overflow-hidden">
              <Image 
                src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80" 
                alt="Fashion approach - flatlay"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
