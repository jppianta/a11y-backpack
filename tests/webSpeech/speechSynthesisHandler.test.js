import { SpeechSynthesisHandler } from "../../src/webSpeech/speechSynthesisHandler";

describe('webSpeech', () => {
  describe('speechSynthesisHandler', () => {
    let speechSynthesisHandler;

    const speechSynthesisMock = {
      speak: () => null
    }
    
    beforeEach(() => {
      window.speechSynthesis = speechSynthesisMock;
      window.SpeechSynthesisUtterance = function SpeechSynthesisUtterance() {};
      speechSynthesisHandler = new SpeechSynthesisHandler();
    });

    afterEach(() => {
      window.speechSynthesis = undefined;
      window.SpeechSynthesisUtterance = undefined;
    })

    describe('init', () => {
      test('should set speechSynthesis if defined by the browser', () => {
        speechSynthesisHandler.init();

        expect(speechSynthesisHandler.speechSynthesis).toBeDefined();
      });

      test('throw an error is speechSynthesis is not defined by the browser', () => {
        window.speechSynthesis = undefined;

        expect(() => speechSynthesisHandler.init()).toThrow('Speech Synthesis is not supported by your browser');
      });
    });

    describe('speakText', () => {
      test('call speechSynthesis speak with text', () => {
        const spy = jest.spyOn(speechSynthesisMock, 'speak');

        speechSynthesisHandler.speakText('Hello, world!');

        expect(spy).toHaveBeenCalled();
      });
    });
  });
});