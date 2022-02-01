import { KeyCodes } from "./macOS/KeyCodes";
import { Modifiers } from "./macOS/Modifiers";
import { parseKey } from "./parseKey";

describe("parseKey", () => {
  let result;

  describe.each`
    description                                   | keyOrKeys                     | expectedKeyCode                | expectedModifiers
    ${"empty string"}                             | ${""}                         | ${[]}                          | ${[]}
    ${"empty between +"}                          | ${"+++"}                      | ${[]}                          | ${[]}
    ${"invalid key"}                              | ${"invalid-key"}              | ${[]}                          | ${[]}
    ${"invalid key and valid key"}                | ${"invalid-key+a"}            | ${[KeyCodes.a]}                | ${[]}
    ${"single letter"}                            | ${"a"}                        | ${[KeyCodes.a]}                | ${[]}
    ${"single uppercase letter gets capitalized"} | ${"A"}                        | ${[KeyCodes.a]}                | ${[Modifiers.Shift]}
    ${"single number"}                            | ${"0"}                        | ${[KeyCodes.Digit0]}           | ${[]}
    ${"special number syntax"}                    | ${"Digit0"}                   | ${[KeyCodes.Digit0]}           | ${[]}
    ${"special character syntax"}                 | ${"KeyA"}                     | ${[KeyCodes.KeyA]}             | ${[]}
    ${"single special character"}                 | ${"="}                        | ${[KeyCodes.Equals]}           | ${[]}
    ${"single named special character"}           | ${"Add"}                      | ${[KeyCodes.Add]}              | ${[]}
    ${"single function key"}                      | ${"F1"}                       | ${[KeyCodes.F1]}               | ${[]}
    ${"shift modifier and letter"}                | ${"Shift+z"}                  | ${[KeyCodes.z]}                | ${[Modifiers.Shift]}
    ${"fn and function key"}                      | ${"Fn+F11"}                   | ${[KeyCodes.Fn, KeyCodes.F11]} | ${[]}
    ${"multiple modifiers"}                       | ${"Control+Option+Shift+F11"} | ${[KeyCodes.F11]}              | ${[Modifiers.Control, Modifiers.Option, Modifiers.Shift]}
  `("$description", ({ keyOrKeys, expectedKeyCode, expectedModifiers }) => {
    beforeEach(() => {
      result = parseKey(keyOrKeys, Modifiers, KeyCodes);
    });

    it("should return the expected key code command", () => {
      expect(result).toEqual({
        keyCode: expectedKeyCode,
        modifiers: expectedModifiers,
      });
    });
  });
});
