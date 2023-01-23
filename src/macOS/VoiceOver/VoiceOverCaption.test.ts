import { cleanSpokenPhrase } from "./cleanSpokenPhrase";
import { copyLastSpokenPhrase } from "./copyLastSpokenPhrase";
import { itemText } from "./itemText";
import { lastSpokenPhrase } from "./lastSpokenPhrase";
import { LogStore } from "./LogStore";
import { mockType } from "../../../test/mockType";
import { saveLastSpokenPhrase } from "./saveLastSpokenPhrase";
import { VoiceOverCaption } from "./VoiceOverCaption";

jest.mock("./cleanSpokenPhrase", () => ({
  cleanSpokenPhrase: jest.fn(),
}));
jest.mock("./copyLastSpokenPhrase", () => ({
  copyLastSpokenPhrase: jest.fn(),
}));
jest.mock("./itemText", () => ({
  itemText: jest.fn(),
}));
jest.mock("./lastSpokenPhrase", () => ({
  lastSpokenPhrase: jest.fn(),
}));
jest.mock("./LogStore", () => ({
  LogStore: jest.fn(),
}));
jest.mock("./saveLastSpokenPhrase", () => ({
  saveLastSpokenPhrase: jest.fn(),
}));

const cleanPhraseDummy = "test-clean-phrase";
const spokenPhraseDummy = "test-spoken-phrase";
const itemTextDummy = "test-item-text";

describe("VoiceOverCaption", () => {
  let caption: VoiceOverCaption;
  let result;
  let logStoreDummy: LogStore;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();

    mockType(cleanSpokenPhrase).mockReturnValue(cleanPhraseDummy);
    mockType(lastSpokenPhrase).mockResolvedValue(spokenPhraseDummy);
    mockType(itemText).mockResolvedValue(itemTextDummy);

    logStoreDummy = {
      spokenPhraseLog: [spokenPhraseDummy],
      itemTextLog: [itemTextDummy],
    } as LogStore;

    caption = new VoiceOverCaption(logStoreDummy);
    result = undefined;
  });

  describe("lastSpokenPhrase", () => {
    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        result = await caption.lastSpokenPhrase(options);
      });

      it("should get the last spoken phrase from VoiceOver", () => {
        expect(lastSpokenPhrase).toHaveBeenCalledWith(options);
      });

      it("should 'clean' the last spoken phrase to remove the VoiceOver 'missing value' syntax", () => {
        expect(cleanSpokenPhrase).toHaveBeenCalledWith(spokenPhraseDummy);
      });

      it("should return the cleaned last spoken phrase", () => {
        expect(result).toEqual(cleanPhraseDummy);
      });
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
      expect(caption.spokenPhraseLog()).toEqual(logStoreDummy.spokenPhraseLog);
    });
  });

  describe("itemText", () => {
    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        result = await caption.itemText(options);
      });

      it("should get the item text under the VoiceOver cursor", () => {
        expect(itemText).toHaveBeenCalledWith(options);
      });

      it("should 'clean' the item text to remove the VoiceOver 'missing value' syntax", () => {
        expect(cleanSpokenPhrase).toHaveBeenCalledWith(itemTextDummy);
      });

      it("should return the cleaned item text", () => {
        expect(result).toEqual(cleanPhraseDummy);
      });
    });
  });

  describe("getItemTextLog", () => {
    it("should get a log of the item text", () => {
      expect(caption.itemTextLog()).toEqual(logStoreDummy.itemTextLog);
    });
  });
});
