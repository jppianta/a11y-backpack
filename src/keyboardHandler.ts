export class KeyboardHandler {
  private keyToCommandsMap = new Map<string, () => void>();
  private reservedKeys = new Set<string>();

  /**
   * Attach keydown listener
   *
   * @memberof KeyboardHandler
   */
  attachListener() {
    document.addEventListener('keydown', this.onKeyPressed);
  }

  /**
   * Remove event listener and clear key to command map
   *
   * @memberof KeyboardHandler
   */
  dispose() {
    document.removeEventListener('keydown', this.onKeyPressed);
    this.keyToCommandsMap.clear();
  }

  /**
   * Bind a callback for when key is pressed
   *
   * @param {string} key
   * @param {() => void} callback
   * @memberof KeyboardHandler
   */
  setKeyCommand(key: string, callback: () => void) {
    if (!this.reservedKeys.has(key)) {
      this.keyToCommandsMap.set(key, callback);
    } else {
      throw new Error('Regular key mappings cannot overwrite important key mappings');
    }
  }

  /**
   * Bind a callback for when key is pressed that cannot be overwritten by regular binds
   *
   * @param {string} key
   * @param {() => void} callback
   * @memberof KeyboardHandler
   */
  setImportantKeyCommand(key: string, callback: () => void) {
    this.keyToCommandsMap.set(key, callback);
    this.reservedKeys.add(key);
  }

  /**
   * Call the callback binded for a key
   *
   * @private
   * @memberof KeyboardHandler
   */
  private onKeyPressed = (event: KeyboardEvent) => {
    const key = event.key;
    if (this.keyToCommandsMap.has(key)) {
      this.keyToCommandsMap.get(key)!();
    }
  }
}