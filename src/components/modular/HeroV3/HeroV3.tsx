import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export default function HeroV3() {
  return (
    <section className="w-full px-5 md:px-8 lg:px-12 py-12 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
        
        {/* Left Column (Content & Typography) */}
        <div className="md:col-span-5 flex flex-col justify-between">
          
          {/* Top Categories */}
          <div className="flex flex-col gap-1 mb-8 md:mb-12 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">
            <Link href="/men" className="hover:text-black transition-colors w-fit">Men</Link>
            <Link href="/women" className="hover:text-black transition-colors w-fit">Women</Link>
            <Link href="/kids" className="hover:text-black transition-colors w-fit">Kids</Link>
          </div>

          {/* Search Box */}
          <div className="flex items-center w-[260px] h-[36px] bg-[#E8E8E8] px-3 mb-16 md:mb-24 group">
            <Search className="w-4 h-4 text-gray-500 mr-3" strokeWidth={1.5} />
            <input 
              type="text" 
              placeholder="Search" 
              className="bg-transparent border-none outline-none text-[11px] w-full text-black placeholder-gray-500"
            />
          </div>

          {/* Huge Typography */}
          <div>
            <h1 className="text-[3.5rem] sm:text-7xl md:text-7xl lg:text-[6.5rem] xl:text-[8rem] font-black uppercase leading-[0.85] tracking-tighter text-[#1C1C1C]">
              <div className="block">NEW</div>
              <div className="flex items-center">
                <span>COLLECTI</span>
                <span className="relative">
                  O
                  {/* The overlapping N effect */}
                  <span className="absolute -left-[0.25em] top-0 mix-blend-darken text-[#1C1C1C]">N</span>
                </span>
              </div>
            </h1>
            
            <div className="mt-6 md:mt-8 text-sm md:text-base font-semibold text-gray-700 leading-tight">
              <p>Summer</p>
              <p>2024</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-12 md:mt-20">
            <button className="flex items-center justify-between w-[180px] md:w-[220px] h-[44px] bg-[#E5E5E5] px-5 text-[11px] font-semibold tracking-wider hover:bg-[#D4D4D4] transition-colors">
              Go To Shop
              <ArrowRight strokeWidth={1.2} size={18} />
            </button>
            <div className="flex gap-2">
              <button 
                className="w-[44px] h-[44px] border border-gray-300 flex items-center justify-center hover:border-black text-gray-500 hover:text-black transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft strokeWidth={1} size={20} />
              </button>
              <button 
                className="w-[44px] h-[44px] border border-gray-300 flex items-center justify-center hover:border-black text-gray-500 hover:text-black transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight strokeWidth={1} size={20} />
              </button>
            </div>
          </div>

        </div>

        {/* Right Column (Product Images) */}
        <div className="md:col-span-7 flex md:grid md:grid-cols-2 gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-6 md:pb-0">
          
          {/* Image 1 */}
          <div className="min-w-[85%] md:min-w-0 snap-center">
            <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
              <Image 
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1400&auto=format&fit=crop" 
                fill 
                className="object-cover hover:scale-105 transition-transform duration-700 ease-out" 
                alt="Summer Collection Model 1"
                priority
                sizes="(max-width: 768px) 85vw, 50vw"
              />
            </div>
          </div>

          {/* Image 2 */}
          <div className="min-w-[85%] md:min-w-0 snap-center">
            <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
              <Image 
                src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1400&auto=format&fit=crop" 
                fill 
                className="object-cover hover:scale-105 transition-transform duration-700 ease-out" 
                alt="Summer Collection Model 2"
                priority
                sizes="(max-width: 768px) 85vw, 50vw"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
