"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";
import LocaleSwitcher from "../LocaleSwitcher/LocaleSwitcher";
import CurrencySwitcher from "../CurrencySwitcher/CurrencySwitcher";
import { SHOP_CONFIG } from "../../../../shop.config";
import type { Locale } from "../../../../shop.config";

import { useCart } from "../../../contexts/CartContext";

// ── HeaderV1 ─────────────────────────────────────────────────────────────────
// Classic opaque sticky header with full navigation bar.
// Contains: logo | nav links | locale switcher | currency switcher | cart icon.

export default function HeaderV1() {
  const t = useTranslations("common");
  const locale = useLocale() as Locale;
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useCart();

  const navLinks = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/products`, label: t("products") },
    { href: `/${locale}/cart`, label: t("cart") },
    { href: `/${locale}/account`, label: t("account") },
  ];

  return (
    <header className="header-v1" id="header-v1">
      <div className="header-v1__inner">
        {/* ── Logo ── */}
        <Link
          href={`/${locale}`}
          className="header-v1__logo"
          aria-label={`${SHOP_CONFIG.brand.name} – Home`}
        >
          <span className="header-v1__logo-icon" aria-hidden="true">🛍️</span>
          <span className="header-v1__logo-text">{SHOP_CONFIG.brand.name}</span>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="header-v1__nav" aria-label="Main navigation">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} className="header-v1__nav-link">
              {label}
            </Link>
          ))}
        </nav>

        {/* ── Controls ── */}
        <div className="header-v1__controls">
          <LocaleSwitcher className="header-v1__locale" />
          <CurrencySwitcher className="header-v1__currency" />

          <Link
            href={`/${locale}/cart`}
            className="header-v1__cart-btn relative"
            aria-label={t("cart")}
            id="header-v1-cart"
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-gray-900">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Mobile hamburger */}
          <button
            className="header-v1__hamburger"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            id="header-v1-hamburger"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      {mobileOpen && (
        <nav
          className="header-v1__mobile-nav"
          aria-label="Mobile navigation"
          id="header-v1-mobile-nav"
        >
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="header-v1__mobile-link"
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div className="header-v1__mobile-controls">
            <LocaleSwitcher />
            <CurrencySwitcher />
          </div>
        </nav>
      )}
    </header>
  );
}
