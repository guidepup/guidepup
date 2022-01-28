import { isMacOS } from "./isMacOS";

describe("isMacOS", () => {
  let originalPlatform;

  describe("when the OS is darwin", () => {
    beforeEach(() => {
      originalPlatform = process.platform;

      Object.defineProperty(process, "platform", {
        value: "darwin",
      });
    });

    afterEach(() => {
      Object.defineProperty(process, "platform", {
        value: originalPlatform,
      });
    });

    it("should return true", () => {
      expect(isMacOS()).toBe(true);
    });
  });

  describe("when the OS is not darwin", () => {
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
      expect(isMacOS()).toBe(false);
    });
  });
});
