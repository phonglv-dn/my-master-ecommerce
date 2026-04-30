import Link from "next/link";
import FooterLocaleSwitch from "./FooterLocaleSwitch";
import FooterWordmark from "./FooterWordmark";

const NAV_LINKS = [
  { label: "Shop", href: "#" },
  { label: "About", href: "#" },
  { label: "Policies", href: "#" },
  { label: "Socials (Instagram/TikTok)", href: "#" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-[#f8f8f8] pt-24 md:pt-32 pb-8 px-6 md:px-12 lg:px-24">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:justify-between md:items-end gap-16 md:gap-8">
        {/* Left Column — Navigation */}
        <nav
          className="flex flex-col gap-6 z-10"
          aria-label="Footer navigation"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs uppercase tracking-widest text-gray-600 font-medium hover:text-black transition-colors"
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-6">
            <FooterLocaleSwitch />
          </div>
        </nav>

        {/* Right — Huge SBLVK wordmark (outline → ink fill on scroll-in) */}
        <FooterWordmark />
      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1400px] mx-auto mt-20 md:mt-28 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-t border-gray-200 pt-8">
        <div className="flex items-center gap-3">
          <span
            className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-[11px] font-bold"
            aria-hidden
          >
            S
          </span>
          <p className="text-[10px] md:text-xs uppercase tracking-widest text-gray-500 font-medium">
            © 2026 — SBLVK. All rights reserved.
          </p>
        </div>

        <Link
          href="#"
          className="text-[10px] md:text-xs uppercase tracking-widest text-gray-500 font-medium hover:text-black transition-colors"
        >
          Privacy
        </Link>
      </div>
    </footer>
  );
}
