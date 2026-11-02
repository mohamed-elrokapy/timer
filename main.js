(function () {
  const { formatClock, speakable } = TimerCore;

  const clock = document.getElementById("clock");
  const chip = document.getElementById("chip");
  const fill = document.getElementById("minute-fill");
  const toggle = document.getElementById("toggle");
  const reset = document.getElementById("reset");
  const announcer = document.getElementById("announcer");

  // Elapsed time is computed from timestamps, not by counting interval ticks,
  // so it stays accurate when the tab is throttled in the background.
  let elapsedBeforeMs = 0; // time accumulated before the current run
  let startedAt = 0; // performance.now() when the current run began
  let running = false;
  let intervalId = null;
  let lastShownSecond = -1;

  const elapsedMs = () => elapsedBeforeMs + (running ? performance.now() - startedAt : 0);
  const elapsedSeconds = () => Math.floor(elapsedMs() / 1000);

  function announce(message) {
    announcer.textContent = message;
  }

  function render(force) {
    const seconds = elapsedSeconds();
    if (!force && seconds === lastShownSecond) return;
    const previous = lastShownSecond;
    lastShownSecond = seconds;

    const text = formatClock(seconds);
    clock.textContent = text;
    clock.toggleAttribute("data-long", text.length > 5);
    fill.style.width = `${((seconds % 60) / 60) * 100}%`;

    const state = running ? "running" : seconds > 0 ? "paused" : "ready";
    document.title = state === "ready" ? "Timer" : `${text} · Timer (${state})`;

    // Announce each full minute while running, not every second.
    if (running && seconds > 0 && seconds % 60 === 0 && seconds !== previous) {
      announce(`${speakable(seconds)} elapsed`);
    }
  }

  function setUi() {
    const seconds = elapsedSeconds();
    const state = running ? "running" : seconds > 0 || elapsedBeforeMs > 0 ? "paused" : "ready";
    document.body.dataset.state = state;
    chip.textContent = state === "running" ? "Running" : state === "paused" ? "Paused" : "Ready";
    toggle.textContent = running ? "Pause" : state === "paused" ? "Resume" : "Start";
    reset.disabled = state === "ready";
  }

  function start() {
    if (running) return;
    running = true;
    startedAt = performance.now();
    intervalId = setInterval(() => render(false), 200);
    setUi();
    render(true);
    announce("Started");
  }

  function pause() {
    if (!running) return;
    elapsedBeforeMs += performance.now() - startedAt;
    running = false;
    clearInterval(intervalId);
    intervalId = null;
    setUi();
    render(true);
    announce(`Paused at ${speakable(elapsedSeconds())}`);
  }

  function resetTimer() {
    const wasActive = running || elapsedBeforeMs > 0;
    running = false;
    clearInterval(intervalId);
    intervalId = null;
    elapsedBeforeMs = 0;
    setUi();
    render(true);
    if (wasActive) announce("Reset to zero");
  }

  const toggleRun = () => (running ? pause() : start());

  toggle.addEventListener("click", toggleRun);
  reset.addEventListener("click", resetTimer);

  document.addEventListener("keydown", (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey || event.repeat) return;
    const onControl = event.target.closest && event.target.closest("button, input, select, textarea, a");
    // Space on a focused button already activates it, so only handle it elsewhere.
    if (event.key === " " && !onControl) {
      event.preventDefault();
      toggleRun();
    } else if ((event.key === "r" || event.key === "R") && !reset.disabled) {
      resetTimer();
    }
  });

  setUi();
  render(true);
})();
