export function playCatSound(type) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;

  if (!AudioContext) {
    return;
  }

  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;
  const isPositive = type === "correct";

  oscillator.type = isPositive ? "triangle" : "sine";
  oscillator.frequency.setValueAtTime(isPositive ? 520 : 330, now);
  oscillator.frequency.exponentialRampToValueAtTime(
    isPositive ? 860 : 180,
    now + 0.18,
  );

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(isPositive ? 0.18 : 0.14, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);

  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.start(now);
  oscillator.stop(now + 0.25);
  oscillator.addEventListener("ended", () => {
    context.close();
  });
}
