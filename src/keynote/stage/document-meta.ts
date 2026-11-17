// Tab title and an original inline favicon, so the deck needs no icon file and
// the browser never asks the host for /favicon.ico.

const ICON = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='14' fill='#0b0b12'/><ellipse cx='32' cy='32' rx='23' ry='9' fill='none' stroke='#a78bfa' stroke-width='3' transform='rotate(-24 32 32)'/><circle cx='32' cy='32' r='8' fill='#f5f3ff'/><circle cx='51' cy='24' r='3.5' fill='#f472b6'/></svg>`;

export function applyDocumentMeta(title: string) {
  document.title = title;
  if (document.querySelector('link[rel="icon"][data-keynote]')) return;
  const link = document.createElement("link");
  link.rel = "icon";
  link.type = "image/svg+xml";
  link.href = `data:image/svg+xml,${encodeURIComponent(ICON)}`;
  link.dataset.keynote = "true";
  document.head.appendChild(link);
}
