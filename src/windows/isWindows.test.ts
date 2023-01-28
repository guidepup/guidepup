import { isWindows } from "./isWindows";

describe("isWindows", () => {
  let originalPlatform;

  describe("when the OS is win32", () => {
    beforeEach(() => {
      originalPlatform = process.platform;

      Object.defineProperty(process, "platform", {
        value: "win32",
      });
    });

    afterEach(() => {
      Object.defineProperty(process, "platform", {
        value: originalPlatform,
      });
    });

    it("should return true", () => {
      expect(isWindows()).toBe(true);
    });
  });

  describe("when the OS is not win32", () => {
    beforeEach(() => {
      originalPlatform = process.platform;

      Object.defineProperty(process, "platform", {
        value: "test-platform",
      });
    });

    afterEach(() => {
      Object.defineProperty(process, "platform", {
        value: originalPlatform,
      });
    });

    it("should return false", () => {
      expect(isWindows()).toBe(false);
    });
  });
});
