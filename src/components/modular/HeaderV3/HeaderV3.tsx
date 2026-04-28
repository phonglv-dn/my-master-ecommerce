"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Heart, ShoppingBag, User, Search } from "lucide-react"
import { useLocale } from "next-intl"
import type { Category } from "../../../../types"
import { useCart } from "../../../contexts/CartContext"

interface HeaderV3Props {
  categories?: Category[]
}

export default function HeaderV3({ categories = [] }: HeaderV3Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const locale = useLocale() as "vi" | "en"
  const { totalItems } = useCart()

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  return (
    <>
      <header className='sticky top-0 z-[60] w-full bg-white/80 backdrop-blur-md px-5 md:px-8 lg:px-12 py-6 flex items-center justify-between transition-colors duration-300'>
        {/* Left: Navigation */}
        <div className='flex-1 flex items-center gap-6 md:gap-8'>
          {/* Hamburger Icon */}
          <button
            className='flex flex-col gap-[5px] justify-center w-6 h-6 group cursor-pointer relative z-[60]'
            aria-label='Menu'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span
              className={`w-5 h-[1.5px] bg-black block transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-[6.5px]" : "group-hover:w-6"}`}
            ></span>
            <span
              className={`w-3.5 h-[1.5px] bg-black block transition-all duration-300 ${isMenuOpen ? "opacity-0" : "group-hover:w-5"}`}
            ></span>
            <span
              className={`w-5 h-[1.5px] bg-black block transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-[6.5px]" : "group-hover:w-6"}`}
            ></span>
          </button>

          {/* Desktop Links */}
          <nav className='hidden md:flex items-center gap-8'>
            <Link
              href='/'
              className='text-[11px] font-medium uppercase tracking-[0.2em] text-black hover:opacity-60 transition-opacity'
            >
              Home
            </Link>
            <Link
              href='/collections'
              className='text-[11px] font-medium uppercase tracking-[0.2em] text-black hover:opacity-60 transition-opacity'
            >
              Collections
            </Link>
            <Link
              href='/new'
              className='text-[11px] font-medium uppercase tracking-[0.2em] text-black hover:opacity-60 transition-opacity'
            >
              New
            </Link>
          </nav>
        </div>

        {/* Center: Geometric Logo (Absolute Centered) */}
        <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center z-[60]'>
          <Link
            href='/'
            aria-label='Home'
            className='group'
            onClick={() => setIsMenuOpen(false)}
          >
            <svg
              width='28'
              height='28'
              viewBox='0 0 32 32'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              className='transform transition-transform duration-500 group-hover:rotate-180'
            >
              <path d='M16 0L32 16L16 32V0Z' fill='#1A1A1A' />
              <path d='M16 0L0 16L16 32V0Z' fill='#D1D5DB' />
            </svg>
          </Link>
        </div>

        {/* Right: Actions */}
        <div className='flex-1 flex items-center justify-end gap-3 md:gap-4 z-[60]'>
          {/* Wishlist */}
          <Link
            href={`/${locale}/wishlist`}
            className='hidden md:flex items-center justify-center w-[40px] h-[40px] rounded-full bg-[#1A1A1A] text-white hover:bg-black transition-colors'
            aria-label='Wishlist'
          >
            <Heart size={16} strokeWidth={1.5} />
          </Link>

          {/* Cart */}
          <Link
            href={`/${locale}/cart`}
            className='flex items-center bg-[#1A1A1A] rounded-full p-1 md:py-1.5 md:pl-5 hover:bg-black transition-all duration-300'
            aria-label='Cart'
          >
            <span className='hidden md:inline text-[10px] tracking-[0.2em] font-medium text-white mr-4'>
              CART
            </span>
            <div className='relative w-[32px] h-[32px] md:w-[30px] md:h-[30px] rounded-full bg-white text-black flex items-center justify-center'>
              <ShoppingBag size={14} strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className='absolute -top-1.5 -right-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-[#1A1A1A]'>
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </div>
          </Link>

          {/* User */}
          <Link
            href={`/${locale}/account`}
            className='flex items-center justify-center w-[40px] h-[40px] rounded-full bg-[#1A1A1A] text-white hover:bg-black transition-colors'
            aria-label='User Account'
          >
            <User size={16} strokeWidth={1.5} />
          </Link>
        </div>
      </header>

      {/* Full-screen Overlay Menu */}
      <div
        className={`fixed inset-0 bg-[#F9F9F9] z-[55] overflow-y-auto px-5 md:px-12 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isMenuOpen
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-4 invisible"
        }`}
      >
        <div className='max-w-4xl w-full mx-auto flex flex-col gap-10 md:gap-16 pt-32 pb-20'>
          {/* Search Box */}
          <div
            className={`flex items-center border-b-2 border-black/10 pb-4 group transition-all duration-700 delay-100 flex-shrink-0 ${isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <Search className='w-6 h-6 text-black/50 mr-4' strokeWidth={1.5} />
            <input
              type='text'
              placeholder='Search for products...'
              className='bg-transparent border-none outline-none text-xl md:text-3xl w-full text-black placeholder-black/30'
            />
          </div>

          {/* Navigation Categories */}
          <nav className='flex flex-col gap-6 md:gap-10'>
            {categories.length > 0
              ? categories.map((category, index) => (
                  <Link
                    key={category.id}
                    href={`/collections/${category.slug}`}
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-5xl md:text-7xl font-black uppercase tracking-tighter text-[#1C1C1C] hover:text-gray-500 transition-all duration-700 hover:translate-x-4 w-fit ${
                      isMenuOpen
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-8"
                    }`}
                    style={{ transitionDelay: `${200 + index * 100}ms` }}
                  >
                    {category.name[locale] || category.name.vi}
                  </Link>
                ))
              : ["Men", "Women", "Kids"].map((item, index) => (
                  <Link
                    key={item}
                    href={`/${item.toLowerCase()}`}
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-5xl md:text-7xl font-black uppercase tracking-tighter text-[#1C1C1C] hover:text-gray-500 transition-all duration-700 hover:translate-x-4 w-fit ${
                      isMenuOpen
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-8"
                    }`}
                    style={{ transitionDelay: `${200 + index * 100}ms` }}
                  >
                    {item}
                  </Link>
                ))}
          </nav>
        </div>
      </div>
    </>
  )
}
