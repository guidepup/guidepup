import { isKeystroke } from "./isKeystroke";

describe("isKeystroke", () => {
  describe.each`
    command                              | expected
    ${123456}                            | ${false}
    ${"test-string"}                     | ${false}
    ${() => null}                        | ${false}
    ${Symbol("test-symbol")}             | ${false}
    ${undefined}                         | ${false}
    ${null}                              | ${false}
    ${{}}                                | ${false}
    ${{ keyCode: 123456 }}               | ${false}
    ${{ characters: "test-characters" }} | ${true}
  `("when passed a $command", ({ command, expected }) => {
    it(`should return "${expected}"`, () => {
      expect(isKeystroke(command)).toBe(expected);
    });
  });
});
