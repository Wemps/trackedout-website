import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Landing } from "./components/Landing";
import { NotFound } from "./components/NotFound";

/*
 * The design is a single page. The router is here so the legal pages the App Store
 * listing will need can be added without restructuring — same shape as the Signal
 * Cab site.
 */

/*
 * Where the site is mounted.
 *
 * A GitHub Pages project site always serves the repo from its own path segment
 * (wemps.github.io/trackedout-website/), so routes declared as "/" match nothing
 * there and every request falls through to NotFound. Everywhere else — dev, and
 * trackedout.app once DNS moves — the site is at the root.
 *
 * Read from the URL rather than baked in so the same build serves both. Vite's
 * BASE_URL is no help here: the base is relative (see vite.config.ts), which is
 * what makes the assets portable but leaves no absolute path to hand the router.
 */
const basename = location.hostname.endsWith(".github.io")
  ? `/${location.pathname.split("/")[1]}`
  : "/";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: Layout,
      children: [
        { index: true, Component: Landing },
        { path: "*", Component: NotFound },
      ],
    },
  ],
  { basename },
);
