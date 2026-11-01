import { existsSync } from "node:fs";
import { isGuidepupPreferencesMounted } from "./isGuidepupPreferencesMounted";
import { PREFERENCES_PATH } from "./constants";

jest.mock("node:fs", () => ({
  existsSync: jest.fn(),
}));

describe("isGuidepupPreferencesMounted", () => {
  it("should return whether the portable preferences exist on the Guidepup volume", () => {
    const existsDummy = Symbol("test-exists") as unknown as boolean;

    jest.mocked(existsSync).mockReturnValue(existsDummy);

    expect(isGuidepupPreferencesMounted()).toBe(existsDummy);
    expect(existsSync).toHaveBeenCalledWith(PREFERENCES_PATH);
  });
});
