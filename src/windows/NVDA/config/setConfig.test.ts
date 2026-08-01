import { buildIni } from "./buildIni";
import { ERR_NVDA_FAILED_TO_SET_SETTING } from "../../errors";
import { getConfig } from "./getConfig";
import { join } from "node:path";
import { resolveSessionUserConfigPath } from "./resolveSessionUserConfigPath";
import { setConfig } from "./setConfig";
import { writeFileSync } from "node:fs";

jest.mock("./buildIni", () => ({
  buildIni: jest.fn(),
}));

jest.mock("./getConfig", () => ({
  getConfig: jest.fn(),
}));

jest.mock("./resolveSessionUserConfigPath", () => ({
  resolveSessionUserConfigPath: jest.fn(),
}));

jest.mock("node:fs", () => ({
  writeFileSync: jest.fn(),
}));

const configDummy = {
  existingSetting: "existing-value",
};

const desiredConfigDummy = {
  desiredSetting: "desired-value",
};

const updatedConfigDummy = {
  existingSetting: "existing-value",
  desiredConfig: desiredConfigDummy,
};

const sessionUserConfigPathDummy = "test-session-user-config";
const iniConfigDummy = "test-ini-config";

const errorDummy = new Error("test-error");

describe("setConfig", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.mocked(getConfig).mockReturnValue(configDummy);
    jest
      .mocked(resolveSessionUserConfigPath)
      .mockReturnValue(sessionUserConfigPathDummy);
    jest.mocked(buildIni).mockReturnValue(iniConfigDummy);
  });

  it("should get the current config", () => {
    setConfig(desiredConfigDummy);

    expect(getConfig).toHaveBeenCalled();
  });

  it("should build the updated config", () => {
    setConfig(desiredConfigDummy);

    expect(buildIni).toHaveBeenCalledWith(updatedConfigDummy);
  });

  it("should resolve the session user config path", () => {
    setConfig(desiredConfigDummy);

    expect(resolveSessionUserConfigPath).toHaveBeenCalled();
  });

  it("should write the config file", () => {
    setConfig(desiredConfigDummy);

    expect(writeFileSync).toHaveBeenCalledWith(
      join(sessionUserConfigPathDummy, "nvda.ini"),
      iniConfigDummy,
    );
  });

  describe("when getting the current config fails", () => {
    beforeEach(() => {
      jest.mocked(getConfig).mockImplementation(() => {
        throw errorDummy;
      });
    });

    it("should throw an error with the cause", () => {
      expect(() => setConfig(desiredConfigDummy)).toThrow(
        new Error(ERR_NVDA_FAILED_TO_SET_SETTING, {
          cause: errorDummy,
        }),
      );
    });
  });

  describe("when building the config fails", () => {
    beforeEach(() => {
      jest.mocked(buildIni).mockImplementation(() => {
        throw errorDummy;
      });
    });

    it("should throw an error with the cause", () => {
      expect(() => setConfig(desiredConfigDummy)).toThrow(
        new Error(ERR_NVDA_FAILED_TO_SET_SETTING, {
          cause: errorDummy,
        }),
      );
    });
  });

  describe("when writing the config file fails", () => {
    beforeEach(() => {
      jest.mocked(writeFileSync).mockImplementation(() => {
        throw errorDummy;
      });
    });

    it("should throw an error with the cause", () => {
      expect(() => setConfig(desiredConfigDummy)).toThrow(
        new Error(ERR_NVDA_FAILED_TO_SET_SETTING, {
          cause: errorDummy,
        }),
      );
    });
  });
});
