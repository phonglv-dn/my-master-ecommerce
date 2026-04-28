import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, User } from 'lucide-react';

export default function HeaderV3() {
  return (
    <header className="w-full bg-transparent px-5 md:px-8 lg:px-12 py-6 flex items-center justify-between relative z-50">
      
      {/* Left: Navigation */}
      <div className="flex-1 flex items-center gap-6 md:gap-8">
        {/* Hamburger Icon */}
        <button 
          className="flex flex-col gap-[5px] justify-center w-6 h-6 group cursor-pointer"
          aria-label="Menu"
        >
          <span className="w-5 h-[1.5px] bg-black block transition-all duration-300 group-hover:w-6"></span>
          <span className="w-3.5 h-[1.5px] bg-black block transition-all duration-300 group-hover:w-5"></span>
          <span className="w-5 h-[1.5px] bg-black block transition-all duration-300 group-hover:w-6"></span>
        </button>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            href="/" 
            className="text-[11px] font-medium uppercase tracking-[0.2em] text-black hover:opacity-60 transition-opacity"
          >
            Home
          </Link>
          <Link 
            href="/collections" 
            className="text-[11px] font-medium uppercase tracking-[0.2em] text-black hover:opacity-60 transition-opacity"
          >
            Collections
          </Link>
          <Link 
            href="/new" 
            className="text-[11px] font-medium uppercase tracking-[0.2em] text-black hover:opacity-60 transition-opacity"
          >
            New
          </Link>
        </nav>
      </div>

      {/* Center: Geometric Logo (Absolute Centered) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center">
        <Link href="/" aria-label="Home" className="group">
          <svg 
            width="28" 
            height="28" 
            viewBox="0 0 32 32" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            className="transform transition-transform duration-500 group-hover:rotate-180"
          >
            {/* Right half - Black */}
            <path d="M16 0L32 16L16 32V0Z" fill="#1A1A1A"/>
            {/* Left half - Gray */}
            <path d="M16 0L0 16L16 32V0Z" fill="#D1D5DB"/>
          </svg>
        </Link>
      </div>

      {/* Right: Actions */}
      <div className="flex-1 flex items-center justify-end gap-3 md:gap-4">
        {/* Wishlist - Hidden on Mobile */}
        <button 
          className="hidden md:flex items-center justify-center w-[40px] h-[40px] rounded-full bg-[#1A1A1A] text-white hover:bg-black transition-colors"
          aria-label="Wishlist"
        >
          <Heart size={16} strokeWidth={1.5} />
        </button>

        {/* Cart - Pill on Desktop, Circle on Mobile */}
        <button 
          className="flex items-center bg-[#1A1A1A] rounded-full p-1 md:py-1.5 md:pl-5 hover:bg-black transition-all duration-300"
          aria-label="Cart"
        >
          <span className="hidden md:inline text-[10px] tracking-[0.2em] font-medium text-white mr-4">
            CART
          </span>
          <div className="w-[32px] h-[32px] md:w-[30px] md:h-[30px] rounded-full bg-white text-black flex items-center justify-center">
            <ShoppingBag size={14} strokeWidth={1.5} />
          </div>
        </button>

        {/* User */}
        <button 
          className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-[#1A1A1A] text-white hover:bg-black transition-colors"
          aria-label="User Account"
        >
          <User size={16} strokeWidth={1.5} />
        </button>
      </div>

    </header>
  );
}
