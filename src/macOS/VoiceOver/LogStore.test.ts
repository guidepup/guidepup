import { cleanSpokenPhrase } from "./cleanSpokenPhrase";
import { itemText } from "./itemText";
import { lastSpokenPhrase } from "./lastSpokenPhrase";
import { LogStore } from "./LogStore";
import { MAX_SPOKEN_PHRASES_POLL_COUNT } from "./constants";

jest.mock("./cleanSpokenPhrase", () => ({
  cleanSpokenPhrase: jest.fn(),
}));
jest.mock("./constants", () => ({
  APPROX_WORDS_PER_SECOND: 10000,
  ITEM_TEXT_POLL_INTERVAL: 0,
  ITEM_TEXT_RETRY_COUNT: 1,
  SPOKEN_PHRASES_POLL_INTERVAL: 0,
  SPOKEN_PHRASES_RETRY_COUNT: 1,
  MAX_SPOKEN_PHRASES_POLL_COUNT: 4,
}));
jest.mock("./itemText", () => ({
  itemText: jest.fn(),
}));
jest.mock("./lastSpokenPhrase", () => ({
  lastSpokenPhrase: jest.fn(),
}));

const itemTextDummy = "test-item-text";
const lastSpokenPhraseDummy = "test-last-spoken-phrase";

describe("LogStore", () => {
  let logStore: LogStore;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();

    jest
      .mocked(cleanSpokenPhrase)
      .mockImplementation((phrase) => `cleaned_${phrase}`);
    jest.mocked(itemText).mockResolvedValue(itemTextDummy);
    jest.mocked(lastSpokenPhrase).mockResolvedValue(lastSpokenPhraseDummy);
  });

  describe("when capture options are not provided", () => {
    beforeEach(() => {
      logStore = new LogStore();
    });

    it("should initialize with an empty item text log store", async () => {
      expect(await logStore.itemTextLog()).toEqual([]);
    });

    it("should initialize with an empty spoken phrase log store", async () => {
      expect(await logStore.spokenPhraseLog()).toEqual([]);
    });

    it("should return with an empty string as the item text if not yet acted", async () => {
      expect(await logStore.itemText()).toEqual("");
    });

    it("should return with an empty string as the last spoken phrase if not yet acted", async () => {
      expect(await logStore.lastSpokenPhrase()).toEqual("");
    });

    describe("when tap is called on an action with no capture options", () => {
      const expectedResult = Symbol("test-expected-result");
      let resultPromise: Promise<unknown>,
        resolver: (r: typeof expectedResult) => void;

      beforeEach(() => {
        const action = () =>
          new Promise((resolve) => {
            resolver = resolve;
          });

        resultPromise = logStore.tap(action);
      });

      afterEach(async () => {
        resolver(expectedResult);
        await resultPromise;
      });

      describe("when the action completes", () => {
        beforeEach(() => {
          resolver(expectedResult);
        });

        it("should log the item text", async () => {
          await resultPromise;

          expect(await logStore.itemTextLog()).toEqual([
            `cleaned_${itemTextDummy}`,
          ]);
        });

        it("should log the last spoken phrase", async () => {
          await resultPromise;

          expect(await logStore.spokenPhraseLog()).toEqual([
            `cleaned_${lastSpokenPhraseDummy}`,
          ]);
        });

        it("should return the action's result", async () => {
          await expect(resultPromise).resolves.toBe(expectedResult);
        });

        it("should return the item text from the last action", async () => {
          expect(await logStore.itemText()).toEqual(`cleaned_${itemTextDummy}`);
        });

        it("should return the last spoken phrase from the last action", async () => {
          expect(await logStore.lastSpokenPhrase()).toEqual(
            `cleaned_${lastSpokenPhraseDummy}`
          );
        });
      });
    });

    describe("when tap is called on an action with capture enabled", () => {
      const expectedResult = Symbol("test-expected-result");
      let resultPromise: Promise<unknown>,
        resolver: (r: typeof expectedResult) => void;

      beforeEach(() => {
        const action = () =>
          new Promise((resolve) => {
            resolver = resolve;
          });

        resultPromise = logStore.tap(action, { capture: true });
      });

      afterEach(async () => {
        resolver(expectedResult);
        await resultPromise;
      });

      describe("when the action completes", () => {
        beforeEach(() => {
          resolver(expectedResult);
        });

        it("should log the item text", async () => {
          await resultPromise;

          expect(await logStore.itemTextLog()).toEqual([
            `cleaned_${itemTextDummy}`,
          ]);
        });

        it("should log the last spoken phrase", async () => {
          await resultPromise;

          expect(await logStore.spokenPhraseLog()).toEqual([
            `cleaned_${lastSpokenPhraseDummy}`,
          ]);
        });

        it("should return the action's result", async () => {
          await expect(resultPromise).resolves.toBe(expectedResult);
        });

        it("should return the item text from the last action", async () => {
          expect(await logStore.itemText()).toEqual(`cleaned_${itemTextDummy}`);
        });

        it("should return the last spoken phrase from the last action", async () => {
          expect(await logStore.lastSpokenPhrase()).toEqual(
            `cleaned_${lastSpokenPhraseDummy}`
          );
        });
      });
    });

    describe("when tap is called on an action with capture disabled", () => {
      const expectedResult = Symbol("test-expected-result");
      let resultPromise: Promise<unknown>,
        resolver: (r: typeof expectedResult) => void;

      beforeEach(() => {
        const action = () =>
          new Promise((resolve) => {
            resolver = resolve;
          });

        resultPromise = logStore.tap(action, { capture: false });
      });

      afterEach(async () => {
        resolver(expectedResult);
        await resultPromise;
      });

      describe("when the action completes", () => {
        beforeEach(() => {
          resolver(expectedResult);
        });

        it("should not log the item text", async () => {
          await resultPromise;

          expect(await logStore.itemTextLog()).toHaveLength(0);
        });

        it("should not log the last spoken phrase", async () => {
          await resultPromise;

          expect(await logStore.spokenPhraseLog()).toHaveLength(0);
        });

        it("should return the action's result", async () => {
          await expect(resultPromise).resolves.toBe(expectedResult);
        });

        it("should not return the item text from the last action", async () => {
          expect(await logStore.itemText()).toEqual("");
        });

        it("should not return the last spoken phrase from the last action", async () => {
          expect(await logStore.lastSpokenPhrase()).toEqual("");
        });
      });
    });

    describe("when tap is called with capture enabled (by default or via options) but is unsuccessful in retrieving the last spoken phrase", () => {
      const expectedResult = Symbol("test-expected-result");
      let resultPromise: Promise<unknown>,
        resolver: (r: typeof expectedResult) => void;

      beforeEach(() => {
        jest
          .mocked(lastSpokenPhrase)
          .mockRejectedValue(new Error("test-error"));
        jest.mocked(cleanSpokenPhrase).mockReturnValue("");

        const action = () =>
          new Promise((resolve) => {
            resolver = resolve;
          });

        resultPromise = logStore.tap(action);
      });

      afterEach(async () => {
        resolver(expectedResult);
        await resultPromise;
      });

      describe("when the action completes", () => {
        beforeEach(() => {
          resolver(expectedResult);
        });

        it("should attempt to retrieve the log a maximum number of times specified by `MAX_SPOKEN_PHRASES_POLL_COUNT`", async () => {
          await resultPromise;

          expect(lastSpokenPhrase).toHaveBeenCalledTimes(
            MAX_SPOKEN_PHRASES_POLL_COUNT
          );
        });

        it("should not log any additional phrases", async () => {
          expect(await logStore.spokenPhraseLog()).toEqual([""]);

          await resultPromise;

          expect(await logStore.spokenPhraseLog()).toEqual([""]);
        });

        it("should return an empty string", async () => {
          expect(await logStore.lastSpokenPhrase()).toEqual("");
        });
      });
    });

    describe("when tap is called with capture enabled (by default or via options) but the phrases emitted by VO never stabilize (e.g. live region that announces updates every second)", () => {
      const expectedResult = Symbol("test-expected-result");
      let resultPromise: Promise<unknown>,
        resolver: (r: typeof expectedResult) => void;

      beforeEach(() => {
        let phraseCount = 0;
        jest.mocked(lastSpokenPhrase).mockImplementation(() => {
          return Promise.resolve(`${phraseCount++}`);
        });

        const action = () =>
          new Promise((resolve) => {
            resolver = resolve;
          });

        resultPromise = logStore.tap(action);
      });

      afterEach(async () => {
        resolver(expectedResult);
        await resultPromise;
      });

      describe("when the action completes", () => {
        beforeEach(() => {
          resolver(expectedResult);
        });

        it("should attempt to retrieve the log a maximum number of times specified by `MAX_SPOKEN_PHRASES_POLL_COUNT`", async () => {
          await resultPromise;

          expect(lastSpokenPhrase).toHaveBeenCalledTimes(
            MAX_SPOKEN_PHRASES_POLL_COUNT
          );
        });

        it("should log the combined last spoken phrases", async () => {
          await resultPromise;

          expect(await logStore.spokenPhraseLog()).toEqual([
            `cleaned_0. cleaned_1. cleaned_2. cleaned_3`,
          ]);
        });

        it("should return the combined last spoken phrases from the last action", async () => {
          expect(await logStore.lastSpokenPhrase()).toEqual(
            `cleaned_0. cleaned_1. cleaned_2. cleaned_3`
          );
        });
      });
    });
  });

  describe("when capture has been enabled by default", () => {
    beforeEach(() => {
      logStore = new LogStore({ capture: true });
    });

    it("should initialize with an empty item text log store", async () => {
      expect(await logStore.itemTextLog()).toEqual([]);
    });

    it("should initialize with an empty spoken phrase log store", async () => {
      expect(await logStore.spokenPhraseLog()).toEqual([]);
    });

    it("should initialize with an empty spoken phrase log store", async () => {
      expect(await logStore.spokenPhraseLog()).toEqual([]);
    });

    it("should return with an empty string as the item text if not yet acted", async () => {
      expect(await logStore.itemText()).toEqual("");
    });

    it("should return with an empty string as the last spoken phrase if not yet acted", async () => {
      expect(await logStore.lastSpokenPhrase()).toEqual("");
    });

    describe("when tap is called on an action with no capture options", () => {
      const expectedResult = Symbol("test-expected-result");
      let resultPromise: Promise<unknown>,
        resolver: (r: typeof expectedResult) => void;

      beforeEach(() => {
        const action = () =>
          new Promise((resolve) => {
            resolver = resolve;
          });

        resultPromise = logStore.tap(action);
      });

      afterEach(async () => {
        resolver(expectedResult);
        await resultPromise;
      });

      describe("when the action completes", () => {
        beforeEach(() => {
          resolver(expectedResult);
        });

        it("should log the item text", async () => {
          await resultPromise;

          expect(await logStore.itemTextLog()).toEqual([
            `cleaned_${itemTextDummy}`,
          ]);
        });

        it("should log the last spoken phrase", async () => {
          await resultPromise;

          expect(await logStore.spokenPhraseLog()).toEqual([
            `cleaned_${lastSpokenPhraseDummy}`,
          ]);
        });

        it("should return the action's result", async () => {
          await expect(resultPromise).resolves.toBe(expectedResult);
        });

        it("should return the item text from the last action", async () => {
          expect(await logStore.itemText()).toEqual(`cleaned_${itemTextDummy}`);
        });

        it("should return the last spoken phrase from the last action", async () => {
          expect(await logStore.lastSpokenPhrase()).toEqual(
            `cleaned_${lastSpokenPhraseDummy}`
          );
        });
      });
    });

    describe("when tap is called on an action with capture enabled", () => {
      const expectedResult = Symbol("test-expected-result");
      let resultPromise: Promise<unknown>,
        resolver: (r: typeof expectedResult) => void;

      beforeEach(() => {
        const action = () =>
          new Promise((resolve) => {
            resolver = resolve;
          });

        resultPromise = logStore.tap(action, { capture: true });
      });

      afterEach(async () => {
        resolver(expectedResult);
        await resultPromise;
      });

      describe("when the action completes", () => {
        beforeEach(() => {
          resolver(expectedResult);
        });

        it("should log the item text", async () => {
          await resultPromise;

          expect(await logStore.itemTextLog()).toEqual([
            `cleaned_${itemTextDummy}`,
          ]);
        });

        it("should log the last spoken phrase", async () => {
          await resultPromise;

          expect(await logStore.spokenPhraseLog()).toEqual([
            `cleaned_${lastSpokenPhraseDummy}`,
          ]);
        });

        it("should return the action's result", async () => {
          await expect(resultPromise).resolves.toBe(expectedResult);
        });

        it("should return the item text from the last action", async () => {
          expect(await logStore.itemText()).toEqual(`cleaned_${itemTextDummy}`);
        });

        it("should return the last spoken phrase from the last action", async () => {
          expect(await logStore.lastSpokenPhrase()).toEqual(
            `cleaned_${lastSpokenPhraseDummy}`
          );
        });

        describe("when the item text log is cleared", () => {
          beforeEach(async () => {
            await logStore.clearItemTextLog();
          });

          it("should return with an empty item text log store", async () => {
            expect(await logStore.itemTextLog()).toEqual([]);
          });

          it("should return with an empty string as the item text", async () => {
            expect(await logStore.itemText()).toEqual("");
          });
        });

        describe("when the spoken phrase log is cleared", () => {
          beforeEach(async () => {
            await logStore.clearSpokenPhraseLog();
          });

          it("should return with an empty spoken phrase log store", async () => {
            expect(await logStore.spokenPhraseLog()).toEqual([]);
          });

          it("should return with an empty string as the last spoken phrase", async () => {
            expect(await logStore.lastSpokenPhrase()).toEqual("");
          });
        });
      });
    });

    describe("when tap is called on an action with capture disabled", () => {
      const expectedResult = Symbol("test-expected-result");
      let resultPromise: Promise<unknown>,
        resolver: (r: typeof expectedResult) => void;

      beforeEach(() => {
        const action = () =>
          new Promise((resolve) => {
            resolver = resolve;
          });

        resultPromise = logStore.tap(action, { capture: false });
      });

      afterEach(async () => {
        resolver(expectedResult);
        await resultPromise;
      });

      describe("when the action completes", () => {
        beforeEach(() => {
          resolver(expectedResult);
        });

        it("should not log the item text", async () => {
          await resultPromise;

          expect(await logStore.itemTextLog()).toHaveLength(0);
        });

        it("should not log the last spoken phrase", async () => {
          await resultPromise;

          expect(await logStore.spokenPhraseLog()).toHaveLength(0);
        });

        it("should return the action's result", async () => {
          await expect(resultPromise).resolves.toBe(expectedResult);
        });

        it("should not return the item text from the last action", async () => {
          expect(await logStore.itemText()).toEqual("");
        });

        it("should not return the last spoken phrase from the last action", async () => {
          expect(await logStore.lastSpokenPhrase()).toEqual("");
        });
      });
    });
  });

  describe("when capture has been disabled by default", () => {
    beforeEach(() => {
      logStore = new LogStore({ capture: false });
    });

    it("should initialize with an empty item text log store", async () => {
      expect(await logStore.itemTextLog()).toEqual([]);
    });

    it("should initialize with an empty spoken phrase log store", async () => {
      expect(await logStore.spokenPhraseLog()).toEqual([]);
    });

    it("should initialize with an empty spoken phrase log store", async () => {
      expect(await logStore.spokenPhraseLog()).toEqual([]);
    });

    it("should return with an empty string as the item text if not yet acted", async () => {
      expect(await logStore.itemText()).toEqual("");
    });

    it("should return with an empty string as the last spoken phrase if not yet acted", async () => {
      expect(await logStore.lastSpokenPhrase()).toEqual("");
    });

    describe("when tap is called on an action with no capture options", () => {
      const expectedResult = Symbol("test-expected-result");
      let resultPromise: Promise<unknown>,
        resolver: (r: typeof expectedResult) => void;

      beforeEach(() => {
        const action = () =>
          new Promise((resolve) => {
            resolver = resolve;
          });

        resultPromise = logStore.tap(action);
      });

      afterEach(async () => {
        resolver(expectedResult);
        await resultPromise;
      });

      describe("when the action completes", () => {
        beforeEach(() => {
          resolver(expectedResult);
        });

        it("should not log the item text", async () => {
          await resultPromise;

          expect(await logStore.itemTextLog()).toHaveLength(0);
        });

        it("should not log the last spoken phrase", async () => {
          await resultPromise;

          expect(await logStore.spokenPhraseLog()).toHaveLength(0);
        });

        it("should return the action's result", async () => {
          await expect(resultPromise).resolves.toBe(expectedResult);
        });

        it("should not return the item text from the last action", async () => {
          expect(await logStore.itemText()).toEqual("");
        });

        it("should not return the last spoken phrase from the last action", async () => {
          expect(await logStore.lastSpokenPhrase()).toEqual("");
        });
      });
    });

    describe("when tap is called on an action with capture enabled", () => {
      const expectedResult = Symbol("test-expected-result");
      let resultPromise: Promise<unknown>,
        resolver: (r: typeof expectedResult) => void;

      beforeEach(() => {
        const action = () =>
          new Promise((resolve) => {
            resolver = resolve;
          });

        resultPromise = logStore.tap(action, { capture: true });
      });

      afterEach(async () => {
        resolver(expectedResult);
        await resultPromise;
      });

      describe("when the action completes", () => {
        beforeEach(() => {
          resolver(expectedResult);
        });

        it("should log the item text", async () => {
          await resultPromise;

          expect(await logStore.itemTextLog()).toEqual([
            `cleaned_${itemTextDummy}`,
          ]);
        });

        it("should log the last spoken phrase", async () => {
          await resultPromise;

          expect(await logStore.spokenPhraseLog()).toEqual([
            `cleaned_${lastSpokenPhraseDummy}`,
          ]);
        });

        it("should return the action's result", async () => {
          await expect(resultPromise).resolves.toBe(expectedResult);
        });

        it("should return the item text from the last action", async () => {
          expect(await logStore.itemText()).toEqual(`cleaned_${itemTextDummy}`);
        });

        it("should return the last spoken phrase from the last action", async () => {
          expect(await logStore.lastSpokenPhrase()).toEqual(
            `cleaned_${lastSpokenPhraseDummy}`
          );
        });
      });
    });

    describe("when tap is called on an action with capture disabled", () => {
      const expectedResult = Symbol("test-expected-result");
      let resultPromise: Promise<unknown>,
        resolver: (r: typeof expectedResult) => void;

      beforeEach(() => {
        const action = () =>
          new Promise((resolve) => {
            resolver = resolve;
          });

        resultPromise = logStore.tap(action, { capture: false });
      });

      afterEach(async () => {
        resolver(expectedResult);
        await resultPromise;
      });

      describe("when the action completes", () => {
        beforeEach(() => {
          resolver(expectedResult);
        });

        it("should not log the item text", async () => {
          await resultPromise;

          expect(await logStore.itemTextLog()).toHaveLength(0);
        });

        it("should not log the last spoken phrase", async () => {
          await resultPromise;

          expect(await logStore.spokenPhraseLog()).toHaveLength(0);
        });

        it("should return the action's result", async () => {
          await expect(resultPromise).resolves.toBe(expectedResult);
        });

        it("should not return the item text from the last action", async () => {
          expect(await logStore.itemText()).toEqual("");
        });

        it("should not return the last spoken phrase from the last action", async () => {
          expect(await logStore.lastSpokenPhrase()).toEqual("");
        });
      });
    });
  });
});
