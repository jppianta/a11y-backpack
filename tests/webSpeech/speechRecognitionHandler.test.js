import { SpeechRecognitionHandler } from '../../src/webSpeech/speechRecognitionHandler';

describe('webSpeech', () => {
  describe('speechRecognitionHandler', () => {
    let speechRecognitionHandler;
    const speechRecognitionMock = function speechRecognitionMock() { speechRecognitionMock.prototype.start = function() {} };
    const speechGrammarListMock = function speechGrammarListMock() { speechGrammarListMock.prototype.addFromString = function() {} };

    beforeEach(() => {
      speechRecognitionHandler = new SpeechRecognitionHandler();
      window.SpeechRecognition = speechRecognitionMock;
      window.SpeechGrammarList = speechGrammarListMock;
    });

    afterEach(() => {
      window.SpeechRecognition = undefined;
      window.SpeechGrammarList = undefined;
      window.webkitSpeechRecognition = undefined;
      window.webkitSpeechGrammarList = undefined;
      speechRecognitionHandler.dispose();
    });

    describe('init', () => {
      test('should set speechRecognition and speechGrammar if supported by the browser', () => {
        speechRecognitionHandler.init();

        expect(speechRecognitionHandler.speechGrammarList).toBeDefined();
        expect(speechRecognitionHandler.speechRecognition).toBeDefined();
      });

      test('should throw an error if speech recognition is not supported by the browser', () => {
        window.SpeechRecognition = undefined
        window.SpeechGrammarList = undefined;

        expect(() => speechRecognitionHandler.init()).toThrow('Speech Recognition is not supported by the browser');
      });

      test('should recognize if SpeechRecognition is under webkitSpeechRecognition', () => {
        window.SpeechRecognition = undefined
        window.SpeechGrammarList = undefined;
        window.webkitSpeechRecognition = speechRecognitionMock
        window.webkitSpeechGrammarList = speechGrammarListMock;

        speechRecognitionHandler.init();

        expect(speechRecognitionHandler.speechGrammarList).toBeDefined();
        expect(speechRecognitionHandler.speechRecognition).toBeDefined();
      });
    });

    describe('updateGrammar', () => {
      test('update grammar string when word is added', () => {
        speechRecognitionHandler.setWordCommand('test', () => {});

        expect(speechRecognitionHandler.grammar).toBe('#JSGF V1.0; grammar words; public <word> = test ;')
      });
    });

    describe('initSpeechRecognition', () => {
      test('should set speechRecognition if supported by the browser', () => {
        speechRecognitionHandler.initSpeechRecognition();

        expect(speechRecognitionHandler.speechRecognition).toBeDefined();
      });

      test('should throw an error if SpeechRecognition is not supported by the browser', () => {
        window.SpeechRecognition = undefined

        expect(() => speechRecognitionHandler.initSpeechRecognition()).toThrow('Speech Recognition is not supported by the browser');
      });

      test('should recognize if SpeechRecognition is under webkitSpeechRecognition', () => {
        window.SpeechRecognition = undefined
        window.webkitSpeechRecognition = speechRecognitionMock

        speechRecognitionHandler.initSpeechRecognition();

        expect(speechRecognitionHandler.speechRecognition).toBeDefined();
      });
    });

    describe('initGrammarList', () => {
      test('should set grammarList if supported by the browser', () => {
        speechRecognitionHandler.initGrammarList();

        expect(speechRecognitionHandler.speechGrammarList).toBeDefined();
      });

      test('should throw an error if SpeechGrammarList is not supported by the browser', () => {
        window.SpeechGrammarList = undefined

        expect(() => speechRecognitionHandler.initGrammarList()).toThrow('Speech Recognition is not supported by the browser');
      });

      test('should recognize if SpeechGrammarList is under webkitSpeechGrammarList', () => {
        window.SpeechGrammarList = undefined
        window.webkitSpeechGrammarList = speechGrammarListMock;

        speechRecognitionHandler.initGrammarList();

        expect(speechRecognitionHandler.speechGrammarList).toBeDefined();
      });
    });

    describe('dispose', () => {
      test('clear word set after dispose', () => {
        speechRecognitionHandler.setWordCommand('test', () => {});

        speechRecognitionHandler.dispose();

        expect(speechRecognitionHandler.wordsToCommandsMap.has('test')).toBe(false);
      });

      test('speechRecognition and speechGrammar variables should be undefined', () => {
        speechRecognitionHandler.dispose();

        expect(speechRecognitionHandler.speechGrammarList).not.toBeDefined();
        expect(speechRecognitionHandler.speechRecognition).not.toBeDefined();
      });

      test('grammar should be empty string', () => {
        speechRecognitionHandler.dispose();

        expect(speechRecognitionHandler.grammar).toBe('');
      });
    });

    describe('setWordCommand', () => {
      test('should set command to wordsToCommandsMap', () => {
        speechRecognitionHandler.setWordCommand('test', () => {});

        expect(speechRecognitionHandler.wordsToCommandsMap.has('test')).toBe(true);
      });
    });

    describe('setOnErrorCallback', () => {
      test('should set onError callback', () => {
        speechRecognitionHandler.setOnErrorCallback(() => {});

        expect(speechRecognitionHandler.onError).toBeDefined();
      });
    });

    describe('onResult', () => {
      test('should call callback if word is mapped', () => {
        let testCounter = 0;

        speechRecognitionHandler.setWordCommand('test', () => testCounter = 1);

        speechRecognitionHandler.speechRecognition.onresult({ results: [[{ confidence: 1, transcript: 'test' }]] });

        expect(testCounter).toEqual(1);
      });

      test('should call error callback if word is not mapped', () => {
        let testCounter = 0;

        speechRecognitionHandler.setOnErrorCallback(() => testCounter = 1);

        speechRecognitionHandler.setWordCommand('test', () => testCounter = 2);

        speechRecognitionHandler.speechRecognition.onresult({ results: [[{ confidence: 1, transcript: 'notMappedWord' }]] });

        expect(testCounter).toEqual(1);
      });

      test('should call error callback if match was not found', () => {
        let testCounter = 0;

        speechRecognitionHandler.setOnErrorCallback(() => testCounter = 1);

        speechRecognitionHandler.setWordCommand('test', () => testCounter = 2);

        speechRecognitionHandler.speechRecognition.onresult({ results: [] });

        expect(testCounter).toEqual(1);
      });
    });

    describe('startListening', () => {
      test('should call speechRecognition start', () => {
        speechRecognitionHandler.init();

        const spy = jest.spyOn(speechRecognitionHandler.speechRecognition, 'start');

        speechRecognitionHandler.startListening();

        expect(spy).toHaveBeenCalled();
      });
    });

    describe('checkWebSpeech', () => {
      test('init api if undefined', () => {
        expect(speechRecognitionHandler.speechGrammarList).not.toBeDefined();
        expect(speechRecognitionHandler.speechRecognition).not.toBeDefined();

        speechRecognitionHandler.checkWebSpeech();

        expect(speechRecognitionHandler.speechGrammarList).toBeDefined();
        expect(speechRecognitionHandler.speechRecognition).toBeDefined();
      });
    });
  });
});