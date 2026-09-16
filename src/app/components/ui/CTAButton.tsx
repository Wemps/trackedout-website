import { appStoreURL } from "../../config";
import { trackEvent } from "../../analytics";
import { AppleGlyph } from "./AppleGlyph";

interface Props {
  /** `primary` on light backgrounds, `inverted` on the brand-gradient band. */
  variant?: "primary" | "inverted";
  /** GA4 element-level attribution, e.g. `hero` / `footer_band`. */
  placement: string;
  /** Apple campaign token — page-granular, see config.ts. */
  campaign?: string;
  label?: string;
  className?: string;
}

export function CTAButton({
  variant = "primary",
  placement,
  campaign = "webLanding",
  label = "Download now",
  className = "",
}: Props) {
  return (
    <a
      href={appStoreURL(campaign)}
      target="_blank"
      rel="noopener noreferrer"
      className={`cta cta--${variant} ${className}`}
      onClick={() => trackEvent("app_store_click", { placement })}
    >
      <span className="cta__sheen" aria-hidden="true" />
      <AppleGlyph />
      <span style={{ position: "relative" }}>{label}</span>
    </a>
  );
}
