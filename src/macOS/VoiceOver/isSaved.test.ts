import { isSaved } from "./isSaved";
import { lastSpokenPhrase } from "./lastSpokenPhrase";
import { mockType } from "../../../test/mockType";

jest.mock("./lastSpokenPhrase", () => ({
  lastSpokenPhrase: jest.fn(),
}));

describe("isSaved", () => {
  describe.each`
    description          | options
    ${"without options"} | ${undefined}
    ${"with options"}    | ${{}}
  `("when called $description", ({ options }) => {
    let resultPromise, lastPhraseResolver;

    beforeEach(async () => {
      const lastPhrasePromise = new Promise<string>((resolve) => {
        lastPhraseResolver = resolve;
      });

      mockType(lastSpokenPhrase).mockReturnValue(lastPhrasePromise);

      resultPromise = isSaved(options);
    });

    afterEach(async () => {
      lastPhraseResolver("");
      await resultPromise;
    });

    it("should get the last phrase", () => {
      expect(lastSpokenPhrase).toHaveBeenCalledWith(options);
    });

    describe("when the last phrase states the save is complete", () => {
      beforeEach(() => {
        lastPhraseResolver("Last phrase saved to Desktop test-suffix");
      });

      it("should return true", async () => {
        await expect(resultPromise).resolves.toBe(true);
      });
    });

    describe("when the last phrase doesn't state the save is complete", () => {
      beforeEach(() => {
        lastPhraseResolver("test-last-phrase");
      });

      it("should return false", async () => {
        await expect(resultPromise).resolves.toBe(false);
      });
    });
  });
});
