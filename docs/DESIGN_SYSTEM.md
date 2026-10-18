# Ventas POS Design System

> Source of truth: `.opencode/plan/design-system/opencode-master-prompt.md` (v2.1).
> Token layers live in `src/styles/tokens/` (primitives → semantic → scales → aliases),
> loaded once via the `_tokens.scss` barrel from the top of `src/styles.scss`
> (there is no flat `:root` token block in `src/styles.scss` — only bindings/overrides).

## Palette (v2.1 — Gemini classic) — the only hex values in `_primitives.scss`

| Role | Token (flat / primitive) | Hex |
|---|---|---|
| Brand (steel) | `--vn-navy` / `--vn-navy-500` | `#44596e` |
| Brand hover | `--vn-navy-dark` / `--vn-navy-700` | `#2d3d4f` |
| Brand light | `--vn-navy-light` / `--vn-navy-300` | `#5a7191` |
| Accent (orange) | `--vn-accent` / `--vn-accent-500` | `#ec994b` |
| Accent hover | `--vn-accent-dark` / `--vn-accent-700` | `#d4823a` |
| Link | `--vn-link` → `--vn-accent-hover` | `#d4823a` |
| Accent light | `--vn-accent-light` / `--vn-accent-300` | `#f5b877` |
| Page bg (sand) | `--vn-sand` / `--vn-sand-500` | `#f4f3f0` |
| Sand dark | `--vn-sand-dark` / `--vn-sand-600` | `#e8e6e2` |
| Surface / alt | `--vn-surface` / `--vn-surface-alt` | `#ffffff` / `#f8fafc` |
| Ink / muted / faint | `--vn-ink` • `-muted` • `-faint` | `#1f2937` / `#64748b` / `#94a3b8` |
| Border / light | `--vn-border` / `--vn-border-light` | `#cbd5e1` / `#e2e8f0` |
| Success trio | `--vn-success` / `-bg` / `-fg` | `#16a34a` / `#dcfce7` / `#166534` |
| Danger trio | `--vn-danger` / `-bg` / `-fg` | `#db1f48` / `#fee2e2` / `#991b1b` |
| Warning trio | `--vn-warning` / `-bg` / `-fg` | `#f59e0b` / `#fef3c7` / `#92400e` |
| Info trio | `--vn-info` / `-bg` / `-fg` | `#2563eb` / `#dbeafe` / `#1e40af` |
| Container tints | `--vn-navy-50` / `--vn-navy-100` / `--vn-accent-100` | `#EEF2F6` / `#DCE4EC` / `#FCF0E3` |
| Focus ring | `--vn-focus` | `0 0 0 3px rgba(68, 89, 110, 0.25)` (sanctioned rgba) |

- **Brand = steel** `#44596e`, **accent = orange** `#ec994b`.
- **Accepted trade-off (user decision, 2026-10-19):** orange `#ec994b` on white ≈
  2.2:1 and hover/link orange ≈ 2.6:1 fail WCAG contrast — accepted as-is.
  Do not silently change these values.
- Flat v1 names (`--vn-navy`, `--vn-sand`, …) are deprecated compatibility aliases in
  `src/styles/tokens/_aliases.scss` — scheduled for deletion after Phase G.

## Fonts (frozen)

`Cairo` body + numerals (`.t-num` unchanged), `El Messiri` display.
The v2 prototype's `Amiri` numeric font was reviewed and rejected.

## Changelog

- **v2.1 — Gemini classic re-skin + M3 system-token bridge (steel/orange/sand)
  + compact density.**
  Phase A: verified primitives vs the classic table; added container tints
  (`--vn-navy-50/100`, `--vn-accent-100`) and `--vn-link`.
  Phase B: M3 container semantic roles (`--vn-primary/-secondary/-tertiary-container` + on-roles).
  Phase C: `src/theme.scss` rewritten to the single M3 `mat.theme` include;
  `--mat-sys-*` bridged to vn tokens (`primary`=steel, `tertiary`=orange,
  `error`=danger); component tokens (toolbar/sidenav/card/table) bound.
  Phase D: compact density (`56px` toolbar, `48px` mobile, `40px` table row,
  `16px` card pad) with `:root`-specificity bindings that override the legacy
  density includes in `styles.scss`; orange active-nav state (logical properties).
- **v2.1.1 — sale-screen preview re-skin** (navbar + 32px hotkey bar; toolbar rebound
  **56px → 48px** = `--vn-navbar-h`; preview scale tokens `--vn-accent-shadow`,
  `--vn-shadow-sm/md`; sale-order dense table + checkout re-skin + F2/F3/F4/F7/F10).
  Commits `bf89eec`→`c577d45`.
