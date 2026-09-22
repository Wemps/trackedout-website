import { useEffect, useRef, useState } from "react";

/*
 * One shared IntersectionObserver, same shape as the scroll store in
 * useScrollY: a single observer with a Set of subscribers, created lazily and
 * disconnected when the last one unsubscribes.
 */

const callbacks = new Map<Element, () => void>();
let observer: IntersectionObserver | null = null;

function ensureObserver() {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        callbacks.get(entry.target)?.();
      }
    },
    // Start work just before the element arrives, so it has rendered by the
    // time it is actually on screen.
    { rootMargin: "300px" },
  );
  return observer;
}

/**
 * Whether the element has ever been near the viewport.
 *
 * Latches: once true it never goes back. That matters for the map — each
 * `new mapboxgl.Map()` is a billed load, so re-initialising on every scroll
 * back would charge for the same visitor repeatedly.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;

    const io = ensureObserver();
    callbacks.set(el, () => setInView(true));
    io.observe(el);

    return () => {
      callbacks.delete(el);
      io.unobserve(el);
      if (callbacks.size === 0) {
        observer?.disconnect();
        observer = null;
      }
    };
  }, [inView]);

  return [ref, inView] as const;
}
