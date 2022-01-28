import { supportsAppleScriptControl } from "./supportsAppleScriptControl";
import { enabledDefaults } from "./enabledDefaults";
import { enabledDbFile } from "./enabledDbFile";
import { mockType } from "../../../../test/mockType";

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

        mockType(enabledDefaults).mockResolvedValue(defaults);
        mockType(enabledDbFile).mockResolvedValue(db);

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
