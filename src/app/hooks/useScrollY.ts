import { useSyncExternalStore } from "react";

/*
 * One rAF-throttled scroll listener for the whole page.
 *
 * The header, the logo morph, the hero glass cards and every `data-par` parallax
 * element all key off scroll position. Each mounting its own listener would mean
 * a handful of them fighting for the same frame, so they share this store instead:
 * one passive listener, one rAF, one notify per frame.
 */

let scrollY = typeof window === "undefined" ? 0 : window.scrollY;
let ticking = false;
const listeners = new Set<() => void>();

function flush() {
  ticking = false;
  const next = window.scrollY;
  if (next === scrollY) return;
  scrollY = next;
  for (const l of listeners) l();
}

function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(flush);
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) window.addEventListener("scroll", onScroll, { passive: true });
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("scroll", onScroll);
  };
}

const getSnapshot = () => scrollY;
const getServerSnapshot = () => 0;

export function useScrollY() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Smoothstep easing — `t²(3-2t)`, clamped. Drives the header logo morph. */
export function smoothstep(t: number) {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
}

/** Linear progress of `value` across `[from, to]`, clamped to 0–1. */
export function progress(value: number, from: number, to: number) {
  return Math.min(1, Math.max(0, (value - from) / (to - from)));
}

/**
 * Whether the page is scrolled past `threshold`. Backed by the same store, but the
 * snapshot is a boolean, so React only re-renders on the crossing rather than on
 * every frame.
 */
export function useScrolledPast(threshold: number) {
  return useSyncExternalStore(
    subscribe,
    () => scrollY > threshold,
    () => false,
  );
}
