import { Modifiers } from "./Modifiers";
import { withModifiers } from "./withModifiers";

const script = "test-script";

describe("withModifiers", () => {
  let modifiers;

  describe("when no modifiers are provided", () => {
    beforeEach(() => {
      modifiers = [];
    });

    it("should start with a newline to ensure the modifications don't invalidate additional script wrappers", () => {
      expect(withModifiers(modifiers, script).startsWith("\n")).toBeTruthy();
    });

    it("should end with a newline to ensure the modifications don't invalidate additional script wrappers", () => {
      expect(withModifiers(modifiers, script).endsWith("\n")).toBeTruthy();
    });


    it("should not wrap the script string in any key down/up statements", () => {
      expect(withModifiers(modifiers, script)).toEqual(
        `\n${script}\n`
      );
    });

    it("should handle an empty string script", () => {
      expect(withModifiers(modifiers, "")).toEqual(
        `\n`
      );
    });
  });

  describe("when just non-shift modifiers are provided", () => {
    beforeEach(() => {
      modifiers = ["test-modifier-1", "test-modifier-2"];
    });

    it("should start with a newline to ensure the modifications don't invalidate additional script wrappers", () => {
      expect(withModifiers(modifiers, script).startsWith("\n")).toBeTruthy();
    });

    it("should end with a newline to ensure the modifications don't invalidate additional script wrappers", () => {
      expect(withModifiers(modifiers, script).endsWith("\n")).toBeTruthy();
    });


    it("should wrap the script string with key down/up statements", () => {
      expect(withModifiers(modifiers, script)).toEqual(
        `\n${script} using {test-modifier-1 down, test-modifier-2 down}\n`
      );
    });

    it("should handle an empty string script", () => {
      expect(withModifiers(modifiers, "")).toEqual(
        `\n`
      );
    });
  });

  describe("when just shift modifiers are provided", () => {
    beforeEach(() => {
      modifiers = [Modifiers.Shift];
    });

    it("should start with a newline to ensure the modifications don't invalidate additional script wrappers", () => {
      expect(withModifiers(modifiers, script).startsWith("\n")).toBeTruthy();
    });

    it("should end with a newline to ensure the modifications don't invalidate additional script wrappers", () => {
      expect(withModifiers(modifiers, script).endsWith("\n")).toBeTruthy();
    });

    it("should wrap the script string with key down/up statements", () => {
      expect(withModifiers(modifiers, script)).toEqual(
        `\nkey down shift\n${script}\nkey up shift\n`
      );
    });

    it("should handle an empty string script", () => {
      expect(withModifiers(modifiers, "")).toEqual(`\n`);
    });
  });

  describe("when just shift and other modifiers are provided", () => {
    beforeEach(() => {
      modifiers = [Modifiers.Shift, "test-modifier-1", "test-modifier-2"];
    });

    it("should start with a newline to ensure the modifications don't invalidate additional script wrappers", () => {
      expect(withModifiers(modifiers, script).startsWith("\n")).toBeTruthy();
    });

    it("should end with a newline to ensure the modifications don't invalidate additional script wrappers", () => {
      expect(withModifiers(modifiers, script).endsWith("\n")).toBeTruthy();
    });

    it("should wrap the script string with key down/up statements", () => {
      expect(withModifiers(modifiers, script)).toEqual(
        `\nkey down shift\n${script} using {test-modifier-1 down, test-modifier-2 down}\nkey up shift\n`
      );
    });

    it("should handle an empty string script", () => {
      expect(withModifiers(modifiers, "")).toEqual(`\n`);
    });
  });
});
