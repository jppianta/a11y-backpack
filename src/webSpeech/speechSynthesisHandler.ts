export class SpeechSynthesisHandler {
  private speechSynthesis!: SpeechSynthesis;

  init() {
    if (window.speechSynthesis) {
      this.speechSynthesis = window.speechSynthesis;
    } else {
      throw new Error('Speech Synthesis is not supported by your browser');
    }
  }

  speakText(text: string) {
    if (!this.speechSynthesis) {
      this.init();
    }
    this.speechSynthesis!.speak(new window.SpeechSynthesisUtterance(text));
  }
}