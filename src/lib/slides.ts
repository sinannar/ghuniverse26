import type { Topic } from '../data/topics';

export interface PresentationSlide {
  id: string;
  label: string;
  kind: 'idea' | 'chart' | 'discussion' | 'examples' | 'creation' | 'demo';
  chartIndex?: number;
  optional?: boolean;
}

export function presentationSlides(topic: Pick<Topic, 'charts' | 'examples' | 'creationStory' | 'demo'>): PresentationSlide[] {
  const slides: PresentationSlide[] = topic.charts?.length
    ? topic.charts.map((chart, index) => ({ id: `chart-${index + 1}`, label: chart.title, kind: 'chart', chartIndex: index }))
    : [];
  slides.push({ id: 'idea', label: topic.charts?.length ? 'The context' : 'The idea', kind: 'idea' });
  if (topic.examples?.length) slides.push({ id: 'examples', label: 'Real examples', kind: 'examples' });
  slides.push({ id: 'discussion', label: 'What it means', kind: 'discussion' });
  if (topic.creationStory) slides.push({ id: 'creation', label: 'Building this presentation', kind: 'creation' });
  if (topic.demo) slides.push({ id: 'demo', label: 'Optional live demo', kind: 'demo', optional: topic.demo.optional });
  return slides;
}

export function slideDestination(current: number, total: number, key: string): number | undefined {
  if (total < 1) return undefined;
  switch (key) {
    case 'ArrowRight':
    case 'PageDown':
    case ' ':
      return Math.min(current + 1, total - 1);
    case 'ArrowLeft':
    case 'PageUp':
      return Math.max(current - 1, 0);
    case 'Home':
      return 0;
    case 'End':
      return total - 1;
    default:
      return undefined;
  }
}
