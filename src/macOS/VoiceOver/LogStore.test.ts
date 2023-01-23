import { cleanSpokenPhrase } from "./cleanSpokenPhrase";
import { itemText } from "./itemText";
import { lastSpokenPhrase } from "./lastSpokenPhrase";
import { LogStore } from "./LogStore";
import { mockType } from "../../../test/mockType";

jest.mock("./cleanSpokenPhrase", () => ({
  cleanSpokenPhrase: jest.fn(),
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

    mockType(cleanSpokenPhrase).mockImplementation(
      (phrase) => `cleaned_${phrase}`
    );
    mockType(itemText).mockResolvedValue(itemTextDummy);
    mockType(lastSpokenPhrase).mockResolvedValue(lastSpokenPhraseDummy);

    logStore = new LogStore();
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
});
