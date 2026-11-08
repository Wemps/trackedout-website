import { useState, type FormEvent } from "react";
import { SUPPORT_EMAIL } from "../config";
import { trackEvent } from "../analytics";
import { usePageMeta } from "../lib/seo";
import { Container, SectionHeading, Lead } from "./ui/Section";

/*
 * /support — the App Store listing's Support URL.
 *
 * The site has no backend, so the form composes an email: Send opens the
 * visitor's mail app with the topic, message and device details filled in,
 * addressed to SUPPORT_EMAIL. Swapping in a form service later only changes
 * `onSubmit`.
 */

const TOPICS = ["A question", "Something's broken", "A feature idea", "Pro Pass or billing"];

export function Support() {
  usePageMeta({
    title: "Support",
    description: "Get help with Tracked Out. Send us a message and the person who built the app will write back.",
  });

  const [topic, setTopic] = useState(TOPICS[0]);
  const [message, setMessage] = useState("");
  const [device, setDevice] = useState("");
  const [opened, setOpened] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const body = [message.trim(), "", device.trim() ? `iPhone and app version: ${device.trim()}` : ""]
      .join("\n")
      .trim();
    const href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`Tracked Out: ${topic}`)}&body=${encodeURIComponent(body)}`;
    trackEvent("support_click", { topic: `Support form: ${topic}` });
    window.location.href = href;
    setOpened(true);
  };

  return (
    <main>
      <section className="support-hero" style={{ padding: "152px var(--gutter) 104px" }}>
        <Container style={{ maxWidth: 720 }}>
          <p className="support-eyebrow">SUPPORT</p>
          <SectionHeading>Stuck on the hill?</SectionHeading>
          <Lead>
            Tell us what's going on. The person who built Tracked Out reads every message and writes back.
          </Lead>

          <form className="support-form" onSubmit={onSubmit}>
            <label className="support-field">
              <span>What's it about?</span>
              <select value={topic} onChange={(e) => setTopic(e.target.value)}>
                {TOPICS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>

            <label className="support-field">
              <span>Message</span>
              <textarea
                required
                rows={7}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What happened, and roughly when?"
              />
            </label>

            <label className="support-field">
              <span>
                iPhone and app version <em>optional</em>
              </span>
              <input
                type="text"
                value={device}
                onChange={(e) => setDevice(e.target.value)}
                placeholder="iPhone 16, Tracked Out 5.0"
              />
              <small>The app version is at the bottom of Settings in Tracked Out.</small>
            </label>

            <div className="support-form__foot">
              <button type="submit" className="support-send">
                Send
              </button>
              <p>
                {opened ? (
                  <>Your mail app should be open with this filled in. If it isn't, email </>
                ) : (
                  <>Opens your mail app with this filled in. Or email </>
                )}
                <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
              </p>
            </div>
          </form>

          <p className="support-aside">
            Already in the app? <strong>Settings → Support</strong> lets you report a bug, suggest a feature or ask a
            question without leaving it.
          </p>
        </Container>
      </section>
    </main>
  );
}
