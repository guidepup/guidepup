import {
  ERR_NVDA_ALREADY_RUNNING,
  ERR_NVDA_CANNOT_BE_STARTED,
  ERR_NVDA_NOT_INSTALLED,
  ERR_NVDA_NOT_RUNNING,
} from "../errors";
import {
  navigateUntil,
  type NavigateUntilMethod,
  type NavigationMethod,
} from "../../navigateUntil";
import { delay } from "../../delay";
import { getUserNVDAInstallationPath } from "./getUserNVDAInstallationPath";
import { isAnyNVDARunning } from "./isAnyNVDARunning";
import { isNVDAInstalled } from "./isNVDAInstalled";
import { isRunning } from "./isRunning";
import { isWindows } from "../isWindows";
import { NVDA } from "./NVDA";
import { NVDAClient } from "./NVDAClient";
import { quit } from "./quit";
import { start } from "./start";
import { startUserNVDA } from "./startUserNVDA";

jest.mock("../../../manifest.json", () => {
  return {
    screenReaders: [
      {
        id: "nvda",
        assets: [
          {
            version: "test-version",
          },
        ],
      },
    ],
  };
});

jest.mock("./config", () => ({
  createGuidepupConfig: jest.fn(),
  deleteGuidepupConfig: jest.fn(),
  getConfig: jest.fn(),
  getConfigKey: jest.fn(),
  setConfig: jest.fn(),
}));
jest.mock("./isNVDAInstalled", () => ({
  isNVDAInstalled: jest.fn(),
}));
jest.mock("../isWindows", () => ({
  isWindows: jest.fn(),
}));
jest.mock("./NVDAClient", () => ({
  NVDAClient: jest.fn(),
}));
jest.mock("./quit", () => ({
  quit: jest.fn(),
}));
jest.mock("./start", () => ({
  start: jest.fn(),
}));
jest.mock("../../navigateUntil", () => ({
  navigateUntil: jest.fn(),
}));
jest.mock("./isRunning", () => ({
  isRunning: jest.fn(),
}));
jest.mock("./isAnyNVDARunning", () => ({
  isAnyNVDARunning: jest.fn(),
}));
jest.mock("./getUserNVDAInstallationPath", () => ({
  getUserNVDAInstallationPath: jest.fn(),
}));
jest.mock("./startUserNVDA", () => ({
  startUserNVDA: jest.fn(),
}));

const mockInstalledPath = "C:\\Program Files\\NVDA\\nvda.exe";

const NVDAClientStub = {
  connect: jest.fn(),
  stop: jest.fn(),
  sendKeyCode: jest.fn(),
  enqueueAndTap: jest.fn(),
  spokenPhraseLog: jest.fn(),
  clearSpokenPhraseLog: jest.fn(),
} as unknown as NVDAClient;

describe("NVDA", () => {
  let nvda: NVDA;

  beforeEach(() => {
    jest.clearAllMocks();

    jest.mocked(isWindows).mockReturnValue(true);
    jest.mocked(isNVDAInstalled).mockReturnValue(true);
    jest.mocked(NVDAClientStub.connect).mockResolvedValue(undefined);
    jest.mocked(NVDAClient).mockImplementation(() => NVDAClientStub);
    jest.mocked(isRunning).mockResolvedValue(false);
    jest.mocked(isAnyNVDARunning).mockResolvedValue(false);
    jest.mocked(getUserNVDAInstallationPath).mockReturnValue(mockInstalledPath);
    jest.mocked(startUserNVDA).mockResolvedValue(undefined);
    jest.mocked(start).mockResolvedValue(undefined);
  });

  describe("name", () => {
    it("should return NVDA", () => {
      nvda = new NVDA();

      expect(nvda.name).toBe("NVDA");
    });
  });

  describe("version", () => {
    it("should return the NVDA version", () => {
      nvda = new NVDA();

      expect(nvda.version).toBe("test-version");
    });
  });

  describe("detect", () => {
    describe("when on Windows", () => {
      it("should return true", () => {
        nvda = new NVDA();

        const result = nvda.detect();

        expect(result).toBe(true);
      });
    });

    describe("when not on Windows", () => {
      beforeEach(() => {
        jest.mocked(isWindows).mockReturnValue(false);
      });

      it("should return false", () => {
        nvda = new NVDA();

        const result = nvda.detect();

        expect(result).toBe(false);
      });
    });
  });

  describe("start", () => {
    beforeEach(() => {
      nvda = new NVDA();
    });

    describe("when NVDA is not already running", () => {
      it("should start NVDA", async () => {
        await nvda.start();

        expect(start).toHaveBeenCalled();
      });
    });

    describe("when NVDA is already running", () => {
      beforeEach(async () => {
        await nvda.start();
      });

      it("should throw an error", async () => {
        await expect(async () => await nvda.start()).rejects.toThrow(
          ERR_NVDA_ALREADY_RUNNING,
        );
      });
    });

    describe("when NVDA is not installed", () => {
      beforeEach(async () => {
        jest.mocked(isNVDAInstalled).mockReturnValue(false);
      });

      it("should throw an error", async () => {
        await expect(async () => await nvda.start()).rejects.toThrow(
          ERR_NVDA_NOT_INSTALLED,
        );
      });
    });
  });

  describe("stop", () => {
    beforeEach(() => {
      nvda = new NVDA();
    });

    describe("when NVDA is not running", () => {
      it("should throw an error", async () => {
        await expect(async () => await nvda.stop()).rejects.toThrow(
          ERR_NVDA_NOT_RUNNING,
        );
      });
    });

    describe("when NVDA is running", () => {
      beforeEach(async () => {
        jest.mocked(start).mockResolvedValue(undefined);
        jest.mocked(quit).mockReturnValue(undefined);

        await nvda.start();

        jest.clearAllMocks();

        await nvda.stop();
      });

      it("should stop the client", () => {
        expect(NVDAClientStub.stop).toHaveBeenCalled();
      });

      it("should quit NVDA", () => {
        expect(quit).toHaveBeenCalled();
      });
    });

    describe("when quitting NVDA fails", () => {
      const mockQuitError = new Error("test-quit-error");

      let error: unknown;

      beforeEach(async () => {
        jest.mocked(start).mockResolvedValue(undefined);
        jest.mocked(quit).mockReturnValue(undefined);

        await nvda.start();

        jest.clearAllMocks();

        jest.mocked(quit).mockImplementationOnce(() => {
          throw mockQuitError;
        });

        try {
          await nvda.stop();
        } catch (e) {
          error = e;
        }
      });

      it("should throw the quit error", () => {
        expect(error).toBe(mockQuitError);
      });

      it("should allow stop to be retried", async () => {
        await expect(nvda.stop()).resolves.toBeUndefined();

        expect(quit).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe("when another NVDA may be running on start", () => {
    beforeEach(() => {
      nvda = new NVDA();
    });

    describe("when no NVDA is running", () => {
      beforeEach(async () => {
        await nvda.start();
      });

      it("should check if any NVDA is running", () => {
        expect(isAnyNVDARunning).toHaveBeenCalled();
      });

      it("should not quit NVDA", () => {
        expect(quit).not.toHaveBeenCalled();
      });

      it("should not start the user's NVDA on stop", async () => {
        await nvda.stop();

        expect(startUserNVDA).not.toHaveBeenCalled();
      });
    });

    describe("when a Guidepup NVDA from an earlier run is running", () => {
      beforeEach(async () => {
        jest.mocked(isRunning).mockResolvedValue(true);

        await nvda.start();
      });

      it("should quit NVDA", () => {
        expect(quit).toHaveBeenCalledTimes(1);
      });

      it("should not look for the installed NVDA", () => {
        expect(getUserNVDAInstallationPath).not.toHaveBeenCalled();
      });

      it("should not start an NVDA again on stop", async () => {
        await nvda.stop();

        expect(startUserNVDA).not.toHaveBeenCalled();
      });
    });

    describe("when it cannot tell if an NVDA is running", () => {
      beforeEach(async () => {
        jest
          .mocked(isAnyNVDARunning)
          .mockRejectedValue(new Error("test-error"));

        await nvda.start();
      });

      it("should quit NVDA", () => {
        expect(quit).toHaveBeenCalledTimes(1);
      });

      it("should not look for the installed NVDA", () => {
        expect(getUserNVDAInstallationPath).not.toHaveBeenCalled();
      });
    });

    describe("when the user's NVDA is running", () => {
      beforeEach(() => {
        jest.mocked(isAnyNVDARunning).mockResolvedValue(true);
      });

      describe("when started with the default options", () => {
        beforeEach(async () => {
          await nvda.start();
        });

        it("should look for the installed NVDA", () => {
          expect(getUserNVDAInstallationPath).toHaveBeenCalled();
        });

        it("should quit NVDA", () => {
          expect(quit).toHaveBeenCalledTimes(1);
        });

        it("should not start the user's NVDA before stop", () => {
          expect(startUserNVDA).not.toHaveBeenCalled();
        });

        it("should start the user's NVDA again on stop, after quitting NVDA", async () => {
          await nvda.stop();

          expect(startUserNVDA).toHaveBeenCalledWith(mockInstalledPath);
          expect(jest.mocked(quit).mock.invocationCallOrder[1]).toBeLessThan(
            jest.mocked(startUserNVDA).mock.invocationCallOrder[0],
          );
        });

        it("should start the user's NVDA again only once", async () => {
          await nvda.stop();

          jest.mocked(isAnyNVDARunning).mockResolvedValue(false);

          await nvda.start();
          await nvda.stop();

          expect(startUserNVDA).toHaveBeenCalledTimes(1);
        });
      });

      describe("when started with restoreUserScreenReader set to false", () => {
        beforeEach(async () => {
          await nvda.start({ restoreUserScreenReader: false });
        });

        it("should quit NVDA", () => {
          expect(quit).toHaveBeenCalledTimes(1);
        });

        it("should not look for the installed NVDA", () => {
          expect(getUserNVDAInstallationPath).not.toHaveBeenCalled();
        });

        it("should not start the user's NVDA again on stop", async () => {
          await nvda.stop();

          expect(startUserNVDA).not.toHaveBeenCalled();
        });
      });

      describe("when the installed NVDA cannot be found", () => {
        beforeEach(async () => {
          jest.mocked(getUserNVDAInstallationPath).mockReturnValue(null);

          await nvda.start();
        });

        it("should quit NVDA", () => {
          expect(quit).toHaveBeenCalledTimes(1);
        });

        it("should not start an NVDA again on stop", async () => {
          await nvda.stop();

          expect(startUserNVDA).not.toHaveBeenCalled();
        });
      });

      describe("when the user's NVDA cannot be started again", () => {
        it("should still stop", async () => {
          jest
            .mocked(startUserNVDA)
            .mockRejectedValue(new Error("test-error"));

          await nvda.start();

          await expect(nvda.stop()).resolves.toBeUndefined();
          expect(startUserNVDA).toHaveBeenCalled();
        });
      });

      describe("when Guidepup's NVDA fails to start", () => {
        let error: unknown;

        beforeEach(async () => {
          jest.mocked(start).mockRejectedValue(new Error("test-error"));

          try {
            await nvda.start();
          } catch (e) {
            error = e;
          }
        });

        it("should throw a cannot be started error", () => {
          expect(error).toEqual(new Error(ERR_NVDA_CANNOT_BE_STARTED));
        });

        it("should start the user's NVDA again", () => {
          expect(startUserNVDA).toHaveBeenCalledWith(mockInstalledPath);
        });
      });
    });
  });

  describe("previous", () => {
    beforeEach(() => {
      nvda = new NVDA();
    });

    describe("when NVDA is not running", () => {
      it("should throw an error", async () => {
        await expect(async () => await nvda.previous()).rejects.toThrow(
          ERR_NVDA_NOT_RUNNING,
        );
      });
    });

    describe("when NVDA is running", () => {
      beforeEach(async () => {
        jest.mocked(start).mockResolvedValue(undefined);

        await nvda.start();

        jest.clearAllMocks();

        await nvda.previous();
      });

      it("should enqueue a key press command", () => {
        expect(NVDAClientStub.enqueueAndTap).toHaveBeenCalled();
      });
    });
  });

  describe("next", () => {
    beforeEach(() => {
      nvda = new NVDA();
    });

    describe("when NVDA is not running", () => {
      it("should throw an error", async () => {
        await expect(async () => await nvda.next()).rejects.toThrow(
          ERR_NVDA_NOT_RUNNING,
        );
      });
    });

    describe("when NVDA is running", () => {
      beforeEach(async () => {
        jest.mocked(start).mockResolvedValue(undefined);

        await nvda.start();

        jest.clearAllMocks();

        await nvda.next();
      });

      it("should enqueue a key press command", () => {
        expect(NVDAClientStub.enqueueAndTap).toHaveBeenCalled();
      });
    });
  });

  describe("previousHeading", () => {
    beforeEach(() => {
      nvda = new NVDA();
    });

    describe("when NVDA is not running", () => {
      it("should throw an error", async () => {
        await expect(async () => await nvda.previousHeading()).rejects.toThrow(
          ERR_NVDA_NOT_RUNNING,
        );
      });
    });

    describe("when NVDA is running", () => {
      beforeEach(async () => {
        jest.mocked(start).mockResolvedValue(undefined);

        await nvda.start();

        jest.clearAllMocks();

        await nvda.previousHeading();
      });

      it("should enqueue a key press command", () => {
        expect(NVDAClientStub.enqueueAndTap).toHaveBeenCalled();
      });
    });
  });

  describe("nextHeading", () => {
    beforeEach(() => {
      nvda = new NVDA();
    });

    describe("when NVDA is not running", () => {
      it("should throw an error", async () => {
        await expect(async () => await nvda.nextHeading()).rejects.toThrow(
          ERR_NVDA_NOT_RUNNING,
        );
      });
    });

    describe("when NVDA is running", () => {
      beforeEach(async () => {
        jest.mocked(start).mockResolvedValue(undefined);

        await nvda.start();

        jest.clearAllMocks();

        await nvda.nextHeading();
      });

      it("should enqueue a key press command", () => {
        expect(NVDAClientStub.enqueueAndTap).toHaveBeenCalled();
      });
    });
  });

  describe("previousLink", () => {
    beforeEach(() => {
      nvda = new NVDA();
    });

    describe("when NVDA is not running", () => {
      it("should throw an error", async () => {
        await expect(async () => await nvda.previousLink()).rejects.toThrow(
          ERR_NVDA_NOT_RUNNING,
        );
      });
    });

    describe("when NVDA is running", () => {
      beforeEach(async () => {
        jest.mocked(start).mockResolvedValue(undefined);

        await nvda.start();

        jest.clearAllMocks();

        await nvda.previousLink();
      });

      it("should enqueue a key press command", () => {
        expect(NVDAClientStub.enqueueAndTap).toHaveBeenCalled();
      });
    });
  });

  describe("nextLink", () => {
    beforeEach(() => {
      nvda = new NVDA();
    });

    describe("when NVDA is not running", () => {
      it("should throw an error", async () => {
        await expect(async () => await nvda.nextLink()).rejects.toThrow(
          ERR_NVDA_NOT_RUNNING,
        );
      });
    });

    describe("when NVDA is running", () => {
      beforeEach(async () => {
        jest.mocked(start).mockResolvedValue(undefined);

        await nvda.start();

        jest.clearAllMocks();

        await nvda.nextLink();
      });

      it("should enqueue a key press command", () => {
        expect(NVDAClientStub.enqueueAndTap).toHaveBeenCalled();
      });
    });
  });

  describe("previousLandmark", () => {
    beforeEach(() => {
      nvda = new NVDA();
    });

    describe("when NVDA is not running", () => {
      it("should throw an error", async () => {
        await expect(async () => await nvda.previousLandmark()).rejects.toThrow(
          ERR_NVDA_NOT_RUNNING,
        );
      });
    });

    describe("when NVDA is running", () => {
      beforeEach(async () => {
        jest.mocked(start).mockResolvedValue(undefined);

        await nvda.start();

        jest.clearAllMocks();

        await nvda.previousLandmark();
      });

      it("should enqueue a key press command", () => {
        expect(NVDAClientStub.enqueueAndTap).toHaveBeenCalled();
      });
    });
  });

  describe("nextLandmark", () => {
    beforeEach(() => {
      nvda = new NVDA();
    });

    describe("when NVDA is not running", () => {
      it("should throw an error", async () => {
        await expect(async () => await nvda.nextLandmark()).rejects.toThrow(
          ERR_NVDA_NOT_RUNNING,
        );
      });
    });

    describe("when NVDA is running", () => {
      beforeEach(async () => {
        jest.mocked(start).mockResolvedValue(undefined);

        await nvda.start();

        jest.clearAllMocks();

        await nvda.nextLandmark();
      });

      it("should enqueue a key press command", () => {
        expect(NVDAClientStub.enqueueAndTap).toHaveBeenCalled();
      });
    });
  });

  describe.each`
    method                             | navigationMethod
    ${"navigatePreviousUntil"}         | ${"previous"}
    ${"navigateNextUntil"}             | ${"next"}
    ${"navigatePreviousHeadingUntil"}  | ${"previousHeading"}
    ${"navigateNextHeadingUntil"}      | ${"nextHeading"}
    ${"navigatePreviousLinkUntil"}     | ${"previousLink"}
    ${"navigateNextLinkUntil"}         | ${"nextLink"}
    ${"navigatePreviousLandmarkUntil"} | ${"previousLandmark"}
    ${"navigateNextLandmarkUntil"}     | ${"nextLandmark"}
  `(
    "$method",
    ({
      method,
      navigationMethod,
    }: {
      method: NavigateUntilMethod;
      navigationMethod: NavigationMethod;
    }) => {
      const spokenPhraseMatcher = "test-spoken-phrase";
      const options = { maxNavigationAttempts: 3 };

      beforeEach(async () => {
        await nvda[method](spokenPhraseMatcher, options);
      });

      it(`should navigate using ${navigationMethod} until the spoken phrase matches`, () => {
        expect(navigateUntil).toHaveBeenCalledWith(
          nvda,
          navigationMethod,
          spokenPhraseMatcher,
          options,
        );
      });
    },
  );

  describe("spokenPhraseLog", () => {
    beforeEach(() => {
      nvda = new NVDA();
    });

    describe("when NVDA is not running", () => {
      it("should throw an error", async () => {
        await expect(async () => await nvda.spokenPhraseLog()).rejects.toThrow(
          ERR_NVDA_NOT_RUNNING,
        );
      });
    });

    describe("when NVDA is running", () => {
      beforeEach(async () => {
        jest.mocked(start).mockResolvedValue(undefined);

        await nvda.start();

        jest.clearAllMocks();

        await nvda.spokenPhraseLog();
      });

      it("should call the client's spokenPhraseLog method", () => {
        expect(NVDAClientStub.spokenPhraseLog).toHaveBeenCalled();
      });
    });
  });

  describe("clearSpokenPhraseLog", () => {
    beforeEach(() => {
      nvda = new NVDA();
    });

    describe("when NVDA is not running", () => {
      it("should throw an error", async () => {
        await expect(
          async () => await nvda.clearSpokenPhraseLog(),
        ).rejects.toThrow(ERR_NVDA_NOT_RUNNING);
      });
    });

    describe("when NVDA is running", () => {
      beforeEach(async () => {
        jest.mocked(start).mockResolvedValue(undefined);

        await nvda.start();

        jest.clearAllMocks();

        await nvda.clearSpokenPhraseLog();
      });

      it("should call the client's clearSpokenPhraseLog method", () => {
        expect(NVDAClientStub.clearSpokenPhraseLog).toHaveBeenCalled();
      });
    });
  });

  describe("when stop is in progress", () => {
    let stopPromise: Promise<void>;

    beforeEach(async () => {
      nvda = new NVDA();

      jest.mocked(start).mockResolvedValue(undefined);

      await nvda.start();

      jest.clearAllMocks();

      stopPromise = nvda.stop();

      await delay(0);
    });

    afterEach(async () => {
      await stopPromise;
    });

    it("should throw when calling previous", async () => {
      await expect(async () => await nvda.previous()).rejects.toThrow(
        ERR_NVDA_NOT_RUNNING,
      );
    });

    it("should throw when calling next", async () => {
      await expect(async () => await nvda.next()).rejects.toThrow(
        ERR_NVDA_NOT_RUNNING,
      );
    });

    it("should throw when calling spokenPhraseLog", async () => {
      await expect(async () => await nvda.spokenPhraseLog()).rejects.toThrow(
        ERR_NVDA_NOT_RUNNING,
      );
    });

    it("should throw when calling clearSpokenPhraseLog", async () => {
      await expect(
        async () => await nvda.clearSpokenPhraseLog(),
      ).rejects.toThrow(ERR_NVDA_NOT_RUNNING);
    });
  });

  describe("capture", () => {
    const actionStub = jest.fn();
    const outputStub = {
      itemText: "test-item-text",
      result: "test-result",
      spokenPhrase: "test-spoken-phrase",
    };

    beforeEach(() => {
      jest.mocked(NVDAClientStub.enqueueAndTap).mockResolvedValue(outputStub);

      nvda = new NVDA();
    });

    describe("when NVDA is not running", () => {
      it("should throw an error", async () => {
        await expect(
          async () => await nvda.capture(actionStub),
        ).rejects.toThrow(ERR_NVDA_NOT_RUNNING);
      });
    });

    describe("when NVDA is running", () => {
      let output: unknown;

      beforeEach(async () => {
        jest.mocked(start).mockResolvedValue(undefined);

        await nvda.start();

        jest.clearAllMocks();

        output = await nvda.capture(actionStub);
      });

      it("should enqueue and tap an async wrapper of the provided action", async () => {
        expect(NVDAClientStub.enqueueAndTap).toHaveBeenCalledWith(
          expect.any(Function),
          undefined,
        );

        expect(actionStub).not.toHaveBeenCalled();

        await jest.mocked(NVDAClientStub.enqueueAndTap).mock.calls[0][0]();

        expect(actionStub).toHaveBeenCalled();
      });

      it("should return the result of the action, item text, and spoken phrase", async () => {
        expect(output).toBe(outputStub);
      });
    });
  });
});
