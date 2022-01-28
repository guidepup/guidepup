import { retry } from "./retry";

const expected = Symbol("test-expected");
const expectedError = new Error("test-error");

describe("retry", () => {
  describe.each`
    description              | options
    ${"the default options"} | ${undefined}
    ${"empty options"}       | ${{}}
  `("when using $description", ({ options }) => {
    describe("when the delegate succeeds first time", () => {
      const delegate = () => Promise.resolve(expected);

      it("should return the return value of the delegate", async () => {
        await expect(retry(delegate, options)).resolves.toBe(expected);
      });
    });

    describe("when the delegate fails first time, and succeeds second time", () => {
      let count = 0;
      const delegate = () =>
        count++ === 1
          ? Promise.resolve(expected)
          : Promise.reject(new Error("test-error"));

      it("should return the return value of the delegate", async () => {
        await expect(retry(delegate, options)).resolves.toBe(expected);
      });
    });

    describe("when the delegate fails second time, and succeeds third time", () => {
      let count = 0;
      const delegate = () =>
        count++ === 2
          ? Promise.resolve(expected)
          : Promise.reject(new Error("test-error"));

      it("should return the return value of the delegate", async () => {
        await expect(retry(delegate, options)).resolves.toBe(expected);
      });
    });

    describe("when the delegate fails third time", () => {
      let count = 0;
      const delegate = () =>
        count++ === 3
          ? Promise.resolve(Symbol("test-symbol"))
          : Promise.reject(expectedError);

      it("should throw the delegate's error", async () => {
        await expect(retry(delegate, options)).rejects.toBe(expectedError);
      });
    });
  });

  describe("when using a custom retry count (1)", () => {
    const retries = 1;

    describe("when the delegate succeeds first time", () => {
      const delegate = () => Promise.resolve(expected);

      it("should return the return value of the delegate", async () => {
        await expect(retry(delegate, { retries })).resolves.toBe(expected);
      });
    });

    describe("when the delegate fails first time", () => {
      let count = 0;
      const delegate = () =>
        count++ === 1
          ? Promise.resolve(Symbol("test-symbol"))
          : Promise.reject(expectedError);

      it("should throw the delegate's error", async () => {
        await expect(retry(delegate, { retries })).rejects.toBe(expectedError);
      });
    });
  });
});
