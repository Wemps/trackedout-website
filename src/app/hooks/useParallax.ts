import { useEffect, useRef } from "react";

/*
 * Shared parallax driver.
 *
 * The offset is measured from the element's distance to the viewport centre —
 * `(top + height/2 - vh/2) * -rate` — not from raw scrollY. That keeps each
 * element's drift symmetrical about the moment it is centred, so a band reads as
 * settling into place rather than sliding continuously from page load.
 *
 * Elements are written to directly rather than through state: these run every
 * frame, and re-rendering the section tree for each one would be wasteful.
 */

type Entry = { el: HTMLElement; rate: number; base: string };

const entries = new Set<Entry>();
let queued = false;
let listening = false;

function apply() {
  queued = false;
  const vh = window.innerHeight;
  for (const { el, rate, base } of entries) {
    const r = el.getBoundingClientRect();
    const offset = (r.top + r.height / 2 - vh / 2) * -rate;
    el.style.transform = `${base} translate3d(0, ${offset.toFixed(1)}px, 0)`;
  }
}

function schedule() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(apply);
}

function listen() {
  if (listening) return;
  listening = true;
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
}

function unlisten() {
  if (!listening || entries.size > 0) return;
  listening = false;
  window.removeEventListener("scroll", schedule);
  window.removeEventListener("resize", schedule);
}

/**
 * Parallax an element at `rate`. Returns a ref to attach.
 *
 * `baseTransform` is preserved and composed with, for elements that are already
 * translated for layout (the hero bloom is centred with `translateX(-50%)`).
 * Pass `enabled: false` to opt out — used for `prefers-reduced-motion`.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(
  rate: number,
  { enabled = true, baseTransform = "" }: { enabled?: boolean; baseTransform?: string } = {},
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!enabled) {
      el.style.transform = baseTransform;
      return;
    }

    const entry: Entry = { el, rate, base: baseTransform };
    el.style.willChange = "transform";
    entries.add(entry);
    listen();
    schedule();

    return () => {
      entries.delete(entry);
      el.style.willChange = "";
      el.style.transform = baseTransform;
      unlisten();
    };
  }, [rate, enabled, baseTransform]);

  return ref;
}
