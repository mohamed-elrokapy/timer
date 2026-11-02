/* Formatting helpers for the timer, usable from the browser and from Node. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.TimerCore = factory();
})(typeof self !== "undefined" ? self : this, function () {
  const pad = (n) => String(n).padStart(2, "0");

  // 65 -> "01:05", 3725 -> "1:02:05"
  function formatClock(totalSeconds) {
    const s = Math.max(0, Math.floor(totalSeconds));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
  }

  // 65 -> "1 minute 5 seconds", for screen reader announcements.
  function speakable(totalSeconds) {
    const s = Math.max(0, Math.floor(totalSeconds));
    const parts = [];
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    const unit = (n, name) => `${n} ${name}${n === 1 ? "" : "s"}`;
    if (h) parts.push(unit(h, "hour"));
    if (m) parts.push(unit(m, "minute"));
    if (sec || parts.length === 0) parts.push(unit(sec, "second"));
    return parts.join(" ");
  }

  return { formatClock, speakable };
});
