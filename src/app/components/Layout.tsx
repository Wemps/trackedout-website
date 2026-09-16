import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { trackPageView } from "../analytics";

function RouteEffects() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    // Anchor links inside the page handle their own scrolling; only reset on a
    // genuine route change.
    if (!hash) window.scrollTo(0, 0);
    trackPageView(pathname);
  }, [pathname, hash]);
  return null;
}

export function Layout() {
  return (
    <div id="top" style={{ width: "100%", background: "var(--surface)", overflowX: "clip", position: "relative" }}>
      <RouteEffects />
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
