/**
 * The crew shown in the Crew section — one list feeding both the roster card and
 * the pins on the map, so the two can never disagree about who is on the hill.
 *
 * Positions are illustrative, placed on real runs at Crystal Mountain, WA to
 * match the day-pass card's "Crystal Mountain" and the demo's "Rainier Express".
 */
export type CrewTone = "lime" | "teal" | "magenta" | "mint";

export interface CrewMember {
  name: string;
  tone: CrewTone;
  /** Last-seen label. */
  seen: string;
  /** Whether they're moving now — drives the green "now" styling. */
  fresh: boolean;
  /** [lng, lat] */
  position: [number, number];
}

export const CREW: CrewMember[] = [
  // Two still moving, high on the mountain; Dana drifting down; Papa parked near
  // the base forty minutes ago, which is the story the roster card tells.
  // Kept west of centre so they clear the roster card, which sits top-right.
  { name: "Elroy", tone: "lime", seen: "now", fresh: true, position: [-121.4975, 46.9355] },
  { name: "Britt", tone: "teal", seen: "now", fresh: true, position: [-121.5005, 46.9315] },
  { name: "Dana", tone: "magenta", seen: "3m", fresh: false, position: [-121.487, 46.9295] },
  { name: "Papa", tone: "mint", seen: "41m", fresh: false, position: [-121.502, 46.9265] },
];

export const CREW_AVATARS: Record<CrewTone, string> = {
  lime: "linear-gradient(135deg,#FFFA00,#C6EE7A)",
  teal: "linear-gradient(135deg,#43EDEA,#A048FA)",
  magenta: "linear-gradient(135deg,#FF02E6,#FFFA00)",
  mint: "linear-gradient(135deg,#C6EE7A,#43EDEA)",
};
