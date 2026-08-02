import { ERR_VOICE_OVER_FAILED_TO_MOUNT_GUIDEPUP_PREFERENCES } from "../../errors";
import { execFileSync } from "node:child_process";
import { GUIDEPUP_IDENTIFIER } from "./constants";
import { trustPortableIdentifier } from "./trustPortableIdentifier";

jest.mock("node:child_process", () => ({
  execFileSync: jest.fn(),
}));

const preferencesDirectoryDummy = "test-preferences-directory";
const localPlistDummy =
  "test-preferences-directory/com.apple.VoiceOver4.local.plist";

const identifiersWithoutGuidepupDummy = `Array {
    Existing.Identifier
}
`;

const identifiersWithGuidepupDummy = `Array {
    Existing.Identifier
    ${GUIDEPUP_IDENTIFIER}
}
`;

const emptyIdentifiersDummy = "Array {\n}\n";

const errorDummy = {
  stderr: "test-error",
};

describe("trustPortableIdentifier", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when the portable identifier setting exists", () => {
    beforeEach(() => {
      jest
        .mocked(execFileSync)
        .mockReturnValue(identifiersWithoutGuidepupDummy);

      trustPortableIdentifier(preferencesDirectoryDummy);
    });

    it("should read the portable identifier setting", () => {
      expect(execFileSync).toHaveBeenCalledWith(
        "/usr/libexec/PlistBuddy",
        ["-c", "Print :SCRCUserDefaultsAlwaysUsePortableIDs", localPlistDummy],
        {
          encoding: "utf-8",
          stdio: ["ignore", "pipe", "pipe"],
        },
      );
    });

    it("should add the Guidepup identifier", () => {
      expect(execFileSync).toHaveBeenNthCalledWith(
        2,
        "/usr/libexec/PlistBuddy",
        [
          "-c",
          `Add :SCRCUserDefaultsAlwaysUsePortableIDs:1 string ${GUIDEPUP_IDENTIFIER}`,
          localPlistDummy,
        ],
        {
          stdio: "ignore",
        },
      );
    });
  });

  describe("when the portable identifier already contains the Guidepup identifier", () => {
    beforeEach(() => {
      jest.mocked(execFileSync).mockReturnValue(identifiersWithGuidepupDummy);

      trustPortableIdentifier(preferencesDirectoryDummy);
    });

    it("should not add the Guidepup identifier", () => {
      expect(execFileSync).toHaveBeenCalledTimes(1);
    });
  });

  describe("when the portable identifier setting does not exist", () => {
    beforeEach(() => {
      jest
        .mocked(execFileSync)
        .mockImplementationOnce(() => {
          throw {
            stderr: "Does Not Exist",
          };
        })
        .mockReturnValue("");

      trustPortableIdentifier(preferencesDirectoryDummy);
    });

    it("should create the portable identifier setting", () => {
      expect(execFileSync).toHaveBeenNthCalledWith(
        2,
        "/usr/libexec/PlistBuddy",
        [
          "-c",
          "Add :SCRCUserDefaultsAlwaysUsePortableIDs array",
          localPlistDummy,
        ],
        {
          stdio: "ignore",
        },
      );
    });

    it("should add the Guidepup identifier", () => {
      expect(execFileSync).toHaveBeenNthCalledWith(
        3,
        "/usr/libexec/PlistBuddy",
        [
          "-c",
          `Add :SCRCUserDefaultsAlwaysUsePortableIDs:0 string ${GUIDEPUP_IDENTIFIER}`,
          localPlistDummy,
        ],
        {
          stdio: "ignore",
        },
      );
    });
  });

  describe("when reading the portable identifier setting fails for another reason", () => {
    beforeEach(() => {
      jest.mocked(execFileSync).mockImplementation(() => {
        throw errorDummy;
      });
    });

    it("should throw an error with the cause", () => {
      expect(() => trustPortableIdentifier(preferencesDirectoryDummy)).toThrow(
        new Error(ERR_VOICE_OVER_FAILED_TO_MOUNT_GUIDEPUP_PREFERENCES, {
          cause: errorDummy,
        }),
      );
    });
  });

  describe("when creating the portable identifier setting fails", () => {
    beforeEach(() => {
      jest
        .mocked(execFileSync)
        .mockImplementationOnce(() => {
          throw {
            stderr: "Does Not Exist",
          };
        })
        .mockImplementation(() => {
          throw errorDummy;
        });
    });

    it("should throw an error with the cause", () => {
      expect(() => trustPortableIdentifier(preferencesDirectoryDummy)).toThrow(
        new Error(ERR_VOICE_OVER_FAILED_TO_MOUNT_GUIDEPUP_PREFERENCES, {
          cause: errorDummy,
        }),
      );
    });
  });

  describe("when adding the Guidepup identifier fails", () => {
    beforeEach(() => {
      jest
        .mocked(execFileSync)
        .mockReturnValueOnce(emptyIdentifiersDummy)
        .mockImplementation(() => {
          throw errorDummy;
        });
    });

    it("should throw an error with the cause", () => {
      expect(() => trustPortableIdentifier(preferencesDirectoryDummy)).toThrow(
        new Error(ERR_VOICE_OVER_FAILED_TO_MOUNT_GUIDEPUP_PREFERENCES, {
          cause: errorDummy,
        }),
      );
    });
  });
});
