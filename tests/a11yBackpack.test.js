import { a11yBackpack } from "../src/a11yBackpack";

describe('a11yBackpack', () => {
  afterEach(() => {
    a11yBackpack.dispose();
  });

  describe('setClickOnElementCommand', () => {
    test('create command that calls getClickOnElementCallback callback', () => {
      a11yBackpack.setClickOnElementCommand({
        id: 'test',
        commandKey: 'a'
      });

      let testCounter = 0;

      const element = document.createElement('button');
      element.id = 'test';
      element.onclick = () => testCounter = 1;

      document.firstElementChild.appendChild(element);

      const event = new KeyboardEvent('keydown', { key: 'a' });
      document.dispatchEvent(event);

      setTimeout(() => expect(testCounter).toEqual(1), 1);
    });
  });

  describe('setReadOnElementCommand', () => {
    const speechSynthesisMock = {
      speak: () => true
    }

    beforeEach(() => {
      window.speechSynthesis = speechSynthesisMock;
    });

    afterEach(() => {
      window.speechSynthesis = undefined;
    });

    test('set command and read inner text of element from id', () => {
      const element = document.createElement('div');
      element.id = 'test';
      element.innerText = 'Hello, world!';

      document.firstElementChild.appendChild(element);

      const spy = jest.spyOn(speechSynthesisMock, 'speak');

      const event = new KeyboardEvent('keydown', { key: 'a' });
      document.dispatchEvent(event);

      setTimeout(() => expect(spy).toHaveBeenCalled(), 1);
    });
  });

  describe('getReadOnElementCallback', () => {
    const speechSynthesisMock = {
      speak: () => true
    }

    beforeEach(() => {
      window.speechSynthesis = speechSynthesisMock;
      window.SpeechSynthesisUtterance = function SpeechSynthesisUtterance() {};
    });

    afterEach(() => {
      window.speechSynthesis = undefined;
      window.SpeechSynthesisUtterance = undefined;
    });

    test('throw an error if element with id does not exist', () => {
      const callback = a11yBackpack.getReadOnElementCallback('idThatDoesNotExist');

      expect(callback).toThrow('Element with id "idThatDoesNotExist" does not exist');
    });

    test('read inner text of element from id', () => {
      const element = document.createElement('div');
      element.id = 'test';
      element.innerText = 'Hello, world!';

      document.firstElementChild.appendChild(element);

      const spy = jest.spyOn(speechSynthesisMock, 'speak');

      const callback = a11yBackpack.getReadOnElementCallback('test');
      callback();

      setTimeout(() => expect(spy).toHaveBeenCalled(), 1);
    });
  });

  describe('getClickOnElementCallback', () => {
    test('throw an error if element with id does not exist', () => {
      const callback = a11yBackpack.getClickOnElementCallback('idThatDoesNotExist');

      expect(callback).toThrow('Element with id "idThatDoesNotExist" does not exist');
    });

    test('click on element from id', () => {
      let testCounter = 0;

      const element = document.createElement('button');
      element.id = 'test';
      element.onclick = () => testCounter = 1;

      document.firstElementChild.appendChild(element);

      const callback = a11yBackpack.getClickOnElementCallback('test');
      callback();

      setTimeout(() => expect(testCounter).toEqual(1), 1);
    });
  });

  describe('setKeyboardCommand', () => {
    test('create keyboardHandler if undefined and set new command', () => {
      expect(a11yBackpack.keyboardHandler).not.toBeDefined();

      let testCounter = 0;

      a11yBackpack.setKeyboardCommand('a', () => testCounter = 1);

      const event = new KeyboardEvent('keydown', { key: 'a' });
      document.dispatchEvent(event);

      setTimeout(() => expect(testCounter).toEqual(1), 1);
    });
  });

  describe('setSpeechSynthesisHandler', () => {
    const speechSynthesisMock = {
      speak: () => true
    }

    beforeEach(() => {
      window.speechSynthesis = speechSynthesisMock;
    });

    afterEach(() => {
      window.speechSynthesis = undefined;
    });

    test('create and init speechSynthesisHandler if undefined', () => {
      expect(a11yBackpack.speechSynthesisHandler).not.toBeDefined();

      a11yBackpack.setSpeechSynthesisHandler();

      expect(a11yBackpack.speechSynthesisHandler).toBeDefined();
    });

    test('keep instance if speechSynthesisHandler already exists', () => {
      a11yBackpack.setSpeechSynthesisHandler();

      const oldInstance = a11yBackpack.speechSynthesisHandler;

      a11yBackpack.setSpeechSynthesisHandler();

      const newInstance = a11yBackpack.speechSynthesisHandler;

      expect(oldInstance).toEqual(newInstance);
    });

    test('throw an error and keep undefined if speechSynthesisHandler fails to init', () => {
      window.speechSynthesis = undefined;

      expect(() => a11yBackpack.setSpeechSynthesisHandler()).toThrow('Speech Synthesis is not supported by your browser');
      expect(a11yBackpack.speechSynthesisHandler).not.toBeDefined();      
    });
  });

  describe('setKeyboardHandler', () => {
    test('create and init keyboardHandler if undefined', () => {
      expect(a11yBackpack.keyboardHandler).not.toBeDefined();

      a11yBackpack.setKeyboardHandler();

      expect(a11yBackpack.keyboardHandler).toBeDefined();
    });

    test('keep instance if keyboardHandler already exists', () => {
      a11yBackpack.setKeyboardHandler();

      const oldInstance = a11yBackpack.keyboardHandler;

      a11yBackpack.setKeyboardHandler();

      const newInstance = a11yBackpack.keyboardHandler;

      expect(oldInstance).toEqual(newInstance);
    });
  });
});