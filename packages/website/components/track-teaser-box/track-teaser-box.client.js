/**
 * Track teaser box behaviour — plain DOM, no framework.
 *
 * The component renders static markup (`TrackTeaserBoxComponent.tsx`); everything
 * interactive happens here:
 *   - flipping the card (CSS does the transform, this only toggles `data-flipped`)
 *   - pausing playback when the card flips back
 *   - flipping back automatically when the track ends
 *   - Escape flips back
 *
 * Bundled by `scripts/bundleStaticAssets.js` into `public/_/client.js`, which the
 * app shell loads on every page. A MutationObserver picks up cards added by
 * client-side navigation.
 */

const BOX = "[data-track-teaser-box]";
const FLIP = "[data-track-teaser-box-flip]";
const AUDIO = "[data-track-teaser-box-audio]";

const setFlipped = (box, flipped) => {
  box.toggleAttribute("data-flipped", flipped);

  if (!flipped) {
    const audio = box.querySelector(AUDIO);
    if (audio && !audio.paused) audio.pause();
  }

  box.querySelectorAll(FLIP).forEach((button) => {
    button.setAttribute("aria-pressed", flipped ? "true" : "false");
  });
};

const init = (box) => {
  if (box.dataset.trackTeaserBoxReady) return;
  box.dataset.trackTeaserBoxReady = "true";

  box.querySelectorAll(FLIP).forEach((button) => {
    button.addEventListener("click", () => {
      setFlipped(box, !box.hasAttribute("data-flipped"));
    });
  });

  const audio = box.querySelector(AUDIO);
  if (audio) audio.addEventListener("ended", () => setFlipped(box, false));

  box.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setFlipped(box, false);
  });
};

const initWithin = (root) => {
  if (root.nodeType !== 1) return;
  if (root.matches(BOX)) init(root);
  root.querySelectorAll(BOX).forEach(init);
};

document.querySelectorAll(BOX).forEach(init);

new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach(initWithin);
  });
}).observe(document.documentElement, { childList: true, subtree: true });
