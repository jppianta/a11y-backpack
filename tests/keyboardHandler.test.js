import { KeyboardHandler } from '../src/keyboardHandler';


describe('keyboardHandler', () => {
  let keyboardHandler;

  beforeEach(() => {
    keyboardHandler = new KeyboardHandler();

    keyboardHandler.attachListener();
  });

  afterEach(() => {
    keyboardHandler.dispose();
  });

  describe('dispose', () => {
    test('clear map entries on dispose', () => {
      keyboardHandler.setKeyCommand('a', () => true);

      expect(keyboardHandler.keyToCommandsMap.has('a')).toBe(true);

      keyboardHandler.dispose();

      expect(keyboardHandler.keyToCommandsMap.has('a')).toBe(false);
    });
  });

  describe('setKeyCommand', () => {

    test('command is added to the commands map', () => {
      keyboardHandler.setKeyCommand('a', () => true);

      expect(keyboardHandler.keyToCommandsMap.has('a')).toBe(true);
    });
  });

  describe('setImportantKeyCommand', () => {
    test('important command is added to the commands map', () => {
      keyboardHandler.setImportantKeyCommand('a', () => true);

      expect(keyboardHandler.keyToCommandsMap.has('a')).toBe(true);
    });

    test('important commands cannot be overwritten by regular commands', () => {
      keyboardHandler.setImportantKeyCommand('a', () => true);

      expect(() => keyboardHandler.setKeyCommand('a', () => true))
        .toThrow('Regular key mappings cannot overwrite important key mappings');
    });

    test('important commands can be overwritten by other important commands', () => {
      keyboardHandler.setImportantKeyCommand('a', () => true);

      keyboardHandler.setImportantKeyCommand('b', () => true);

      expect(keyboardHandler.keyToCommandsMap.has('a')).toBe(true);
    });
  });

  describe('onKeyPressed', () => {

    test('callback should be called if mapped key is pressed', () => {
      let testCounter = 0;

      keyboardHandler.setKeyCommand('a', () => testCounter = 1);

      const event = new KeyboardEvent('keydown', { key: 'a' });
      document.dispatchEvent(event);

      setTimeout(() => expect(testCounter).toEqual(1), 1);
    });

    test('callback should not be called if pressed key is not mapped', () => {
      let testCounter = 0;

      keyboardHandler.setKeyCommand('a', () => testCounter = 1);

      const event = new KeyboardEvent('keydown', { key: 'b' });
      document.dispatchEvent(event);

      setTimeout(() => expect(testCounter).toEqual(0), 1);
    });
  });
});
