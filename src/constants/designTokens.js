/**
 * Design Tokens — FLISoL UTP 2026
 * Sistema "Dark Tech Freedom"
 *
 * Fuente de verdad para clases de tipografía reutilizables.
 * Importar donde se necesite en lugar de repetir las clases manualmente.
 *
 * ─── ESCALA TIPOGRÁFICA (5 pasos) ───────────────────────────────────────────
 *  1. Títulos de sección  → text-4xl sm:text-6xl  (sectionTitle)
 *  2. Títulos de card     → text-xl sm:text-2xl   (cardTitle)
 *  3. Cuerpo / descripción → text-base
 *  4. Metadata / nombres  → text-sm
 *  5. Micro-etiquetas     → text-[10px]           (sectionLabel, badges)
 * ────────────────────────────────────────────────────────────────────────────
 */

export const typography = {
  /**
   * Título de sección estándar.
   * text-4xl en mobile → text-6xl desde sm (640px).
   * Usado en: TicketGenerator, PracticalInfo, Sponsors, SpeakersCarousel, Schedule.
   * Referencia visual: "Tu entrada al Futuro Libre".
   */
  sectionTitle: 'font-display text-4xl font-bold sm:text-6xl leading-[0.85] tracking-tighter text-white',

  /**
   * Título de sección grande.
   * text-6xl en mobile → text-8xl desde md (768px).
   * Usado en: AboutFlisol, Register.
   */
  sectionTitleLarge: 'font-display text-6xl font-black md:text-8xl leading-[0.8] tracking-tighter text-white',

  /**
   * Título de sección masivo (hero / footer).
   * text-7xl en mobile → text-9xl desde md (768px).
   * Usado en: Footer.
   */
  sectionTitleMassive: 'font-display text-7xl font-black md:text-9xl leading-[0.8] tracking-tighter text-white',

  /**
   * Título de card / ítem.
   * Paso 2 de la escala: text-xl mobile → text-2xl desde sm.
   * Usado en: Activities (tarjetas), SpeakersCarousel (nombre), Schedule (sesión).
   */
  cardTitle: 'font-display text-xl sm:text-2xl font-bold text-white',

  /**
   * Etiqueta de sección (eyebrow label) y badges micro.
   * Paso 5 de la escala. Pequeña, uppercase, tracking amplio.
   * Tamaño unificado: text-[10px] — NO usar text-[9px] ni text-[8px].
   */
  sectionLabel: 'text-[10px] font-bold uppercase tracking-[0.4em]',
}
