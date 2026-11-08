import type { ReactNode } from "react";
import { SUPPORT_EMAIL } from "../config";
import { trackEvent } from "../analytics";
import { usePageMeta } from "../lib/seo";
import { Container, SectionHeading, Lead } from "./ui/Section";

/*
 * /support — the App Store listing's Support URL.
 *
 * Every answer here was checked against the v5 app (release/v5): the Settings
 * groups, the Pro Pass screen and the track's overflow menu. If a menu label
 * changes in the app, change it here too; a support page that names a button
 * that isn't there is worse than none.
 */

interface QA {
  q: string;
  a: ReactNode;
}

interface Group {
  id: string;
  label: string;
  items: QA[];
}

/** An in-app path, set so it reads as something to tap rather than prose. */
function Path({ children }: { children: ReactNode }) {
  return <span className="support-path">{children}</span>;
}

const GROUPS: Group[] = [
  {
    id: "tracking",
    label: "Tracking",
    items: [
      {
        q: "My track stopped partway through the day.",
        a: (
          <>
            <p>
              Tracked Out records with your screen off, which needs location access set to Always. In the iPhone
              Settings app, find Tracked Out, tap <Path>Location</Path> and choose <Path>Always</Path>, with Precise
              Location on.
            </p>
            <p>
              While you're tracking, don't swipe the app away in the app switcher. iOS stops location for an app
              that's been force-quit, and the track stops with it.
            </p>
          </>
        ),
      },
      {
        q: "Does it work without cell service?",
        a: (
          <p>
            Yes. GPS doesn't need a signal, so tracking keeps recording in dead zones and in the backcountry. The map
            underneath needs data to load unless you downloaded it ahead of time; offline maps come with the Pro Pass.
          </p>
        ),
      },
      {
        q: "How do I keep my battery going all day?",
        a: (
          <p>
            Start tracking at the first chair, then put the phone away. Tracking is built to run in the background
            with the screen off. Cold is the bigger drain: an inside pocket, close to your body, keeps the battery
            warm enough to last.
          </p>
        ),
      },
      {
        q: "A run or lift ride landed in the wrong place.",
        a: (
          <p>
            Runs are found from your elevation, so a long traverse or a slow cat track can now and then end up on the
            wrong side of the line. Open the track, tap the <Path>•••</Path> menu and choose{" "}
            <Path>Recalculate Track</Path>. If it's still wrong, tell us about it from{" "}
            <Path>Settings → Support → Report a bug</Path> and we'll take a look.
          </p>
        ),
      },
      {
        q: "The track has the wrong resort.",
        a: (
          <p>
            Open the track, tap the <Path>•••</Path> menu and choose <Path>Change Resort</Path>. If you drove home
            with tracking still on, <Path>Trim Track</Path> in the same menu cuts off the end.
          </p>
        ),
      },
      {
        q: "Can my tracks go to Apple Health?",
        a: (
          <p>
            Yes. Turn it on under <Path>Settings → Permissions → Apple Health</Path>, and each track is saved as a
            downhill skiing workout.
          </p>
        ),
      },
    ],
  },
  {
    id: "pro-pass",
    label: "Pro Pass",
    items: [
      {
        q: "What does the Pro Pass add?",
        a: (
          <p>
            Tracking is free. The Pro Pass is a yearly subscription that adds deeper metrics, technique
            recommendations, offline maps and more. There's a family version, too.
          </p>
        ),
      },
      {
        q: "I paid, but the app doesn't show Pro.",
        a: (
          <p>
            Open the Pro Pass screen in the app and tap <Path>Restore Purchases</Path>. Make sure the iPhone is signed
            in to the same Apple Account you bought it with.
          </p>
        ),
      },
      {
        q: "How do I cancel or change my subscription?",
        a: (
          <p>
            Apple handles the billing, so subscriptions live in your Apple Account. In Tracked Out, go to{" "}
            <Path>Settings → Pro Pass → Manage subscription</Path>, or in the iPhone Settings app tap your name, then{" "}
            <Path>Subscriptions</Path>. Refunds go through Apple at{" "}
            <a href="https://reportaproblem.apple.com" target="_blank" rel="noopener noreferrer">
              reportaproblem.apple.com
            </a>
            .
          </p>
        ),
      },
      {
        q: "I have an offer or gift code.",
        a: (
          <p>
            Go to <Path>Settings → Pro Pass → Redeem a code</Path> and enter it there.
          </p>
        ),
      },
    ],
  },
  {
    id: "your-data",
    label: "Your tracks",
    items: [
      {
        q: "Where are my tracks stored? Do I need an account?",
        a: (
          <p>
            Your tracks are stored on your iPhone. There's no account to make and nothing to sign in to.
          </p>
        ),
      },
      {
        q: "I'm getting a new phone. Will my tracks come with me?",
        a: (
          <p>
            Yes, if you move to the new phone from a backup. Your tracks are part of your iPhone's iCloud or computer
            backup, so restoring it brings them along. Deleting the app deletes the tracks on that phone, so don't
            remove it before the new phone is set up.
          </p>
        ),
      },
      {
        q: "Can I export a track?",
        a: (
          <p>
            Open the track, tap the <Path>•••</Path> menu and choose <Path>Export as GPX</Path>. Most mapping and
            fitness apps can open the file.
          </p>
        ),
      },
      {
        q: "How do I delete a track?",
        a: (
          <p>
            Open the track, tap the <Path>•••</Path> menu and choose <Path>Delete Track</Path>. It's gone for good,
            so export it first if you might want it back.
          </p>
        ),
      },
    ],
  },
];

const mail = (subject?: string) =>
  `mailto:${SUPPORT_EMAIL}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;

export function Support() {
  usePageMeta({
    title: "Support",
    description:
      "Help with Tracked Out: tracking that stops, battery, the Pro Pass, moving to a new phone and exporting your tracks. Or email us.",
  });

  return (
    <main>
      <section className="support-hero" style={{ padding: "152px var(--gutter) 72px" }}>
        <Container>
          <p className="support-eyebrow">SUPPORT</p>
          <SectionHeading>Stuck on the hill?</SectionHeading>
          <Lead>
            The common questions are answered below. If yours isn't, email us. The person who built Tracked Out reads
            every message.
          </Lead>

          <div className="support-contact">
            <a
              className="support-card support-card--dark"
              href={mail("Help")}
              onClick={() => trackEvent("support_click", { topic: "Support page email" })}
            >
              <span className="support-card__label">EMAIL</span>
              <span className="support-card__title">{SUPPORT_EMAIL}</span>
              <span className="support-card__body">
                Tell us your iPhone model and the Tracked Out version. The version is at the bottom of Settings in the
                app.
              </span>
            </a>
            <div className="support-card">
              <span className="support-card__label">FROM THE APP</span>
              <span className="support-card__title">Settings → Support</span>
              <span className="support-card__body">
                Report a bug, suggest a feature or ask a question without leaving the app.
              </span>
            </div>
          </div>
        </Container>
      </section>

      <section style={{ padding: "8px var(--gutter) 104px" }}>
        <Container>
          <nav className="support-jump" aria-label="Support topics">
            {GROUPS.map((g) => (
              <a key={g.id} href={`#${g.id}`}>
                {g.label}
              </a>
            ))}
          </nav>

          {GROUPS.map((g) => (
            <div key={g.id} id={g.id} className="support-group">
              <h3 className="support-group__title">{g.label}</h3>
              <div>
                {g.items.map((item) => (
                  <details key={item.q} className="support-qa">
                    <summary>{item.q}</summary>
                    <div className="support-qa__a">{item.a}</div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </Container>
      </section>

      <section style={{ padding: "56px var(--gutter)", background: "var(--ink)", color: "#fff" }}>
        <Container style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          <div>
            <h2 className="support-band__title">Still stuck?</h2>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.5, color: "var(--muted-warm)", maxWidth: 520 }}>
              Send what happened and roughly when. A screenshot helps.
            </p>
          </div>
          <a
            className="support-band__cta"
            href={mail("Help")}
            onClick={() => trackEvent("support_click", { topic: "Support page band" })}
          >
            Email support
          </a>
        </Container>
      </section>
    </main>
  );
}
