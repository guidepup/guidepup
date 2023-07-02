import { enabledDbFile } from "./enabledDbFile";
import { enabledDefaults } from "./enabledDefaults";
import { supportsAppleScriptControl } from "./supportsAppleScriptControl";

jest.mock("./enabledDefaults", () => ({
  enabledDefaults: jest.fn(),
}));
jest.mock("./enabledDbFile", () => ({
  enabledDbFile: jest.fn(),
}));

describe("supportsAppleScriptControl", () => {
  describe.each`
    defaults | db       | expected
    ${false} | ${false} | ${false}
    ${false} | ${true}  | ${false}
    ${true}  | ${false} | ${false}
    ${true}  | ${true}  | ${true}
  `(
    "when enabled defaults is $defaults and enabled db file is $db",
    ({ defaults, db, expected }) => {
      let result;

      beforeEach(async () => {
        jest.clearAllMocks();

        jest.mocked(enabledDefaults).mockResolvedValue(defaults);
        jest.mocked(enabledDbFile).mockResolvedValue(db);

        result = await supportsAppleScriptControl();
      });

      it("should check if the VoiceOver defaults for allowing AppleScript control are enabled", () => {
        expect(enabledDefaults).toHaveBeenCalled();
      });

      it("should check if the database file to allow AppleScript control has been created", () => {
        expect(enabledDbFile).toHaveBeenCalled();
      });

      it(`should return ${expected}`, () => {
        expect(result).toEqual(expected);
      });
    }
  );
});
