import { copyLastSpokenPhrase } from "./copyLastSpokenPhrase";
import { LogStore } from "./LogStore";
import { saveLastSpokenPhrase } from "./saveLastSpokenPhrase";
import { VoiceOverCaption } from "./VoiceOverCaption";

jest.mock("./copyLastSpokenPhrase", () => ({
  copyLastSpokenPhrase: jest.fn(),
}));
jest.mock("./LogStore", () => ({
  LogStore: jest.fn(),
}));
jest.mock("./saveLastSpokenPhrase", () => ({
  saveLastSpokenPhrase: jest.fn(),
}));

const spokenPhraseDummy = "test-spoken-phrase";
const itemTextDummy = "test-item-text";

describe("VoiceOverCaption", () => {
  let caption: VoiceOverCaption;
  let result;
  let logStoreDummy: LogStore;
  let spokenPhraseLogCleared: boolean;
  let itemTextLogCleared: boolean;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();

    itemTextLogCleared = false;
    spokenPhraseLogCleared = false;

    logStoreDummy = {
      async itemText() {
        return itemTextDummy;
      },
      async lastSpokenPhrase() {
        return spokenPhraseDummy;
      },
      async itemTextLog() {
        return [itemTextDummy];
      },
      async spokenPhraseLog() {
        return [spokenPhraseDummy];
      },
      async clearItemTextLog() {
        itemTextLogCleared = true;
      },
      async clearSpokenPhraseLog() {
        spokenPhraseLogCleared = true;
      },
    } as LogStore;

    caption = new VoiceOverCaption(logStoreDummy);
    result = undefined;
  });

  describe("lastSpokenPhrase", () => {
    beforeEach(async () => {
      result = await caption.lastSpokenPhrase();
    });

    it("should return the last spoken phrase", () => {
      expect(result).toEqual(spokenPhraseDummy);
    });
  });

  describe("copyLastSpokenPhrase", () => {
    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await caption.copyLastSpokenPhrase(options);
      });

      it("should copy the last spoken phrase from VoiceOver to the clipboard", () => {
        expect(copyLastSpokenPhrase).toHaveBeenCalledWith(options);
      });
    });
  });

  describe("saveLastSpokenPhrase", () => {
    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await caption.saveLastSpokenPhrase(options);
      });

      it("should save the last spoken phrase from VoiceOver to a file on the desktop", () => {
        expect(saveLastSpokenPhrase).toHaveBeenCalledWith(options);
      });
    });
  });

  describe("spokenPhraseLog", () => {
    it("should get a log of the spoken phrases", () => {
      expect(caption.spokenPhraseLog()).toEqual(
        logStoreDummy.spokenPhraseLog()
      );
    });
  });

  describe("clearSpokenPhraseLog", () => {
    it("should clear the log of the spoken phrases", () => {
      caption.clearSpokenPhraseLog();

      expect(spokenPhraseLogCleared).toBe(true);
    });
  });

  describe("itemText", () => {
    beforeEach(async () => {
      result = await caption.itemText();
    });

    it("should return the item text", () => {
      expect(result).toEqual(itemTextDummy);
    });
  });

  describe("itemTextLog", () => {
    it("should get a log of the item text", () => {
      expect(caption.itemTextLog()).toEqual(logStoreDummy.itemTextLog());
    });
  });

  describe("clearItemTextLog", () => {
    it("should clear the log of the item text", () => {
      caption.clearItemTextLog();

      expect(itemTextLogCleared).toBe(true);
    });
  });
});
