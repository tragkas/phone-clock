
class AudioService {
  private ctx: AudioContext | null = null;
  private alarmInterval: number | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  private createOscillator(freq: number, type: OscillatorType, startTime: number, duration: number, volume: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  public playTimerDone() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Elegant triple chime
    this.createOscillator(880, 'sine', now, 0.5, 0.5);
    this.createOscillator(880, 'sine', now + 0.6, 0.5, 0.5);
    this.createOscillator(1046.5, 'sine', now + 1.2, 0.8, 0.5);
  }

  public startAlarm() {
    this.init();
    if (!this.ctx) return;
    this.stopAlarm(); // Prevent double alarms

    const playSequence = () => {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Rhythmic alarm pattern
      for (let i = 0; i < 4; i++) {
        this.createOscillator(987.77, 'square', now + (i * 0.25), 0.1, 0.1);
      }
    };

    playSequence();
    this.alarmInterval = window.setInterval(playSequence, 1500);
  }

  public stopAlarm() {
    if (this.alarmInterval) {
      clearInterval(this.alarmInterval);
      this.alarmInterval = null;
    }
  }

  public resumeContext() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }
}

export const audioService = new AudioService();
