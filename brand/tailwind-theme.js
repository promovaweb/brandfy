/**
 * Tema Tailwind gerado pelo Brandfy.
 *
 * Fonte editável: brand/colors/palette.json.
 * Importe colors em theme.extend.colors no Tailwind CSS 3 ou use os mesmos
 * tokens em @theme quando o projeto adotar Tailwind CSS 4.
 */

export const colors = {
  "primary": {
    "50": "var(--color-primary-50)",
    "100": "var(--color-primary-100)",
    "200": "var(--color-primary-200)",
    "300": "var(--color-primary-300)",
    "400": "var(--color-primary-400)",
    "500": "var(--color-primary-500)",
    "600": "var(--color-primary-600)",
    "700": "var(--color-primary-700)",
    "800": "var(--color-primary-800)",
    "900": "var(--color-primary-900)",
    "950": "var(--color-primary-950)"
  },
  "accent": "var(--color-accent)",
  "neutral": {
    "50": "var(--color-neutral-50)",
    "100": "var(--color-neutral-100)",
    "200": "var(--color-neutral-200)",
    "300": "var(--color-neutral-300)",
    "400": "var(--color-neutral-400)",
    "500": "var(--color-neutral-500)",
    "600": "var(--color-neutral-600)",
    "700": "var(--color-neutral-700)",
    "800": "var(--color-neutral-800)",
    "900": "var(--color-neutral-900)",
    "950": "var(--color-neutral-950)"
  },
  "background": "var(--color-background)",
  "surface": "var(--color-surface)",
  "text": "var(--color-text)",
  "text-muted": "var(--color-text-muted)",
  "border": "var(--color-border)",
  "focus": "var(--color-focus)",
  "success": "var(--color-success)",
  "warning": "var(--color-warning)",
  "error": "var(--color-error)",
  "info": "var(--color-info)"
};

export default {
  theme: {
    extend: {
      colors,
      fontFamily: {
        sans: ["var(--font-body)"],
        heading: ["var(--font-heading)"],
        mono: ["var(--font-mono)"]
      }
    }
  }
};
