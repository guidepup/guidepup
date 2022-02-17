import { LogStore } from "./LogStore";
import { mockType } from "../test/mockType";
import { ScreenReader } from "./ScreenReader";

const screenReaderStub = {
  caption: {
    itemText: jest.fn(),
    lastSpokenPhrase: jest.fn(),
  },
} as unknown as ScreenReader;

const itemTextDummy = "test-item-text";
const lastSpokenPhraseDummy = "test-last-spoken-phrase";

describe("LogStore", () => {
  let logStore: LogStore;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();

    mockType(screenReaderStub.caption.itemText).mockResolvedValue(
      itemTextDummy
    );
    mockType(
      screenReaderStub.caption.lastSpokenPhrase
    ).mockResolvedValue(lastSpokenPhraseDummy);

    logStore = new LogStore(screenReaderStub);
  });

  it("should initialize with an empty item text log store", () => {
    expect(logStore.itemTextLog).toEqual([]);
  });

  it("should initialize with an empty spoken phrase log store", () => {
    expect(logStore.spokenPhraseLog).toEqual([]);
  });

  describe("when tap is called on an action's promise", () => {
    const expectedResult = Symbol("test-expected-result");
    let resultPromise, resolver;

    beforeEach(() => {
      const promise = new Promise((resolve) => {
        resolver = resolve;
      });

      resultPromise = logStore.tap(promise);
    });

    afterEach(async () => {
      resolver(expectedResult);
      await resultPromise;
    });

    it("should not yet log the item text", () => {
      expect(logStore.itemTextLog).toEqual([]);
    });

    it("should not yet log the last spoken phrase", () => {
      expect(logStore.spokenPhraseLog).toEqual([]);
    });

    describe("when the action completes", () => {
      beforeEach(() => {
        resolver(expectedResult);
      });

      it("should log the item text", () => {
        expect(logStore.itemTextLog).toEqual([itemTextDummy]);
      });

      it("should log the last spoken phrase", () => {
        expect(logStore.spokenPhraseLog).toEqual([lastSpokenPhraseDummy]);
      });

      it("should return the action's result", async () => {
        await expect(resultPromise).resolves.toBe(expectedResult);
      });
    });
  });
});
