"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ShoppingCart, Menu, X, Search } from "lucide-react";
import { useState, useEffect } from "react";
import LocaleSwitcher from "../LocaleSwitcher/LocaleSwitcher";
import CurrencySwitcher from "../CurrencySwitcher/CurrencySwitcher";
import { SHOP_CONFIG } from "../../../../shop.config";
import type { Locale } from "../../../../shop.config";

import { useCart } from "../../../contexts/CartContext";

// ── HeaderV2 ─────────────────────────────────────────────────────────────────
// Sticky transparent header that gains a frosted-glass background on scroll.
// Minimal: logo + icon controls only; locale & currency switchers in a drawer.

export default function HeaderV2() {
  const t = useTranslations("common");
  const locale = useLocale() as Locale;
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { totalItems } = useCart();

  // Detect scroll to toggle blur background
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/products`, label: t("products") },
  ];

  return (
    <>
      <header
        className={`header-v2 ${scrolled ? "header-v2--scrolled" : ""}`}
        id="header-v2"
      >
        <div className="header-v2__inner">
          {/* ── Logo ── */}
          <Link
            href={`/${locale}`}
            className="header-v2__logo"
            aria-label={`${SHOP_CONFIG.brand.name} – Home`}
          >
            <span className="header-v2__logo-icon" aria-hidden="true">🛍️</span>
            <span className="header-v2__logo-text">{SHOP_CONFIG.brand.name}</span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="header-v2__nav" aria-label="Main navigation">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} className="header-v2__nav-link">
                {label}
              </Link>
            ))}
          </nav>

          {/* ── Right controls ── */}
          <div className="header-v2__controls">
            {/* Locale + Currency only on desktop */}
            <div className="header-v2__switchers">
              <LocaleSwitcher />
              <CurrencySwitcher />
            </div>

            <Link
              href={`/${locale}/cart`}
              className="header-v2__icon-btn relative"
              aria-label={t("cart")}
              id="header-v2-cart"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-gray-900">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              className="header-v2__icon-btn"
              aria-label={t("search")}
              id="header-v2-search"
            >
              <Search size={20} />
            </button>

            {/* Hamburger (mobile) */}
            <button
              className="header-v2__hamburger"
              onClick={() => setDrawerOpen((v) => !v)}
              aria-label={drawerOpen ? "Close menu" : "Open menu"}
              aria-expanded={drawerOpen}
              id="header-v2-hamburger"
            >
              {drawerOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Side Drawer (mobile) ── */}
      {drawerOpen && (
        <aside
          className="header-v2__drawer"
          id="header-v2-drawer"
          aria-label="Mobile navigation drawer"
        >
          <div className="header-v2__drawer-inner">
            <button
              className="header-v2__drawer-close"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close drawer"
            >
              <X size={24} />
            </button>

            <nav className="header-v2__drawer-nav">
              {[
                { href: `/${locale}`, label: t("home") },
                { href: `/${locale}/products`, label: t("products") },
                { href: `/${locale}/cart`, label: t("cart") },
                { href: `/${locale}/account`, label: t("account") },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="header-v2__drawer-link"
                  onClick={() => setDrawerOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </nav>

            <div className="header-v2__drawer-switchers">
              <LocaleSwitcher />
              <CurrencySwitcher />
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
