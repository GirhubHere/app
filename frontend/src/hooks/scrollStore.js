// Singleton smooth-scroll store — one RAF loop, zero React re-renders.
// Components subscribe via subscribeScrollY() and update DOM directly.
let subscribers = new Set();
let current = 0;
let target = 0;
let started = false;

const tick = () => {
  const diff = target - current;
  if (Math.abs(diff) > 0.04) {
    current += diff * 0.085; // lerp factor — lower = smoother
    subscribers.forEach((fn) => fn(current));
  }
  requestAnimationFrame(tick);
};

if (typeof window !== "undefined" && !started) {
  started = true;
  target = window.scrollY;
  current = window.scrollY;
  window.addEventListener("scroll", () => { target = window.scrollY; }, { passive: true });
  requestAnimationFrame(tick);
}

/** Subscribe to lerped scroll Y. Returns an unsubscribe function. */
export const subscribeScrollY = (fn) => {
  subscribers.add(fn);
  fn(current); // fire immediately with current value
  return () => subscribers.delete(fn);
};
