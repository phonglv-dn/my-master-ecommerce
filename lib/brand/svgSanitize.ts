import "server-only";
import DOMPurify from "isomorphic-dompurify";

/**
 * Strip script tags, event handlers, foreignObject, and javascript: URIs from
 * an admin-uploaded SVG before it lands in Storage.
 *
 * Strictly speaking, SVG loaded via <img> (which is how next/image consumes
 * it) does not execute scripts — the browser treats it as a static image.
 * We still sanitize so the file is safe if it ever gets inlined, served via
 * <object>, or downloaded by users.
 */
export function sanitizeSvg(svg: string): string {
  const out = DOMPurify.sanitize(svg, {
    USE_PROFILES: { svg: true, svgFilters: true },
    FORBID_TAGS: ["script", "foreignObject"],
    FORBID_ATTR: [
      "onload",
      "onerror",
      "onclick",
      "onmouseover",
      "onfocus",
      "onmouseenter",
    ],
  });
  // DOMPurify drops the XML prolog; keep output as plain SVG (still valid).
  return out.trim();
}
