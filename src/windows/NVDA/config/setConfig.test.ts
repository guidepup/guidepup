import { buildIni } from "./buildIni";
import { deepMerge } from "../../../deepMerge";
import { ERR_NVDA_FAILED_TO_SET_SETTING } from "../../errors";
import { getConfig } from "./getConfig";
import { join } from "node:path";
import { resolveSessionUserConfigPath } from "./resolveSessionUserConfigPath";
import { setConfig } from "./setConfig";
import { writeFileSync } from "node:fs";

jest.mock("./buildIni", () => ({
  buildIni: jest.fn(),
}));

jest.mock("../../../deepMerge", () => ({
  deepMerge: jest.fn(),
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
  existing: "config",
};

const desiredConfigDummy = {
  desired: "config",
};

const mergedConfigDummy = {
  merged: "config",
};

const builtConfigDummy = "built config";

const sessionUserConfigPathDummy = "test-session-user-config";

const errorDummy = new Error("test-error");

describe("setConfig", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.mocked(getConfig).mockReturnValue(configDummy);
    jest.mocked(deepMerge).mockReturnValue(mergedConfigDummy);
    jest
      .mocked(resolveSessionUserConfigPath)
      .mockReturnValue(sessionUserConfigPathDummy);
    jest.mocked(buildIni).mockReturnValue(builtConfigDummy);
  });

  it("should get the existing config", () => {
    setConfig(desiredConfigDummy);

    expect(getConfig).toHaveBeenCalled();
  });

  it("should merge the desired config with the existing config", () => {
    setConfig(desiredConfigDummy);

    expect(deepMerge).toHaveBeenCalledWith(configDummy, desiredConfigDummy);
  });

  it("should build the merged config as an ini file", () => {
    setConfig(desiredConfigDummy);

    expect(buildIni).toHaveBeenCalledWith(mergedConfigDummy);
  });

  it("should write the config to the session user config path", () => {
    setConfig(desiredConfigDummy);

    expect(writeFileSync).toHaveBeenCalledWith(
      join(sessionUserConfigPathDummy, "nvda.ini"),
      builtConfigDummy,
    );
  });

  describe("when getting the config fails", () => {
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

  describe("when merging the config fails", () => {
    beforeEach(() => {
      jest.mocked(deepMerge).mockImplementation(() => {
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

  describe("when writing the config fails", () => {
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
