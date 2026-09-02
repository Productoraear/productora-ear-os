
class AuraAudioSynth {
  private audioCtx: AudioContext;
  private oscillator: OscillatorNode;
  private lfo: OscillatorNode;
  private gainNode: GainNode;

  constructor() {
this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.oscillator = this.audioCtx.createOscillator();
    this.lfo = this.audioCtx.createOscillator();
    this.gainNode = this.audioCtx.createGain();

    // Set up oscillator
    this.oscillator.type = 'sine';
    this.oscillator.frequency.setValueAtTime(136.1, this.audioCtx.currentTime);

    // Set up LFO
    this.lfo.type = 'square';
    this.lfo.frequency.setValueAtTime(40, this.audioCtx.currentTime);
    this.lfo.connect(this.oscillator.detune); // Modulate detune with LFO

    // Connect nodes
    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.audioCtx.destination);

    // Start oscillators
    this.oscillator.start();
    this.lfo.start();

    // Initial gain is 0 (silent)
    this.gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
  }

  toggle() {
    const currentTime = this.audioCtx.currentTime;
    if (this.gainNode.gain.value === 0) {
      // Fade in
      this.gainNode.gain.linearRampToValueAtTime(1, currentTime + 1.5);
    } else {
      // Fade out
      this.gainNode.gain.linearRampToValueAtTime(0, currentTime + 1.5);
      setTimeout(() => {
        if (this.oscillator.context.state === 'running') {
          this.oscillator.stop();
          this.lfo.stop();
        }
      }, 1500);
    }
  }
}

export default AuraAudioSynth;