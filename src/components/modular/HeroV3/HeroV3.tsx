import React from 'react';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export default function HeroV3() {
  return (
    <section className="w-full px-5 md:px-8 lg:px-12 py-12 md:py-16">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* Left Column (Content & Typography) */}
        <div className="w-full lg:w-1/2 flex flex-col gap-8">
          <div>
            <h1 className="text-6xl lg:text-[5.5rem] font-black leading-[0.9] tracking-tight uppercase text-black">
              NEW<br />COLLECTION
            </h1>
            <p className="mt-4 text-lg font-medium text-gray-600">
              Summer 2024
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-6 mt-4">
            {/* Go To Shop Button Group */}
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white text-[10px] font-bold z-10 -mr-2 shadow-sm">
                N
              </div>
              <button className="flex items-center h-10 pl-5 pr-4 bg-gray-200 text-black text-[11px] font-bold tracking-wider hover:bg-gray-300 transition-colors">
                GO TO SHOP
                <ArrowRight strokeWidth={1.5} size={16} className="ml-2" />
              </button>
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button 
                className="w-10 h-10 border border-gray-300 flex items-center justify-center text-gray-600 hover:text-black hover:border-black transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft strokeWidth={1} size={20} />
              </button>
              <button 
                className="w-10 h-10 border border-gray-300 flex items-center justify-center text-gray-600 hover:text-black hover:border-black transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight strokeWidth={1} size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (Product Images) */}
        <div className="w-full lg:w-1/2 flex gap-4">
          
          {/* Image 1 */}
          <div className="w-1/2 aspect-[4/5] bg-gray-100 relative overflow-hidden">
            <Image 
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1400&auto=format&fit=crop" 
              fill 
              className="object-cover hover:scale-105 transition-transform duration-700 ease-out" 
              alt="Summer Collection Model 1"
              priority
              sizes="(max-width: 1024px) 50vw, 25vw"
            />
          </div>

          {/* Image 2 */}
          <div className="w-1/2 aspect-[4/5] bg-gray-100 relative overflow-hidden">
            <Image 
              src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1400&auto=format&fit=crop" 
              fill 
              className="object-cover hover:scale-105 transition-transform duration-700 ease-out" 
              alt="Summer Collection Model 2"
              priority
              sizes="(max-width: 1024px) 50vw, 25vw"
            />
          </div>

        </div>

      </div>
    </section>
  );
}
