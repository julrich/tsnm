/**
 * Font wiring.
 *
 * This site's theme (Storyblok `token-theme` story `settings/themes/tsnm`) sets
 * `--ks-brand-font-family-{display,copy,interface}` to a system font stack, so no
 * webfont is loaded or preloaded. The values below keep the previous API
 * (`fontClassNames`, `nextFontFamilies`, `localFontFamilyName`) working for
 * `pages/_app.tsx`, `pages/[[...slug]].tsx` and `pages/_preview/[[...slug]].tsx`.
 *
 * To load a self-hosted webfont again: restore this file from git, put the woff2
 * files in `packages/design-system/static/fonts/`, and set the theme's font
 * families to that family name — `_app.tsx` then rewrites the theme CSS to
 * next/font's internal family so the optimised `@font-face` is used.
 */

export const fontClassNames = "";
export const fontClassNamesPreview = "";

/** next/font synthetic family names, empty because no local font is loaded. */
export const nextFontFamilies = {
  display: "",
  copy: "",
  interface: "",
};

/**
 * Sentinel that can never equal a real font family, so `_app.tsx`'s
 * "is this theme using our local font?" rewrite never fires.
 */
export const localFontFamilyName = "__no-local-webfont__";
