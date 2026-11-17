import { useEffect, useRef, useState, type FormEvent } from "react";
import { HardDrive } from "lucide-react";
import { useDeck } from "@/deck/deck-store";
import { focusStage } from "@/kit/focus";
import { EMPTY_PROFILE, usePresenterProfile, type PresenterProfile } from "@/deck/presenter-profile";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { LiveStatus } from "@/components/live-status";

const FIELDS: { key: keyof PresenterProfile; label: string; placeholder: string; type?: string }[] = [
  { key: "name", label: "Name", placeholder: "Your name" },
  { key: "role", label: "Role", placeholder: "Your role or title" },
  { key: "organization", label: "Organization", placeholder: "Company or community" },
];

/** E: the speaker's name, role and organization for the opening scene. */
export function ProfileDialog() {
  const open = useDeck((s) => s.profileOpen);
  const setOpen = useDeck((s) => s.setProfileOpen);
  const profile = usePresenterProfile((s) => s.profile);
  const load = usePresenterProfile((s) => s.load);
  const saveError = usePresenterProfile((s) => s.saveError);
  const savedCount = usePresenterProfile((s) => s.savedCount);
  const save = usePresenterProfile((s) => s.save);
  const [draft, setDraft] = useState<PresenterProfile>(profile);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setDraft(profile);
  }, [open, profile]);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const ok = save(draft);
    if (ok) setOpen(false);
  };

  return (
    <>
      <LiveStatus>{savedCount > 0 ? `Presenter details saved. Save ${savedCount} completed.` : ""}</LiveStatus>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="dark max-w-lg border-white/15 bg-[#0d0e12] text-zinc-100"
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            nameRef.current?.focus();
          }}
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            focusStage(useDeck.getState().explore);
          }}
        >
          <form onSubmit={submit} className="grid gap-4">
            <DialogHeader>
              <DialogTitle className="text-xl text-white">Presenter details</DialogTitle>
              <DialogDescription className="text-zinc-300">
                Shown on the opening scene as "Presented by". Leave a field empty to hide it.
              </DialogDescription>
            </DialogHeader>
            {load === "unreadable" ? (
              <p role="alert" className="rounded-md border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-sm text-amber-100">
                Saved presenter details couldn't be loaded, so they won't be overwritten. Changes stay on this page only.
              </p>
            ) : null}
            {saveError ? (
              <p role="alert" className="rounded-md border border-red-400/40 bg-red-400/10 px-3 py-2 text-sm text-red-100">
                Your latest changes couldn't be saved in this browser. Keep this page open to avoid losing them.
              </p>
            ) : null}
            <div className="grid gap-3">
              {FIELDS.map((f) => (
                <div key={f.key} className="grid gap-1.5">
                  <Label htmlFor={`profile-${f.key}`} className="text-zinc-200">
                    {f.label}
                  </Label>
                  <Input
                    id={`profile-${f.key}`}
                    ref={f.key === "name" ? nameRef : undefined}
                    type={f.type ?? "text"}
                    value={draft[f.key]}
                    placeholder={f.placeholder}
                    maxLength={160}
                    autoComplete="off"
                    onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
                    className="border-white/20 bg-white/5 text-white placeholder:text-zinc-400"
                  />
                </div>
              ))}
            </div>
            <Collapsible className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2">
              <CollapsibleTrigger className="flex w-full items-center gap-2 text-left text-sm font-medium text-zinc-200 focus-visible:outline-2 focus-visible:outline-white">
                <HardDrive className="size-4" aria-hidden="true" />
                Stored in this browser
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2 text-sm leading-relaxed text-zinc-300">
                These details stay in this browser only. They aren't shared with other people, aren't synced to other
                browsers or devices, are visible to anyone using this browser profile, and are removed if browser data
                is cleared.
              </CollapsibleContent>
            </Collapsible>
            <DialogFooter className="gap-2">
              <Button type="button" variant="ghost" className="text-zinc-200" onClick={() => setDraft(EMPTY_PROFILE)}>
                Clear
              </Button>
              <Button type="button" variant="outline" className="border-white/20 bg-transparent text-white" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
