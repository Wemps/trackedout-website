import type { CSSProperties, ReactNode } from "react";

/**
 * The 1328px content column with the standard 56px gutter. Sections that need a
 * full-bleed band render it themselves and wrap only the copy in this.
 */
export function Container({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={className}
      style={{ maxWidth: "var(--content-max)", margin: "0 auto", width: "100%", ...style }}
    >
      {children}
    </div>
  );
}

/** Section eyebrow — `700 14px Gemunu`, `.18em` tracking, accent coloured. */
export function Eyebrow({ index, label, color }: { index: string; label: string; color: string }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 14,
        letterSpacing: "0.18em",
        color,
        margin: "0 0 18px",
        textTransform: "uppercase",
      }}
    >
      {index} / {label}
    </p>
  );
}

/** Section h2 — `700 76px/0.98 Gemunu`, full content width, on all five sections. */
export function SectionHeading({
  children,
  color = "var(--ink)",
  style,
}: {
  children: ReactNode;
  color?: string;
  style?: CSSProperties;
}) {
  return (
    <h2
      style={{
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: "clamp(40px, 5.6vw, 76px)",
        lineHeight: 0.98,
        letterSpacing: "-0.01em",
        color,
        margin: "0 0 28px",
        ...style,
      }}
    >
      {children}
    </h2>
  );
}

/** Lead paragraph — `400 17.5px/1.65 Noto`, capped at 820px. */
export function Lead({
  children,
  color = "var(--body-grey)",
  style,
}: {
  children: ReactNode;
  color?: string;
  style?: CSSProperties;
}) {
  return (
    <p
      style={{
        fontFamily: "var(--font-body)",
        fontWeight: 400,
        fontSize: 17.5,
        lineHeight: 1.65,
        color,
        maxWidth: 820,
        margin: "0 0 18px",
        ...style,
      }}
    >
      {children}
    </p>
  );
}
