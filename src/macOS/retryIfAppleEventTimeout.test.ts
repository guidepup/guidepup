import { ERR_APPLE_SCRIPT_TIMED_OUT } from "../constants";
import { retryIfAppleEventTimeout } from "./retryIfAppleEventTimeout";

const expected = Symbol("test-expected");
const expectedError = new Error("test-error");

describe("retryIfAppleEventTimeout", () => {
  describe.each`
    description              | options
    ${"the default options"} | ${undefined}
    ${"empty options"}       | ${{}}
  `("when using $description", ({ options }) => {
    describe("when the delegate succeeds first time", () => {
      const delegate = () => Promise.resolve(expected);

      it("should return the return value of the delegate", async () => {
        await expect(retryIfAppleEventTimeout(delegate, options)).resolves.toBe(
          expected
        );
      });
    });

    describe("when the delegate fails first time", () => {
      let count = 0;
      const delegate = () =>
        count++ === 1
          ? Promise.resolve(Symbol("test-symbol"))
          : Promise.reject(expectedError);

      it("should throw the delegate's error", async () => {
        await expect(retryIfAppleEventTimeout(delegate, options)).rejects.toBe(
          expectedError
        );
      });
    });
  });

  describe("when using a custom retryIfAppleEventTimeout count (2)", () => {
    const retries = 2;

    describe("when the delegate succeeds first time", () => {
      const delegate = () => Promise.resolve(expected);

      it("should return the return value of the delegate", async () => {
        await expect(
          retryIfAppleEventTimeout(delegate, { retries })
        ).resolves.toBe(expected);
      });
    });

    describe("when the delegate fails first time, and it is not an applescript timed out error", () => {
      let count = 0;
      const delegate = () =>
        count++ === 1
          ? Promise.resolve(Symbol("test-symbol"))
          : Promise.reject(expectedError);

      it("should throw the delegate's error", async () => {
        await expect(
          retryIfAppleEventTimeout(delegate, { retries })
        ).rejects.toBe(expectedError);
      });
    });

    describe("when the delegate fails first time, and it is applescript timed out error", () => {
      let count = 0;
      const delegate = () =>
        count++ === 1
          ? Promise.resolve(expected)
          : Promise.reject(new Error(ERR_APPLE_SCRIPT_TIMED_OUT));

      it("should return the return value of the delegate", async () => {
        await expect(
          retryIfAppleEventTimeout(delegate, { retries })
        ).resolves.toBe(expected);
      });
    });

    describe("when the delegate fails second time", () => {
      let count = 0;
      const delegate = () =>
        count++ === 2
          ? Promise.resolve(Symbol("test-symbol"))
          : Promise.reject(expectedError);

      it("should throw the delegate's error", async () => {
        await expect(
          retryIfAppleEventTimeout(delegate, { retries })
        ).rejects.toBe(expectedError);
      });
    });
  });
});
