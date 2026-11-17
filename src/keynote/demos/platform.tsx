import type { ReactNode } from "react";
import { motion } from "motion/react";
import { Building2, Check, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VisualProps } from "@/scenes/scene-types";
import { EASE_OUT } from "@/kit/motion";
import { Bar, Panel, Pop } from "@/kit/bits";

/* =================================================================== Copilot in GitHub Enterprise */

function EnterpriseVisual({ step }: VisualProps) {
  const after = step >= 1;
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center gap-3 text-[18px] font-semibold">
        <span className={cn("rounded-full px-4 py-1.5", !after ? "bg-white text-zinc-950" : "text-zinc-300")}>Before</span>
        <span className={cn("rounded-full px-4 py-1.5", after ? "bg-white text-zinc-950" : "text-zinc-300")}>Now</span>
      </div>
      {!after ? (
        <div className="grid min-h-0 flex-1 grid-cols-2 gap-4">
          <Panel title="GitHub Enterprise licenses" bodyClassName="p-5">
            <Building2 className="size-10 text-[var(--accent-text)]" aria-hidden="true" />
            <p className="mt-3 text-[20px] text-zinc-100">Every developer licensed</p>
          </Panel>
          <Panel title="Copilot seats, bought separately" bodyClassName="p-5">
            <div className="grid grid-cols-8 gap-1.5" aria-hidden="true">
              {Array.from({ length: 40 }).map((_, i) => (
                <span key={i} className={cn("h-5 rounded", i % 7 === 3 || i > 33 ? "bg-white/10" : "bg-sky-500/70")} />
              ))}
            </div>
            <p className="mt-4 text-[18px] text-zinc-200">Seats to count, plus AI usage to track on top</p>
            <Bar value={0.62} className="mt-3" label="AI usage" />
          </Panel>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col gap-4">
          <motion.div
            className="rounded-[22px] border border-[var(--accent-hex)] bg-[#06131c] p-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ease: EASE_OUT }}
          >
            <p className="flex items-center gap-3 text-[26px] font-semibold text-white">
              <Users className="size-7 text-[var(--accent-text)]" aria-hidden="true" />
              Copilot included with GitHub Enterprise for every licensed user
            </p>
            <p className="mt-2 text-[19px] text-zinc-200">Same features and models as Copilot Enterprise: the Copilot app, code review, automations and more.</p>
            <div className="mt-5">
              <div className="flex justify-between text-[17px] text-zinc-200">
                <span>AI usage metered from the first request</span>
                <span>enterprise budget</span>
              </div>
              <div className="relative mt-2">
                <Bar value={0.46} label="AI usage against the enterprise budget" />
                <span aria-hidden="true" className="absolute -top-1.5 h-5 w-0.5 bg-white" style={{ left: "80%" }} />
              </div>
            </div>
          </motion.div>
          <Pop show={step >= 2} className="grid grid-cols-3 gap-3">
            {[
              "Policies, alerts and attribution you already have",
              "Completions and next edit suggestions work with no budget",
              "Running out of budget never removes the seat",
            ].map((t) => (
              <div key={t} className="flex gap-3 rounded-2xl border border-white/12 bg-[#101115] p-4 text-[17px] leading-snug text-zinc-100">
                <Check className="size-5 shrink-0 text-emerald-300" aria-hidden="true" />
                {t}
              </div>
            ))}
          </Pop>
        </div>
      )}
    </div>
  );
}

/* =================================================================== Router */

export default function PlatformVisuals(props: VisualProps): ReactNode {
  switch (props.id) {
    case "enterprise-copilot":
      return <EnterpriseVisual {...props} />;
    default:
      return <div className="flex h-full items-center justify-center text-[22px] text-zinc-300">{props.id}</div>;
  }
}
