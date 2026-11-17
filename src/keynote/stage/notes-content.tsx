import type { Scene } from "@/deck/types";
import { cn } from "@/lib/utils";

function Block({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("space-y-2", className)}>
      <h3 className="text-xs font-semibold tracking-[0.16em] text-zinc-400 uppercase">{title}</h3>
      {children}
    </section>
  );
}

/** Presenter notes for a scene, shared by the in-window panel and the presenter window. */
export function NotesContent({ scene, step, large = false }: { scene: Scene; step: number; large?: boolean }) {
  const n = scene.notes;
  const text = large ? "text-[17px] leading-relaxed" : "text-[15px] leading-relaxed";
  return (
    <div className="space-y-5">
      <Block title="Key talking points">
        <ul className={cn("list-disc space-y-1.5 pl-5 text-zinc-100", text)}>
          {n.talk.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </Block>
      {n.demo?.length ? (
        <Block title="During the demo">
          <ol className={cn("space-y-1.5", text)}>
            {n.demo.map((t, i) => (
              <li
                key={t}
                className={cn(
                  "rounded-md px-2 py-1",
                  i === step ? "bg-white/12 text-white" : i < step ? "text-zinc-400" : "text-zinc-200",
                )}
                aria-current={i === step ? "step" : undefined}
              >
                <span className="mr-2 font-semibold tabular text-zinc-400">{i + 1}.</span>
                {t}
              </li>
            ))}
          </ol>
        </Block>
      ) : null}
      {n.benefit ? (
        <Block title="Developer benefit">
          <p className={cn("font-semibold text-white", text)}>{n.benefit}</p>
        </Block>
      ) : null}
      {n.tech?.length ? (
        <Block title="Technical details">
          <ul className={cn("list-disc space-y-1.5 pl-5 text-zinc-300", text)}>
            {n.tech.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </Block>
      ) : null}
      {n.transition ? (
        <Block title="Transition">
          <p className={cn("text-zinc-200 italic", text)}>{n.transition}</p>
        </Block>
      ) : null}
    </div>
  );
}
