import { slideDestination } from '../lib/slides';

const fullscreenButton = document.querySelector<HTMLButtonElement>('[data-fullscreen]');
const controlStatus = document.querySelector<HTMLElement>('[data-control-status]');

if (fullscreenButton && document.fullscreenEnabled) {
  fullscreenButton.hidden = false;
  fullscreenButton.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch (error) {
      console.error('Unable to change fullscreen mode', error);
      if (controlStatus) controlStatus.textContent = 'Fullscreen could not be changed. Use your browser’s fullscreen command instead.';
    }
  });
  document.addEventListener('fullscreenchange', () => {
    const active = Boolean(document.fullscreenElement);
    fullscreenButton.setAttribute('aria-pressed', String(active));
    fullscreenButton.setAttribute('aria-label', active ? 'Exit fullscreen' : 'Enter fullscreen');
  });
}

const deck = document.querySelector<HTMLElement>('[data-deck]');
const allSlides = [...document.querySelectorAll<HTMLElement>('[data-slide]')];
const normalSlides = allSlides.filter((slide) => slide.dataset.optional !== 'true');
const previous = document.querySelector<HTMLButtonElement>('[data-slide-previous]');
const next = document.querySelector<HTMLButtonElement>('[data-slide-next]');
const select = document.querySelector<HTMLSelectElement>('[data-slide-select]');
const count = document.querySelector<HTMLElement>('[data-slide-count]');
const slideStatus = document.querySelector<HTMLElement>('[data-slide-status]');
const nextHint = document.querySelector<HTMLElement>('[data-next-hint]');
const previousTopic = document.querySelector<HTMLAnchorElement>('[data-previous-topic]');
const nextTopic = document.querySelector<HTMLAnchorElement>('[data-next-topic]');
let activeSlides = normalSlides;
let current = 0;

function showSlide(id: string, push = false, focus = false) {
  const slide = allSlides.find((slide) => slide.id === id);
  if (!slide) return;
  activeSlides = slide.dataset.optional === 'true' ? [...normalSlides, slide] : normalSlides;
  current = activeSlides.indexOf(slide);
  allSlides.forEach((item) => {
    item.hidden = item !== slide;
    if (item === slide) item.setAttribute('aria-current', 'step');
    else item.removeAttribute('aria-current');
  });
  const atStart = current === 0;
  const atEnd = current === activeSlides.length - 1;
  if (previous) {
    previous.disabled = atStart && !previousTopic;
    previous.setAttribute('aria-label', atStart && previousTopic ? `Previous topic: ${previousTopic.textContent?.trim()}` : 'Previous slide');
  }
  if (next) {
    next.disabled = atEnd && !nextTopic;
    next.setAttribute('aria-label', atEnd && nextTopic ? `Next topic: ${nextTopic.textContent?.trim()}` : atEnd ? 'End of presentation' : 'Next slide');
  }
  if (nextHint) nextHint.textContent = atEnd ? nextTopic ? `Next: ${nextTopic.textContent?.replace('→', '').trim()}` : 'End of presentation' : '';
  if (select) select.value = slide.id;
  if (count) count.textContent = `${current + 1} / ${activeSlides.length}`;
  if (slideStatus) slideStatus.textContent = `${slide.dataset.optional ? 'Optional demo. ' : ''}Slide ${current + 1} of ${activeSlides.length}: ${slide.dataset.slideTitle}`;
  if (push) history.pushState(null, '', `#${slide.id}`);
  if (focus) {
    const heading = slide.querySelector<HTMLElement>('h2');
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  }
  slide.scrollTop = 0;
}

function showHashSlide() {
  if (location.hash === '#main') {
    if (activeSlides[current]) showSlide(activeSlides[current].id);
    return;
  }
  const slide = allSlides.find((slide) => `#${slide.id}` === location.hash);
  if (slide || normalSlides[0]) showSlide((slide ?? normalSlides[0]).id);
}

function moveSlide(direction: -1 | 1) {
  const destination = current + direction;
  if (destination < 0 && previousTopic) window.location.assign(previousTopic.href);
  else if (destination >= activeSlides.length && nextTopic) window.location.assign(nextTopic.href);
  else if (activeSlides[destination]) showSlide(activeSlides[destination].id, true, true);
}

if (deck && normalSlides.length) {
  document.documentElement.classList.add('presentation-ready');
  showHashSlide();
  if (previous) previous.hidden = false;
  if (next) next.hidden = false;
  previous?.addEventListener('click', () => moveSlide(-1));
  next?.addEventListener('click', () => moveSlide(1));
  select?.addEventListener('change', () => showSlide(select.value, true));
  window.addEventListener('popstate', showHashSlide);
  window.addEventListener('hashchange', showHashSlide);
}

document.addEventListener('keydown', (event) => {
  if (event.defaultPrevented || event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  const openSources = document.querySelector<HTMLDetailsElement>('details[open]');
  if (openSources) {
    if (event.key === 'Escape') {
      event.preventDefault();
      openSources.open = false;
      openSources.querySelector('summary')?.focus();
    }
    return;
  }
  const target = event.target;
  if (target instanceof Element && target.closest('input, textarea, select, button, a, summary, [contenteditable]:not([contenteditable="false"]), [role="slider"], [role="textbox"], [role="combobox"]')) return;
  if (window.getSelection()?.toString()) return;
  if (event.key === 'Escape') {
    if (document.fullscreenElement) return;
    const overview = document.querySelector<HTMLAnchorElement>('[data-overview]');
    if (overview) {
      event.preventDefault();
      window.location.assign(overview.href);
    }
    return;
  }
  if (!deck) return;
  const destination = slideDestination(current, activeSlides.length, event.key);
  if (destination === undefined) return;
  event.preventDefault();
  if (destination !== current) showSlide(activeSlides[destination].id, true, true);
  else if (['ArrowRight', 'PageDown', ' '].includes(event.key)) moveSlide(1);
  else if (['ArrowLeft', 'PageUp'].includes(event.key)) moveSlide(-1);
});
