import { isKeyCode } from "./isKeyCode";

describe("isKeyCode", () => {
  describe.each`
    command                              | expected
    ${123456}                            | ${false}
    ${"test-string"}                     | ${false}
    ${() => null}                        | ${false}
    ${Symbol("test-symbol")}             | ${false}
    ${undefined}                         | ${false}
    ${null}                              | ${false}
    ${{}}                                | ${false}
    ${{ characters: "test-characters" }} | ${false}
    ${{ keyCode: 123456 }}               | ${true}
  `("when passed a $command", ({ command, expected }) => {
    it(`should return "${expected}"`, () => {
      expect(isKeyCode(command)).toBe(expected);
    });
  });
});
