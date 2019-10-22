export class SpeechRecognitionHandler {
  private wordsToCommandsMap = new Map<string, () => void>();
  private speechRecognition?: SpeechRecognition;
  private speechGrammarList?: SpeechGrammarList;
  private grammar = '';
  private onError?: () => void;

  init() {
    this.initGrammarList();
    this.initSpeechRecognition();
  }

  setWordCommand(word: string, callback: () => void) {
    this.checkWebSpeech();
    this.wordsToCommandsMap.set(word, callback);
    this.updateGrammar();
  }

  setOnErrorCallback(callback: () => void) {
    this.onError = callback;
  }

  startListening() {
    this.checkWebSpeech();
    this.speechRecognition!.start();
  }

  dispose() {
    this.wordsToCommandsMap.clear();
  }

  private onResult = (event: any) => {
    if (event.results.length) {
      const last = event.results.length - 1;
      const resultWord = event.results[last][0].transcript;

      if (this.wordsToCommandsMap.has(resultWord)) {
        this.wordsToCommandsMap.get(resultWord)!();
      } else {
        this.onError && this.onError();
      }
    } else {
      this.onError && this.onError();
    }
  }

  private checkWebSpeech() {
    if (!this.speechRecognition || !this.speechGrammarList) {
      this.init();
    }
  }

  private updateGrammar() {
    const wordsList: string[] = [];

    this.wordsToCommandsMap.forEach((_, word) => {
      wordsList.push(word);
    });

    this.grammar = '#JSGF V1.0; grammar words; public <word> = ' + wordsList.join(' | ') + ' ;'
    this.speechGrammarList!.addFromString(this.grammar, 1);
  }

  private initSpeechRecognition() {
    const speechRecognitionConstructor = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (speechRecognitionConstructor) {
      this.speechRecognition = new speechRecognitionConstructor();
      this.speechRecognition.lang = 'en-US';
      this.speechRecognition.interimResults = false;
      this.speechRecognition.maxAlternatives = 1;
      this.speechRecognition.onresult = this.onResult;
    } else {
      throw new Error('Speech Recognition is not supported by the browser');
    }
  }

  private initGrammarList() {
    const speechGrammarListConstructor = window.SpeechGrammarList || (window as any).webkitSpeechGrammarList;
    if (speechGrammarListConstructor) {
      this.speechGrammarList = new speechGrammarListConstructor();
    } else {
      throw new Error('Speech Recognition is not supported by the browser');
    }
  }
}