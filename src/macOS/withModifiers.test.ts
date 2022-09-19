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
        `\n\n`
      );
    });
  });

  describe("when modifiers are provided", () => {
    beforeEach(() => {
      modifiers = ["test-modifier-1", "test-modifier-2"];
    });

    it("should start with a newline to ensure the modifications don't invalidate additional script wrappers", () => {
      expect(withModifiers(modifiers, script).startsWith("\n")).toBeTruthy();
    });

    it("should end with a newline to ensure the modifications don't invalidate additional script wrappers", () => {
      expect(withModifiers(modifiers, script).endsWith("\n")).toBeTruthy();
    });


    it("should wrap the script string in key down/up statements", () => {
      expect(withModifiers(modifiers, script)).toEqual(
        `\nkey down test-modifier-1\nkey down test-modifier-2\n${script}\nkey up test-modifier-2\nkey up test-modifier-1\n`
      );
    });

    it("should handle an empty string script", () => {
      expect(withModifiers(modifiers, "")).toEqual(
        `\nkey down test-modifier-1\nkey down test-modifier-2\n\nkey up test-modifier-2\nkey up test-modifier-1\n`
      );
    });
  });
});
