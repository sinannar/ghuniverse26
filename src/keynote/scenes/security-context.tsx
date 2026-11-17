import { AlertTriangle, ArrowUpRight, Clock3, PackageSearch, ShieldAlert, type LucideIcon } from "lucide-react";
import {
  CHAINDROP_PACKAGES,
  GITHUB_CNA_PUBLICATIONS,
  SECURITY_INCIDENTS,
  SECURITY_SOURCES,
  THIRD_PARTY_BREACHES,
} from "@/data/security-context";
import type { Source } from "@/deck/types";
import { Kicker } from "@/kit/ui";
import type { SceneProps } from "@/scenes/scene-types";

const INCIDENT_ICONS = {
  "Shai-Hulud": AlertTriangle,
  Megalodon: Clock3,
  AsyncAPI: PackageSearch,
} satisfies Record<(typeof SECURITY_INCIDENTS)[number]["name"], LucideIcon>;

function SourceLink({ source, preview }: { source: Source; preview?: boolean }) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={preview ? -1 : undefined}
      className="kn-focus inline-flex items-center gap-1.5 font-semibold text-orange-200 underline decoration-orange-300/50 underline-offset-4"
    >
      {source.label}
      <ArrowUpRight className="size-[18px]" aria-hidden="true" />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

export function SecurityCveScene({ preview }: SceneProps) {
  const max = Math.max(...GITHUB_CNA_PUBLICATIONS.map((point) => point.count));
  const [, , , previous, latest] = GITHUB_CNA_PUBLICATIONS;
  const increase = Math.round(((latest.count - previous.count) / previous.count) * 100);
  return (
    <div className="absolute inset-0 overflow-hidden px-[112px] pt-[62px]">
      <ShieldAlert aria-hidden="true" className="absolute top-[48px] right-[112px] size-[120px] text-orange-400/15" />
      <Kicker>Security · the exposure</Kicker>
      <h2 className="mt-4 text-[82px] leading-[1.02] font-semibold tracking-[-0.04em] text-white">
        Vulnerability disclosures are surging.
      </h2>
      <p className="mt-4 text-[28px] text-zinc-300">
        More public records to triage. More dependencies to verify.
      </p>

      <div className="mt-9 grid grid-cols-[1.35fr_0.65fr] gap-8">
        <figure className="relative h-[575px] overflow-hidden rounded-[26px] border border-white/12 bg-[#101014]/90 px-9 pt-7">
          <figcaption className="flex items-center justify-between gap-4 text-[23px] font-semibold tracking-[0.12em] text-zinc-300 uppercase">
            <span>CVE records published by GitHub's CNA</span>
            <span className="shrink-0 tracking-normal text-orange-200">+{increase}% vs {previous.year}</span>
          </figcaption>
          <div
            aria-hidden="true"
            className="absolute top-[112px] right-9 bottom-[94px] left-9 opacity-50"
            style={{ backgroundImage: "repeating-linear-gradient(to top, rgba(255,255,255,.12) 0 1px, transparent 1px 78px)" }}
          />
          <ol aria-label="CVE records published by GitHub's CNA by year" className="relative mt-5 grid h-[390px] grid-cols-5 items-end gap-5">
            {GITHUB_CNA_PUBLICATIONS.map((point) => (
              <li key={point.year} data-cve-year={point.year} className="flex h-full flex-col items-center justify-end">
                <strong className="mb-3 text-[31px] font-semibold text-white tabular">
                  {point.count.toLocaleString("en-US")}
                </strong>
                <span
                  data-chart-bar=""
                  aria-hidden="true"
                  className={point.year === 2025
                    ? "w-[112px] rounded-t-xl bg-gradient-to-t from-orange-700 to-amber-300"
                    : "w-[112px] rounded-t-xl bg-gradient-to-t from-orange-900 to-orange-400"}
                  style={{ height: `${(point.count / max) * 295}px` }}
                />
                <span className="mt-3 text-[27px] font-semibold text-white">{point.year}</span>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-[20px] text-zinc-300">
            <SourceLink source={SECURITY_SOURCES.cve} preview={preview} /> · GitHub's CVE Numbering Authority only
          </p>
          <p className="mt-1 text-[19px] text-zinc-300">
            Not all CVEs; published records do not establish exploitation.
          </p>
        </figure>

        <aside className="flex h-[575px] flex-col rounded-[26px] border border-orange-400/35 bg-orange-950/25 p-9">
          <PackageSearch aria-hidden="true" className="size-[60px] text-orange-300" />
          <p className="mt-7 text-[22px] font-semibold tracking-[0.15em] text-orange-200 uppercase">
            A real supply-chain attack
          </p>
          <p className="mt-5 text-[79px] leading-none font-bold tracking-[-0.045em] text-white tabular">
            {CHAINDROP_PACKAGES.moreThan.toLocaleString("en-US")}+
          </p>
          <p className="mt-4 text-[31px] leading-tight font-semibold text-zinc-100">
            npm packages affected
          </p>
          <p className="mt-5 text-[23px] leading-snug text-zinc-300">
            Microsoft’s August 2026 ChainDrop investigation describes a credential-stealing worm that spreads through package installs.
          </p>
          <p className="mt-auto text-[21px]">
            <SourceLink source={SECURITY_SOURCES.chainDrop} preview={preview} />
          </p>
        </aside>
      </div>
    </div>
  );
}

export function SecuritySupplyChainScene({ preview }: SceneProps) {
  const max = Math.max(...THIRD_PARTY_BREACHES.map((point) => point.percent));
  return (
    <div className="absolute inset-0 overflow-hidden px-[112px] pt-[62px]">
      <Kicker>Security · the supply chain</Kicker>
      <h2 className="mt-4 text-[78px] leading-[1.02] font-semibold tracking-[-0.04em] text-white">
        The tools we trust can become the attack.
      </h2>
      <p className="mt-4 text-[28px] text-zinc-300">
        Poisoned dependencies and workflows can execute now—or wait for a trigger.
      </p>

      <div className="mt-9 grid grid-cols-[590px_1fr] gap-8">
        <figure className="flex h-[610px] flex-col rounded-[26px] border border-white/12 bg-[#101014]/90 px-8 py-7">
          <figcaption className="text-[24px] leading-snug font-semibold text-white">
            Breaches involving a third party
          </figcaption>
          <p className="mt-2 text-[20px] text-zinc-400">Share of Verizon’s analyzed breaches · report edition</p>
          <ol aria-label="Third-party involvement in analyzed breaches" className="mt-5 grid h-[315px] grid-cols-3 items-end gap-5">
            {THIRD_PARTY_BREACHES.map((point) => (
              <li key={point.edition} data-dbir-edition={point.edition} className="flex h-full flex-col items-center justify-end">
                <strong className="mb-3 text-[42px] font-semibold text-white tabular">{point.display}</strong>
                <span
                  data-chart-bar=""
                  aria-hidden="true"
                  className={point.edition === 2026
                    ? "w-[110px] rounded-t-xl bg-gradient-to-t from-orange-700 to-amber-300"
                    : "w-[110px] rounded-t-xl bg-gradient-to-t from-orange-900 to-orange-400"}
                  style={{ height: `${(point.percent / max) * 210}px` }}
                />
                <span className="mt-3 text-[25px] font-semibold text-white">{point.edition}</span>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-[19px] leading-snug text-zinc-300">
            Third party includes vendors and partners—not only software dependencies. Samples differ; this is not a global census.
          </p>
          <p className="mt-auto flex flex-wrap gap-x-5 text-[19px]">
            <SourceLink source={SECURITY_SOURCES.dbir2025} preview={preview} />
            <SourceLink source={SECURITY_SOURCES.dbir2026} preview={preview} />
          </p>
        </figure>

        <section aria-label="Recent supply-chain incidents" className="min-w-0">
          <p className="flex items-center gap-3 text-[22px] font-semibold tracking-[0.14em] text-orange-200 uppercase">
            <Clock3 className="size-7" aria-hidden="true" /> Real attacks · instant to time bomb
          </p>
          <ol className="mt-4 space-y-3">
            {SECURITY_INCIDENTS.map((incident) => {
              const Icon = INCIDENT_ICONS[incident.name];
              return (
                <li key={incident.name} className="flex h-[168px] items-start gap-5 rounded-[20px] border border-white/12 bg-[#101014]/90 px-6 py-5">
                  <Icon aria-hidden="true" className="mt-1 size-9 shrink-0 text-orange-300" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[19px] font-semibold tracking-[0.12em] text-orange-200">
                      {incident.date} · {incident.name}
                    </p>
                    <p className="mt-1 text-[28px] leading-tight font-semibold text-white">{incident.impact}</p>
                    <p className="mt-1 text-[21px] leading-snug text-zinc-300">{incident.trigger}</p>
                  </div>
                  <span className="shrink-0 text-[19px]">
                    <SourceLink source={incident.source} preview={preview} />
                  </span>
                </li>
              );
            })}
          </ol>
        </section>
      </div>

    </div>
  );
}
