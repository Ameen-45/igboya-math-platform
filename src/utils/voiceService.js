// Voice Service for natural teacher-like speech
class VoiceService {
  constructor() {
    this.voices = [];
    this.selectedVoice = null;
    this.isSpeaking = false;
    this.utterance = null;
    this.init();
  }

  async init() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.loadVoices();
        };
      } else {
        setTimeout(() => this.loadVoices(), 100);
      }
    }
  }

  loadVoices() {
    this.voices = window.speechSynthesis.getVoices();
    
    // Best natural teacher voices (priority order)
    const voicePreferences = [
      'Google UK English Female',
      'Microsoft Sabina',
      'Microsoft Jenny',
      'Samantha',
      'Google UK English Male',
      'Daniel',
      'Microsoft Guy'
    ];
    
    for (const pref of voicePreferences) {
      const voice = this.voices.find(v => v.name === pref || v.name.includes(pref));
      if (voice) {
        this.selectedVoice = voice;
        break;
      }
    }
    
    if (!this.selectedVoice) {
      this.selectedVoice = this.voices.find(v => v.lang === 'en-US');
    }
    
    console.log('Voice loaded:', this.selectedVoice?.name);
  }

  speak(text, options = {}) {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        reject('Speech synthesis not supported');
        return;
      }

      this.stop();

      const cleanText = text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

      if (!cleanText) {
        reject('No text to speak');
        return;
      }

      this.utterance = new SpeechSynthesisUtterance(cleanText);
      
      if (this.selectedVoice) {
        this.utterance.voice = this.selectedVoice;
      }
      
      // Teacher-like settings: clear, slightly slower, natural
      this.utterance.rate = options.rate || 0.85;
      this.utterance.pitch = options.pitch || 1.05;
      this.utterance.volume = options.volume || 1;
      this.utterance.lang = options.lang || 'en-US';
      
      this.utterance.onstart = () => {
        this.isSpeaking = true;
        options.onStart?.();
      };
      
      this.utterance.onend = () => {
        this.isSpeaking = false;
        options.onEnd?.();
        resolve();
      };
      
      this.utterance.onerror = (event) => {
        this.isSpeaking = false;
        console.error('Speech error:', event);
        reject(event);
      };
      
      window.speechSynthesis.speak(this.utterance);
    });
  }

  stop() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.utterance = null;
    }
  }

  isSupported() {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }
}

const voiceService = new VoiceService();
export default voiceService;
