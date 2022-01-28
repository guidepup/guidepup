import { mockType } from "../../../test/mockType";
import { ERR_VOICE_OVER_PERFORM_ACTION } from "../errors";
import { keyCode } from "../keyCode";
import { KeyCodes } from "../KeyCodes";
import { performAction } from "./performAction";

jest.mock("../keyCode", () => ({
  keyCode: jest.fn(),
}));

describe("performAction", () => {
  let resultPromise, keyCodeResolver, keyCodeRejector;

  describe.each`
    description          | options
    ${"without options"} | ${undefined}
    ${"with options"}    | ${{}}
  `("when called $description", ({ options }) => {
    beforeEach(() => {
      const keyCodePromiseStub = new Promise<void>((resolve, reject) => {
        keyCodeResolver = resolve;
        keyCodeRejector = reject;
      });

      mockType(keyCode).mockReturnValue(keyCodePromiseStub);

      resultPromise = performAction(options);
    });

    it("should fire an 'Enter' key code", () => {
      expect(keyCode).toHaveBeenCalledWith(
        { keyCode: KeyCodes.KEY_ENTER },
        options
      );
    });

    describe("when the key code is successful", () => {
      beforeEach(() => {
        keyCodeResolver();
      });

      it("should resolve", async () => {
        await expect(resultPromise).resolves.toBeUndefined();
      });
    });

    describe("when the key code throws", () => {
      const error = new Error("test-error");

      beforeEach(() => {
        keyCodeRejector(error);
      });

      it("should reject", async () => {
        await expect(resultPromise).rejects.toEqual(
          new Error(`${ERR_VOICE_OVER_PERFORM_ACTION}\n${error.message}`)
        );
      });
    });
  });
});
