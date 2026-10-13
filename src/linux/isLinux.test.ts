import { isLinux } from "./isLinux";

describe("isLinux", () => {
  let originalPlatform: NodeJS.Platform;

  describe("when the OS is linux", () => {
    beforeEach(() => {
      originalPlatform = process.platform;

      Object.defineProperty(process, "platform", {
        value: "linux",
      });
    });

    afterEach(() => {
      Object.defineProperty(process, "platform", {
        value: originalPlatform,
      });
    });

    it("should return true", () => {
      expect(isLinux()).toBe(true);
    });
  });

  describe("when the OS is not linux", () => {
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
      expect(isLinux()).toBe(false);
    });
  });
});
