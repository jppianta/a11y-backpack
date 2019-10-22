import { KeyboardHandler } from './keyboardHandler';
import { SpeechSynthesisHandler } from './webSpeech/speechSynthesisHandler';
import { SpeechRecognitionHandler } from './webSpeech/speechRecognitionHandler';

/**
 * Main class to add accessibility commands to website
 *
 * @class A11yBackpack
 */
class A11yBackpack {
  private keyboardHandler?: KeyboardHandler;
  private speechSynthesisHandler?: SpeechSynthesisHandler;
  private speechRecognitionHandler?: SpeechRecognitionHandler;

  /**
   * Set command that clicks on element when key is pressed
   *
   * @param {{ id: string, commandKey: string }} info
   * @memberof A11yBackpack
   */
  setClickOnElementCommand(info: { id: string, commandKey?: string, voiceWord?: string }) {
    if (info.commandKey) {
      this.setKeyboardCommand(info.commandKey, this.getClickOnElementCallback(info.id));
    }
    if (info.voiceWord) {
      this.setVoiceCommand(info.voiceWord, this.getClickOnElementCallback(info.id));
    }
  }

  /**
   * Set command to read content of element when key is pressed
   *
   * @param {{ id: string, commandKey: string }} info
   * @memberof A11yBackpack
   */
  setReadOnElementCommand(info: { id: string, commandKey?: string, voiceWord?: string }) {
    if (info.commandKey) {
      this.setKeyboardCommand(info.commandKey, this.getReadOnElementCallback(info.id));
    }
    if (info.voiceWord) {
      this.setVoiceCommand(info.voiceWord, this.getReadOnElementCallback(info.id));
    }
  }

  /**
   * Dispose keyboard handler and variables
   *
   * @memberof A11yBackpack
   */
  dispose() {
    if (this.keyboardHandler) {
      this.keyboardHandler.dispose();
      this.keyboardHandler = undefined;
    }

    if (this.speechRecognitionHandler) {
      this.speechRecognitionHandler.dispose();
      this.speechRecognitionHandler = undefined;
    }

    this.speechSynthesisHandler = undefined;
  }

  private getClickOnElementCallback(id: string) {
    return () => {
      const element = document.getElementById(id);
  
      if (element) {
        element.click();
      } else {
        throw new Error(`Element with id "${id}" does not exist`);
      }
    };
  }

  private getReadOnElementCallback(id: string) {
    this.setSpeechSynthesisHandler();
    return () => {
      const element = document.getElementById(id);
  
      if (element) {
        const text = element.innerText;
        this.speechSynthesisHandler!.speakText(text);
      } else {
        throw new Error(`Element with id "${id}" does not exist`);
      }
    };
  }

  private setKeyboardCommand(key: string, callback: () => void) {
    this.setKeyboardHandler();

    this.keyboardHandler!.setKeyCommand(key, callback);
  }

  private setVoiceCommand(word: string, callback: () => void) {
    this.setSpeechRecognitionHandler();

    this.speechRecognitionHandler!.setWordCommand(word, callback);
  }
  
  private setKeyboardHandler() {
    if (!this.keyboardHandler) {
      this.keyboardHandler = new KeyboardHandler();
      this.keyboardHandler.attachListener();
    }
  }

  private setSpeechSynthesisHandler() {
    if (!this.speechSynthesisHandler) {
      this.speechSynthesisHandler = new SpeechSynthesisHandler();
      try {
        this.speechSynthesisHandler.init();
      } catch (err) {
        this.speechSynthesisHandler = undefined;
        throw err;
      }
    }
  }

  private setSpeechRecognitionHandler() {
    if (!this.speechRecognitionHandler) {
      this.speechRecognitionHandler = new SpeechRecognitionHandler();
      try {
        this.speechRecognitionHandler.init();
      } catch (err) {
        this.speechRecognitionHandler = undefined;
        throw err;
      }
    }
  }
}

export const a11yBackpack = new A11yBackpack();