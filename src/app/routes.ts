import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Landing } from "./components/Landing";
import { NotFound } from "./components/NotFound";

/*
 * The design is a single page. The router is here so the legal pages the App Store
 * listing will need can be added without restructuring — same shape as the Signal
 * Cab site.
 */
export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Landing },
      { path: "*", Component: NotFound },
    ],
  },
]);
