export class SpeechSynthesisHandler {
  private speechSynthesis!: SpeechSynthesis;

  /**
   * Get speechSynthesis from window and thorws an error if browser does not support
   *
   * @memberof SpeechSynthesisHandler
   */
  init() {
    if (window.speechSynthesis) {
      this.speechSynthesis = window.speechSynthesis;
    } else {
      throw new Error('Speech Synthesis is not supported by the browser');
    }
  }

  /**
   * Calls speechSynthesis speak function with text
   *
   * @param {string} text
   * @memberof SpeechSynthesisHandler
   */
  speakText(text: string) {
    if (!this.speechSynthesis) {
      this.init();
    }
    this.speechSynthesis!.speak(new window.SpeechSynthesisUtterance(text));
  }
}