import type { SceneProps } from "@/scenes/scene-types";
import { AgendaScene, OpeningScene, SectionIntroScene } from "@/scenes/framing";
import { RecapScene } from "@/scenes/recap";
import { BriefScene, DemoScene, FeatureScene, ImpactScene, RevealScene } from "@/scenes/announcement-scenes";
import { TourCardScene, TourFinaleScene, TourIntroScene } from "@/scenes/tour";
import { DataScene } from "@/scenes/visual-registry";
import { SecurityCveScene, SecuritySupplyChainScene } from "@/scenes/security-context";

/** Renders one scene of the deck at its current reveal step. */
export function SceneView(props: SceneProps) {
  switch (props.scene.kind) {
    case "opening":
      return <OpeningScene {...props} />;
    case "agenda":
      return <AgendaScene {...props} />;
    case "section":
      return <SectionIntroScene {...props} />;
    case "security-cves":
      return <SecurityCveScene {...props} />;
    case "security-supply-chain":
      return <SecuritySupplyChainScene {...props} />;
    case "reveal":
      return <RevealScene {...props} />;
    case "demo":
      return <DemoScene {...props} />;
    case "impact":
      return <ImpactScene {...props} />;
    case "feature":
      return <FeatureScene {...props} />;
    case "brief":
      return <BriefScene {...props} />;
    case "data-growth":
    case "data-agents":
    case "data-capacity":
    case "data-repo":
      return <DataScene {...props} />;
    case "recap":
      return <RecapScene {...props} />;
    case "tour-intro":
      return <TourIntroScene {...props} />;
    case "tour-card":
      return <TourCardScene {...props} />;
    case "tour-finale":
      return <TourFinaleScene {...props} />;
    default:
      return null;
  }
}
