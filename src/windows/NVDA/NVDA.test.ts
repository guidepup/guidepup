import { ERR_NVDA_ALREADY_RUNNING, ERR_NVDA_NOT_RUNNING } from "../errors";
import { isNVDAInstalled } from "./isNVDAInstalled";
import { isWindows } from "../isWindows";
import { NVDA } from "./NVDA";
import { NVDAClient } from "./NVDAClient";
import { quit } from "./quit";
import { start } from "./start";

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
    jest.mocked(isNVDAInstalled).mockResolvedValue(true);
    jest.mocked(NVDAClientStub.connect).mockResolvedValue(undefined);
    jest.mocked(NVDAClient).mockImplementation(() => NVDAClientStub);
  });

  describe("detect", () => {
    describe("when Windows and NVDA is installed", () => {
      it("should return true", async () => {
        nvda = new NVDA();

        const result = await nvda.detect();

        expect(result).toBe(true);
      });
    });

    describe("when Windows and NVDA is not installed", () => {
      beforeEach(() => {
        jest.mocked(isNVDAInstalled).mockResolvedValue(false);
      });

      it("should return false", async () => {
        nvda = new NVDA();

        const result = await nvda.detect();

        expect(result).toBe(false);
      });
    });

    describe("when not Windows", () => {
      beforeEach(() => {
        jest.mocked(isWindows).mockReturnValue(false);
      });

      it("should return false", async () => {
        nvda = new NVDA();

        const result = await nvda.detect();

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
        jest.mocked(start).mockResolvedValue(undefined);

        await nvda.start();

        jest.clearAllMocks();
      });

      it("should throw an error", async () => {
        await expect(async () => await nvda.start()).rejects.toThrow(
          ERR_NVDA_ALREADY_RUNNING,
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
        jest.mocked(quit).mockResolvedValue(undefined);

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
    let resolveQuit: () => void;

    beforeEach(async () => {
      nvda = new NVDA();

      jest.mocked(start).mockResolvedValue(undefined);

      jest.mocked(quit).mockImplementation(
        () =>
          new Promise<void>((resolve) => {
            resolveQuit = resolve;
          }),
      );

      await nvda.start();

      jest.clearAllMocks();

      stopPromise = nvda.stop();

      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    afterEach(async () => {
      resolveQuit();
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
});
