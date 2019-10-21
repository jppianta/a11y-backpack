export class KeyboardHandler {
  private keyToCommandsMap = new Map<string, () => void>();
  private reservedKeys = new Set<string>();

  attachListener() {
    document.addEventListener('keydown', this.onKeyPressed);
  }

  dispose() {
    document.removeEventListener('keydown', this.onKeyPressed);
    this.keyToCommandsMap.clear();
  }

  setKeyCommand(key: string, callback: () => void) {
    if (!this.reservedKeys.has(key)) {
      this.keyToCommandsMap.set(key, callback);
    } else {
      throw new Error('Regular key mappings cannot overwrite important key mappings');
    }
  }

  setImportantKeyCommand(key: string, callback: () => void) {
    this.keyToCommandsMap.set(key, callback);
    this.reservedKeys.add(key);
  }

  private onKeyPressed = (event: KeyboardEvent) => {
    const key = event.key;
    if (this.keyToCommandsMap.has(key)) {
      this.keyToCommandsMap.get(key)!();
    }
  }
}