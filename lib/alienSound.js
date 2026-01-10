/**
 * Plays an alien-themed success sound effect using Web Audio API
 * Creates a three-tone ascending sequence with smooth fade-out
 */
export function playAlienSound() {
  // Create audio context
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // First tone: 440Hz sine wave
  const oscillator1 = audioContext.createOscillator();
  const gainNode1 = audioContext.createGain();
  oscillator1.connect(gainNode1);
  gainNode1.connect(audioContext.destination);
  oscillator1.frequency.value = 440;
  oscillator1.type = 'sine';
  gainNode1.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
  oscillator1.start(audioContext.currentTime);
  oscillator1.stop(audioContext.currentTime + 0.15);

  // Second tone: 600Hz sine wave
  const oscillator2 = audioContext.createOscillator();
  const gainNode2 = audioContext.createGain();
  oscillator2.connect(gainNode2);
  gainNode2.connect(audioContext.destination);
  oscillator2.frequency.value = 600;
  oscillator2.type = 'sine';
  gainNode2.gain.setValueAtTime(0.3, audioContext.currentTime + 0.15);
  gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.35);
  oscillator2.start(audioContext.currentTime + 0.15);
  oscillator2.stop(audioContext.currentTime + 0.35);

  // Third tone: 700Hz sine wave
  const oscillator3 = audioContext.createOscillator();
  const gainNode3 = audioContext.createGain();
  oscillator3.connect(gainNode3);
  gainNode3.connect(audioContext.destination);
  oscillator3.frequency.value = 700;
  oscillator3.type = 'sine';
  gainNode3.gain.setValueAtTime(0.3, audioContext.currentTime + 0.35);
  gainNode3.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
  oscillator3.start(audioContext.currentTime + 0.35);
  oscillator3.stop(audioContext.currentTime + 0.5);
}
