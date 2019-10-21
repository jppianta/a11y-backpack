import { KeyboardHandler } from './keyboardHandler';
import { SpeechSynthesisHandler } from './webSpeech/speechSynthesisHandler';

/**
 * Main class to add accessibility commands to website
 *
 * @class A11yBackpack
 */
class A11yBackpack {
  private keyboardHandler?: KeyboardHandler;
  private speechSynthesisHandler?: SpeechSynthesisHandler;

  /**
   * Set command that clicks on element when key is pressed
   *
   * @param {{ id: string, commandKey: string }} info
   * @memberof A11yBackpack
   */
  setClickOnElementCommand(info: { id: string, commandKey: string }) {
    this.setKeyboardCommand(info.commandKey, this.getClickOnElementCallback(info.id));
  }

  /**
   * Set command to read content of element when key is pressed
   *
   * @param {{ id: string, commandKey: string }} info
   * @memberof A11yBackpack
   */
  setReadOnElementCommand(info: { id: string, commandKey: string }) {
    this.setKeyboardCommand(info.commandKey, this.getReadOnElementCallback(info.id));
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
}

export const a11yBackpack = new A11yBackpack();