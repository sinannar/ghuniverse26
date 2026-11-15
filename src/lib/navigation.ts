import type { CategoryId } from '../data/topics';

export function withBase(path: string, base: string): string {
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

export const href = (path = '') => withBase(path, import.meta.env.BASE_URL);
export const categoryPath = (category: CategoryId) => `${category}/`;
export const topicPath = (category: CategoryId, id: string) => `${category}/${id}/`;

export function neighbors<T extends { id: string }>(items: T[], id: string) {
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) throw new Error(`Unknown topic: ${id}`);
  return { previous: items[index - 1], next: items[index + 1], index };
}
