import type { Source } from "@/deck/types";

// NVD publication-date counts, including records later rejected. Snapshot:
// 17 November 2026, 03:24 UTC. The 2026 figure is a partial year.
export const CVE_PUBLICATIONS = [
  { year: 2022, count: 26_431 },
  { year: 2023, count: 30_949 },
  { year: 2024, count: 40_704 },
  { year: 2025, count: 49_972 },
  { year: 2026, count: 101_000 },
] as const;

// Share of analyzed breaches involving a third party, by DBIR report edition.
export const THIRD_PARTY_BREACHES = [
  { edition: 2024, percent: 15, display: "~15%" },
  { edition: 2025, percent: 30, display: "30%" },
  { edition: 2026, percent: 48, display: "48%" },
] as const;

export const MALICIOUS_PACKAGES_2025 = { minimum: 454_600 } as const;

export const SECURITY_SOURCES = {
  cve: {
    label: "NVD via Christensen",
    url: "https://danielchristensen.no/en/tools/cve-statistics",
  },
  packages: {
    label: "Sonatype 2026",
    url: "https://www.sonatype.com/state-of-the-software-supply-chain/2026/open-source-malware",
  },
  dbir2025: {
    label: "Verizon 2025 DBIR",
    url: "https://www.verizon.com/about/news/2025-data-breach-investigations-report",
  },
  dbir2026: {
    label: "Verizon 2026 DBIR",
    url: "https://www.verizon.com/business/resources/Tc48/reports/2026-dbir-data-breach-investigations-report.pdf",
  },
  shaiHulud: {
    label: "GitHub",
    url: "https://github.blog/security/supply-chain-security/our-plan-for-a-more-secure-npm-supply-chain/",
  },
  megalodon: {
    label: "SafeDep",
    url: "https://safedep.io/blog/megalodon-mass-github-repo-backdooring-ci-workflows",
  },
  asyncapi: {
    label: "StepSecurity",
    url: "https://www.stepsecurity.io/blog/compromised-next-branch-pushes-malicious-asyncapi-generator-generator-helpers-and-generator-components-to-npm",
  },
} satisfies Record<string, Source>;

export const SECURITY_INCIDENTS = [
  {
    date: "SEP 2025",
    name: "Shai-Hulud",
    impact: "500+ compromised npm packages removed",
    trigger: "An install-time worm stole secrets and spread.",
    source: SECURITY_SOURCES.shaiHulud,
  },
  {
    date: "MAY 2026",
    name: "Megalodon",
    impact: "5,561 repositories received poisoned workflow commits",
    trigger: "A targeted variant waited for an on-demand trigger.",
    source: SECURITY_SOURCES.megalodon,
  },
  {
    date: "JUL 2026",
    name: "AsyncAPI",
    impact: "5 poisoned versions across 4 npm packages",
    trigger: "The payload ran when the library was imported, not installed.",
    source: SECURITY_SOURCES.asyncapi,
  },
] as const;
