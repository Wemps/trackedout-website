import type { AnchorHTMLAttributes } from "react";
import { Link, useLocation } from "react-router";

/*
 * The header and footer anchors were written for a one-page site: "#day" only
 * means something on the landing page. On any other route this sends them back
 * to "/#day" (Layout scrolls to the section once the landing page renders), and
 * "/support"-style paths go through the router rather than a full reload, which
 * on GitHub Pages would bounce through the 404 shim.
 *
 * Anything else (mailto:, https:) is a plain anchor.
 */
export function SiteLink({ href, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const { pathname } = useLocation();

  if (href.startsWith("#")) {
    return pathname === "/" ? <a href={href} {...rest} /> : <Link to={`/${href}`} {...rest} />;
  }
  if (href.startsWith("/")) {
    return <Link to={href} {...rest} />;
  }
  return <a href={href} {...rest} />;
}
