/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private isDronePlaying = false;

  private initContext() {
    if (!this.ctx) {
      // Create audio context supporting prefix
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Synthesizes a soft, mechanical-like typewriter keyclick
   */
  public playClick() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      // Pitch-shifted brief click
      osc.type = 'triangle';
      // Slight pitch randomization for organic typewriter feel
      const randomPitch = 150 + Math.random() * 80;
      osc.frequency.setValueAtTime(randomPitch, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(10, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch (e) {
      console.warn('Audio click failed to play', e);
    }
  }

  /**
   * Starts playing a relaxing, low-frequency ambient focus hum (brownian noise + low drone)
   */
  public startFocusHum() {
    try {
      this.initContext();
      if (!this.ctx || this.isDronePlaying) return;

      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.droneGain.connect(this.ctx.destination);

      // Oscillator 1: 75Hz (deep resonant)
      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc1.type = 'sine';
      this.droneOsc1.frequency.setValueAtTime(75, this.ctx.currentTime);
      this.droneOsc1.connect(this.droneGain);

      // Oscillator 2: 110Hz (calming harmonic)
      this.droneOsc2 = this.ctx.createOscillator();
      this.droneOsc2.type = 'triangle';
      this.droneOsc2.frequency.setValueAtTime(110, this.ctx.currentTime);
      
      // Filter out high frequencies of the triangle wave to keep it mellow
      const lowpass = this.ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(120, this.ctx.currentTime);
      
      this.droneOsc2.connect(lowpass);
      lowpass.connect(this.droneGain);

      // Fade-in ambient drone
      this.droneGain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 2.0);

      this.droneOsc1.start();
      this.droneOsc2.start();
      this.isDronePlaying = true;
    } catch (e) {
      console.warn('Focus drone failed to start', e);
    }
  }

  /**
   * Stops the focus drone
   */
  public stopFocusHum() {
    try {
      if (!this.ctx || !this.isDronePlaying) return;

      const currentGain = this.droneGain;
      const currentOsc1 = this.droneOsc1;
      const currentOsc2 = this.droneOsc2;

      if (currentGain) {
        // Fade-out
        currentGain.gain.setValueAtTime(currentGain.gain.value, this.ctx.currentTime);
        currentGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
      }

      setTimeout(() => {
        try {
          currentOsc1?.stop();
          currentOsc2?.stop();
        } catch (e) {}
      }, 600);

      this.droneOsc1 = null;
      this.droneOsc2 = null;
      this.droneGain = null;
      this.isDronePlaying = false;
    } catch (e) {
      console.warn('Focus drone failed to stop', e);
    }
  }

  /**
   * Plays a crisp, resonant "Tibetan Bell / Desk Bell" sound
   */
  public playBellRing() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const masterGain = this.ctx.createGain();
      masterGain.connect(this.ctx.destination);
      masterGain.gain.setValueAtTime(0, now);
      masterGain.gain.linearRampToValueAtTime(0.35, now + 0.05);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + 3.0);

      // Fundamental frequency and major harmonics
      const frequencies = [440, 554.37, 659.25, 880, 1200];
      const partialGains = [0.4, 0.25, 0.2, 0.1, 0.05];

      frequencies.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const pGain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        // Add minor vibrato
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(5 + Math.random() * 2, now);
        lfoGain.gain.setValueAtTime(1.5, now);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        pGain.gain.setValueAtTime(partialGains[idx], now);
        // Harmonics decay quicker
        pGain.gain.exponentialRampToValueAtTime(0.001, now + (3.0 / (idx + 1)));

        osc.connect(pGain);
        pGain.connect(masterGain);

        lfo.start(now);
        osc.start(now);

        lfo.stop(now + 3.5);
        osc.stop(now + 3.5);
      });
    } catch (e) {
      console.warn('Bell audio failed to play', e);
    }
  }
}

export const audioSynth = new AudioSynthesizer();
