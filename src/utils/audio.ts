/**
 * Simple emergency alert audio synthesizer using standard Web Audio API
 */
class EmergencyAudioEngine {
  private ctx: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isSirenActive = false;
  private intervalId: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play distinct high-priority emergency alarm tone
  public playCriticalAlertTone() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.setValueAtTime(988, this.ctx.currentTime + 0.15);
      osc.frequency.setValueAtTime(1175, this.ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.55);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.55);
    } catch {
      // Audio policy
    }
  }

  // Play escalation alert tone
  public playEscalationTone() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.setValueAtTime(780, now + 0.12);
      osc.frequency.setValueAtTime(1040, now + 0.24);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(now + 0.6);
    } catch {
      // Audio policy
    }
  }

  // Trigger device haptic vibration if supported
  public triggerVibration(pattern: number[] = [300, 150, 300, 150, 450]) {
    try {
      if (typeof window !== 'undefined' && 'navigator' in window && typeof navigator.vibrate === 'function') {
        navigator.vibrate(pattern);
      }
    } catch {
      // Vibration not supported
    }
  }

  // Request browser notification permission and dispatch notification
  public dispatchBrowserPushNotification(title: string, options?: NotificationOptions) {
    try {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification(title, {
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            ...options,
          });
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
              new Notification(title, options);
            }
          });
        }
      }
    } catch {
      // Notification API blocked
    }
  }

  // Play a gentle notification sound
  public playChime(freq = 600) {
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    } catch {
      // Audio not supported or blocked by policy
    }
  }

  // Start SOS high-pitch alert whistle / siren
  public toggleEmergencySiren(onStateChange?: (active: boolean) => void): boolean {
    try {
      this.initContext();
      if (!this.ctx) return false;

      if (this.isSirenActive) {
        this.stopSiren();
        if (onStateChange) onStateChange(false);
        return false;
      }

      this.isSirenActive = true;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();

      this.oscillator = osc;
      this.gainNode = gain;

      // Modulate frequency between 700Hz and 1100Hz
      let high = false;
      this.intervalId = window.setInterval(() => {
        if (!this.ctx || !this.oscillator) return;
        const targetFreq = high ? 1150 : 720;
        this.oscillator.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.1);
        high = !high;
      }, 400);

      if (onStateChange) onStateChange(true);
      return true;
    } catch {
      return false;
    }
  }

  public stopSiren() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.oscillator) {
      try {
        this.oscillator.stop();
        this.oscillator.disconnect();
      } catch {
        // Ignored
      }
      this.oscillator = null;
    }
    this.isSirenActive = false;
  }

  public isRunning(): boolean {
    return this.isSirenActive;
  }
}

export const emergencyAudio = new EmergencyAudioEngine();
