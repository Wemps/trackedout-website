import { useEffect, useRef } from "react";
import { progress } from "./useScrollY";

/**
 * Fades the hero's floating glass cards out between 380px and 720px of scroll, so
 * they're gone by the time the next section arrives. Written to the DOM directly —
 * it updates every frame.
 */
export function useHeroFade(enabled = true) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!enabled) {
      el.style.opacity = "1";
      return;
    }

    let queued = false;
    const apply = () => {
      queued = false;
      const out = progress(window.scrollY, 380, 720);
      el.style.opacity = (1 - out).toFixed(3);
      el.style.pointerEvents = out > 0.9 ? "none" : "";
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enabled]);

  return ref;
}
