import { create } from "zustand";
import { RECORDS_KEY } from "@/deck/storage-keys";

// The speaker's own details for the opening scene. Saved in this
// browser only (localStorage, versioned), never sent anywhere.

export interface PresenterProfile {
  name: string;
  role: string;
  organization: string;
  email: string;
  link: string;
}

export const EMPTY_PROFILE: PresenterProfile = { name: "", role: "", organization: "", email: "", link: "" };

interface StoredV1 {
  version: 1;
  presenter: PresenterProfile;
}

type LoadState = "ready" | "unavailable" | "unreadable";

interface ProfileState {
  profile: PresenterProfile;
  load: LoadState;
  /** Last save failed; edits are kept in memory only. */
  saveError: boolean;
  savedCount: number;
  save: (next: PresenterProfile) => boolean;
  reload: () => void;
}

const FIELDS: (keyof PresenterProfile)[] = ["name", "role", "organization", "email", "link"];

function sanitize(input: unknown): PresenterProfile | null {
  if (!input || typeof input !== "object") return null;
  const src = input as Record<string, unknown>;
  const out = { ...EMPTY_PROFILE };
  for (const f of FIELDS) {
    const v = src[f];
    if (v === undefined) continue;
    if (typeof v !== "string") return null;
    out[f] = v.slice(0, 160);
  }
  return out;
}

function readStored(): { state: LoadState; profile: PresenterProfile } {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(RECORDS_KEY);
  } catch {
    return { state: "unavailable", profile: EMPTY_PROFILE };
  }
  if (!raw) return { state: "ready", profile: EMPTY_PROFILE };
  try {
    const parsed = JSON.parse(raw) as Partial<StoredV1> & Record<string, unknown>;
    // Version 1 payload, or an unversioned profile object read as the oldest version.
    const candidate = parsed && parsed.version === 1 ? parsed.presenter : parsed;
    const profile = sanitize(candidate);
    if (!profile) return { state: "unreadable", profile: EMPTY_PROFILE };
    return { state: "ready", profile };
  } catch {
    return { state: "unreadable", profile: EMPTY_PROFILE };
  }
}

export const usePresenterProfile = create<ProfileState>((set, get) => {
  const initial = typeof window === "undefined" ? { state: "ready" as LoadState, profile: EMPTY_PROFILE } : readStored();
  return {
    profile: initial.profile,
    load: initial.state,
    saveError: false,
    savedCount: 0,
    save: (next) => {
      const clean = sanitize(next) ?? EMPTY_PROFILE;
      // Never overwrite saved data we could not read.
      const fresh = readStored();
      if (fresh.state === "unreadable" || get().load === "unreadable") {
        set({ profile: clean, saveError: true });
        return false;
      }
      try {
        const payload: StoredV1 = { version: 1, presenter: clean };
        window.localStorage.setItem(RECORDS_KEY, JSON.stringify(payload));
        set((s) => ({ profile: clean, saveError: false, load: "ready", savedCount: s.savedCount + 1 }));
        return true;
      } catch {
        set({ profile: clean, saveError: true });
        return false;
      }
    },
    reload: () => {
      const fresh = readStored();
      if (fresh.state === "ready") set({ profile: fresh.profile, load: "ready" });
      else set({ load: fresh.state });
    },
  };
});

/** Keep the profile in sync when another tab or the presenter window saves it. */
export function subscribeProfileStorage(): () => void {
  const onStorage = (e: StorageEvent) => {
    if (e.key === RECORDS_KEY) usePresenterProfile.getState().reload();
  };
  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}

export function hasProfile(p: PresenterProfile): boolean {
  return p.name.trim().length > 0;
}
