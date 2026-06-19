import { cleanSpokenPhrase } from "./cleanSpokenPhrase";
import { ERR_VOICE_OVER_NOT_RUNNING } from "../errors";
import { itemText } from "./itemText";
import { lastSpokenPhrase } from "./lastSpokenPhrase";
import { MAX_SPOKEN_PHRASES_POLL_COUNT } from "./constants";
import { VoiceOverClient } from "./VoiceOverClient";

jest.mock("./cleanSpokenPhrase", () => ({
  cleanSpokenPhrase: jest.fn(),
}));
jest.mock("./constants", () => ({
  APPROX_WORDS_PER_SECOND: 10000,
  ITEM_TEXT_POLL_INTERVAL: 0,
  ITEM_TEXT_RETRY_COUNT: 1,
  SPOKEN_PHRASES_POLL_INTERVAL: 0,
  SPOKEN_PHRASES_RETRY_COUNT: 1,
  MAX_SPOKEN_PHRASES_POLL_COUNT: 4,
}));
jest.mock("./itemText", () => ({
  itemText: jest.fn(),
}));
jest.mock("./lastSpokenPhrase", () => ({
  lastSpokenPhrase: jest.fn(),
}));

const itemTextDummy = "test-item-text";
const lastSpokenPhraseDummy = "test-last-spoken-phrase";

describe("VoiceOverClient", () => {
  let voiceOverClient: VoiceOverClient;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();

    jest
      .mocked(cleanSpokenPhrase)
      .mockImplementation((phrase) => `cleaned_${phrase}`);
    jest.mocked(itemText).mockResolvedValue(itemTextDummy);
    jest.mocked(lastSpokenPhrase).mockResolvedValue(lastSpokenPhraseDummy);
  });

  describe("when capture options are not provided", () => {
    beforeEach(() => {
      voiceOverClient = new VoiceOverClient();
    });

    it("should initialize with an empty item text log store", async () => {
      expect(await voiceOverClient.itemTextLog()).toEqual([]);
    });

    it("should initialize with an empty spoken phrase log store", async () => {
      expect(await voiceOverClient.spokenPhraseLog()).toEqual([]);
    });

    it("should return with an empty string as the item text if not yet acted", async () => {
      expect(await voiceOverClient.itemText()).toEqual("");
    });

    it("should return with an empty string as the last spoken phrase if not yet acted", async () => {
      expect(await voiceOverClient.lastSpokenPhrase()).toEqual("");
    });

    describe("when enqueueAndTap is called on an action with no capture options", () => {
      const expectedResult = Symbol("test-expected-result");
      let resultPromise: Promise<unknown>,
        resolver: (r: typeof expectedResult) => void;

      beforeEach(() => {
        const action = () =>
          new Promise((resolve) => {
            resolver = resolve;
          });

        resultPromise = voiceOverClient.enqueueAndTap(action);
      });

      afterEach(async () => {
        resolver(expectedResult);
        await resultPromise;
      });

      describe("when the action completes", () => {
        beforeEach(() => {
          resolver(expectedResult);
        });

        it("should log the item text", async () => {
          await resultPromise;

          expect(await voiceOverClient.itemTextLog()).toEqual([
            `cleaned_${itemTextDummy}`,
          ]);
        });

        it("should log the last spoken phrase", async () => {
          await resultPromise;

          expect(await voiceOverClient.spokenPhraseLog()).toEqual([
            `cleaned_${lastSpokenPhraseDummy}`,
          ]);
        });

        it("should return the action's result", async () => {
          await expect(resultPromise).resolves.toBe(expectedResult);
        });

        it("should return the item text from the last action", async () => {
          expect(await voiceOverClient.itemText()).toEqual(
            `cleaned_${itemTextDummy}`,
          );
        });

        it("should return the last spoken phrase from the last action", async () => {
          expect(await voiceOverClient.lastSpokenPhrase()).toEqual(
            `cleaned_${lastSpokenPhraseDummy}`,
          );
        });
      });
    });

    describe("when enqueueAndTap is called on an action with capture enabled", () => {
      const expectedResult = Symbol("test-expected-result");
      let resultPromise: Promise<unknown>,
        resolver: (r: typeof expectedResult) => void;

      beforeEach(() => {
        const action = () =>
          new Promise((resolve) => {
            resolver = resolve;
          });

        resultPromise = voiceOverClient.enqueueAndTap(action, {
          capture: true,
        });
      });

      afterEach(async () => {
        resolver(expectedResult);
        await resultPromise;
      });

      describe("when the action completes", () => {
        beforeEach(() => {
          resolver(expectedResult);
        });

        it("should log the item text", async () => {
          await resultPromise;

          expect(await voiceOverClient.itemTextLog()).toEqual([
            `cleaned_${itemTextDummy}`,
          ]);
        });

        it("should log the last spoken phrase", async () => {
          await resultPromise;

          expect(await voiceOverClient.spokenPhraseLog()).toEqual([
            `cleaned_${lastSpokenPhraseDummy}`,
          ]);
        });

        it("should return the action's result", async () => {
          await expect(resultPromise).resolves.toBe(expectedResult);
        });

        it("should return the item text from the last action", async () => {
          expect(await voiceOverClient.itemText()).toEqual(
            `cleaned_${itemTextDummy}`,
          );
        });

        it("should return the last spoken phrase from the last action", async () => {
          expect(await voiceOverClient.lastSpokenPhrase()).toEqual(
            `cleaned_${lastSpokenPhraseDummy}`,
          );
        });
      });
    });

    describe("when enqueueAndTap is called on an action with capture disabled", () => {
      const expectedResult = Symbol("test-expected-result");
      let resultPromise: Promise<unknown>,
        resolver: (r: typeof expectedResult) => void;

      beforeEach(() => {
        const action = () =>
          new Promise((resolve) => {
            resolver = resolve;
          });

        resultPromise = voiceOverClient.enqueueAndTap(action, {
          capture: false,
        });
      });

      afterEach(async () => {
        resolver(expectedResult);
        await resultPromise;
      });

      describe("when the action completes", () => {
        beforeEach(() => {
          resolver(expectedResult);
        });

        it("should not log the item text", async () => {
          await resultPromise;

          expect(await voiceOverClient.itemTextLog()).toHaveLength(0);
        });

        it("should not log the last spoken phrase", async () => {
          await resultPromise;

          expect(await voiceOverClient.spokenPhraseLog()).toHaveLength(0);
        });

        it("should return the action's result", async () => {
          await expect(resultPromise).resolves.toBe(expectedResult);
        });

        it("should not return the item text from the last action", async () => {
          expect(await voiceOverClient.itemText()).toEqual("");
        });

        it("should not return the last spoken phrase from the last action", async () => {
          expect(await voiceOverClient.lastSpokenPhrase()).toEqual("");
        });
      });
    });

    describe("when enqueueAndTap is called with capture enabled but is unsuccessful in retrieving the last spoken phrase", () => {
      const expectedResult = Symbol("test-expected-result");
      let resultPromise: Promise<unknown>,
        resolver: (r: typeof expectedResult) => void;

      beforeEach(() => {
        jest
          .mocked(lastSpokenPhrase)
          .mockRejectedValue(new Error("test-error"));
        jest.mocked(cleanSpokenPhrase).mockReturnValue("");

        const action = () =>
          new Promise((resolve) => {
            resolver = resolve;
          });

        resultPromise = voiceOverClient.enqueueAndTap(action, {
          capture: true,
        });
      });

      afterEach(async () => {
        resolver(expectedResult);
        await resultPromise;
      });

      describe("when the action completes", () => {
        beforeEach(() => {
          resolver(expectedResult);
        });

        it("should attempt to retrieve the log a maximum number of times specified by `MAX_SPOKEN_PHRASES_POLL_COUNT`", async () => {
          await resultPromise;

          expect(lastSpokenPhrase).toHaveBeenCalledTimes(
            MAX_SPOKEN_PHRASES_POLL_COUNT,
          );
        });

        it("should not log any additional phrases", async () => {
          expect(await voiceOverClient.spokenPhraseLog()).toEqual([""]);

          await resultPromise;

          expect(await voiceOverClient.spokenPhraseLog()).toEqual([""]);
        });

        it("should return an empty string", async () => {
          expect(await voiceOverClient.lastSpokenPhrase()).toEqual("");
        });
      });
    });

    describe("when enqueueAndTap is called with capture enabled but the phrases emitted by VO never stabilize (e.g. live region that announces updates every second)", () => {
      const expectedResult = Symbol("test-expected-result");
      let resultPromise: Promise<unknown>,
        resolver: (r: typeof expectedResult) => void;

      beforeEach(() => {
        let phraseCount = 0;
        jest.mocked(lastSpokenPhrase).mockImplementation(() => {
          return Promise.resolve(`${phraseCount++}`);
        });

        const action = () =>
          new Promise((resolve) => {
            resolver = resolve;
          });

        resultPromise = voiceOverClient.enqueueAndTap(action, {
          capture: true,
        });
      });

      afterEach(async () => {
        resolver(expectedResult);
        await resultPromise;
      });

      describe("when the action completes", () => {
        beforeEach(() => {
          resolver(expectedResult);
        });

        it("should attempt to retrieve the log a maximum number of times specified by `MAX_SPOKEN_PHRASES_POLL_COUNT`", async () => {
          await resultPromise;

          expect(lastSpokenPhrase).toHaveBeenCalledTimes(
            MAX_SPOKEN_PHRASES_POLL_COUNT,
          );
        });

        it("should log the combined last spoken phrases", async () => {
          await resultPromise;

          expect(await voiceOverClient.spokenPhraseLog()).toEqual([
            `cleaned_0. cleaned_1. cleaned_2. cleaned_3`,
          ]);
        });

        it("should return the combined last spoken phrases from the last action", async () => {
          expect(await voiceOverClient.lastSpokenPhrase()).toEqual(
            `cleaned_0. cleaned_1. cleaned_2. cleaned_3`,
          );
        });
      });
    });
  });

  describe("when capture has been enabled by default", () => {
    beforeEach(() => {
      voiceOverClient = new VoiceOverClient({ capture: true });
    });

    it("should initialize with an empty item text log store", async () => {
      expect(await voiceOverClient.itemTextLog()).toEqual([]);
    });

    it("should initialize with an empty spoken phrase log store", async () => {
      expect(await voiceOverClient.spokenPhraseLog()).toEqual([]);
    });

    it("should initialize with an empty spoken phrase log store", async () => {
      expect(await voiceOverClient.spokenPhraseLog()).toEqual([]);
    });

    it("should return with an empty string as the item text if not yet acted", async () => {
      expect(await voiceOverClient.itemText()).toEqual("");
    });

    it("should return with an empty string as the last spoken phrase if not yet acted", async () => {
      expect(await voiceOverClient.lastSpokenPhrase()).toEqual("");
    });

    it("should gracefully handle clearing the spoken phrase log when there have been no spoken phrases", async () => {
      await expect(
        voiceOverClient.clearSpokenPhraseLog(),
      ).resolves.not.toThrow();
    });

    it("should gracefully handle clearing the item text log when there have been no spoken phrases", async () => {
      await expect(voiceOverClient.clearItemTextLog()).resolves.not.toThrow();
    });

    describe("when enqueueAndTap is called on an action with no capture options", () => {
      const expectedResult = Symbol("test-expected-result");
      let resultPromise: Promise<unknown>,
        resolver: (r: typeof expectedResult) => void;

      beforeEach(() => {
        const action = () =>
          new Promise((resolve) => {
            resolver = resolve;
          });

        resultPromise = voiceOverClient.enqueueAndTap(action);
      });

      afterEach(async () => {
        resolver(expectedResult);
        await resultPromise;
      });

      describe("when the action completes", () => {
        beforeEach(() => {
          resolver(expectedResult);
        });

        it("should log the item text", async () => {
          await resultPromise;

          expect(await voiceOverClient.itemTextLog()).toEqual([
            `cleaned_${itemTextDummy}`,
          ]);
        });

        it("should log the last spoken phrase", async () => {
          await resultPromise;

          expect(await voiceOverClient.spokenPhraseLog()).toEqual([
            `cleaned_${lastSpokenPhraseDummy}`,
          ]);
        });

        it("should return the action's result", async () => {
          await expect(resultPromise).resolves.toBe(expectedResult);
        });

        it("should return the item text from the last action", async () => {
          expect(await voiceOverClient.itemText()).toEqual(
            `cleaned_${itemTextDummy}`,
          );
        });

        it("should return the last spoken phrase from the last action", async () => {
          expect(await voiceOverClient.lastSpokenPhrase()).toEqual(
            `cleaned_${lastSpokenPhraseDummy}`,
          );
        });
      });
    });

    describe("when enqueueAndTap is called on an action with capture enabled", () => {
      const expectedResult = Symbol("test-expected-result");
      let resultPromise: Promise<unknown>,
        resolver: (r: typeof expectedResult) => void;

      beforeEach(() => {
        const action = () =>
          new Promise((resolve) => {
            resolver = resolve;
          });

        resultPromise = voiceOverClient.enqueueAndTap(action, {
          capture: true,
        });
      });

      afterEach(async () => {
        resolver(expectedResult);
        await resultPromise;
      });

      describe("when the action completes", () => {
        beforeEach(() => {
          resolver(expectedResult);
        });

        it("should log the item text", async () => {
          await resultPromise;

          expect(await voiceOverClient.itemTextLog()).toEqual([
            `cleaned_${itemTextDummy}`,
          ]);
        });

        it("should log the last spoken phrase", async () => {
          await resultPromise;

          expect(await voiceOverClient.spokenPhraseLog()).toEqual([
            `cleaned_${lastSpokenPhraseDummy}`,
          ]);
        });

        it("should return the action's result", async () => {
          await expect(resultPromise).resolves.toBe(expectedResult);
        });

        it("should return the item text from the last action", async () => {
          expect(await voiceOverClient.itemText()).toEqual(
            `cleaned_${itemTextDummy}`,
          );
        });

        it("should return the last spoken phrase from the last action", async () => {
          expect(await voiceOverClient.lastSpokenPhrase()).toEqual(
            `cleaned_${lastSpokenPhraseDummy}`,
          );
        });

        describe("when the item text log is cleared", () => {
          beforeEach(async () => {
            await voiceOverClient.clearItemTextLog();
          });

          it("should return with an empty item text log store", async () => {
            expect(await voiceOverClient.itemTextLog()).toEqual([]);
          });

          it("should return with an empty string as the item text", async () => {
            expect(await voiceOverClient.itemText()).toEqual("");
          });
        });

        describe("when the spoken phrase log is cleared", () => {
          beforeEach(async () => {
            await voiceOverClient.clearSpokenPhraseLog();
          });

          it("should return with an empty spoken phrase log store", async () => {
            expect(await voiceOverClient.spokenPhraseLog()).toEqual([]);
          });

          it("should return with an empty string as the last spoken phrase", async () => {
            expect(await voiceOverClient.lastSpokenPhrase()).toEqual("");
          });
        });
      });
    });

    describe("when enqueueAndTap is called on an action with capture disabled", () => {
      const expectedResult = Symbol("test-expected-result");
      let resultPromise: Promise<unknown>,
        resolver: (r: typeof expectedResult) => void;

      beforeEach(() => {
        const action = () =>
          new Promise((resolve) => {
            resolver = resolve;
          });

        resultPromise = voiceOverClient.enqueueAndTap(action, {
          capture: false,
        });
      });

      afterEach(async () => {
        resolver(expectedResult);
        await resultPromise;
      });

      describe("when the action completes", () => {
        beforeEach(() => {
          resolver(expectedResult);
        });

        it("should not log the item text", async () => {
          await resultPromise;

          expect(await voiceOverClient.itemTextLog()).toHaveLength(0);
        });

        it("should not log the last spoken phrase", async () => {
          await resultPromise;

          expect(await voiceOverClient.spokenPhraseLog()).toHaveLength(0);
        });

        it("should return the action's result", async () => {
          await expect(resultPromise).resolves.toBe(expectedResult);
        });

        it("should not return the item text from the last action", async () => {
          expect(await voiceOverClient.itemText()).toEqual("");
        });

        it("should not return the last spoken phrase from the last action", async () => {
          expect(await voiceOverClient.lastSpokenPhrase()).toEqual("");
        });
      });
    });
  });

  describe("when capture has been disabled by default", () => {
    beforeEach(() => {
      voiceOverClient = new VoiceOverClient({ capture: false });
    });

    it("should initialize with an empty item text log store", async () => {
      expect(await voiceOverClient.itemTextLog()).toEqual([]);
    });

    it("should initialize with an empty spoken phrase log store", async () => {
      expect(await voiceOverClient.spokenPhraseLog()).toEqual([]);
    });

    it("should initialize with an empty spoken phrase log store", async () => {
      expect(await voiceOverClient.spokenPhraseLog()).toEqual([]);
    });

    it("should return with an empty string as the item text if not yet acted", async () => {
      expect(await voiceOverClient.itemText()).toEqual("");
    });

    it("should return with an empty string as the last spoken phrase if not yet acted", async () => {
      expect(await voiceOverClient.lastSpokenPhrase()).toEqual("");
    });

    describe("when enqueueAndTap is called on an action with no capture options", () => {
      const expectedResult = Symbol("test-expected-result");
      let resultPromise: Promise<unknown>,
        resolver: (r: typeof expectedResult) => void;

      beforeEach(() => {
        const action = () =>
          new Promise((resolve) => {
            resolver = resolve;
          });

        resultPromise = voiceOverClient.enqueueAndTap(action);
      });

      afterEach(async () => {
        resolver(expectedResult);
        await resultPromise;
      });

      describe("when the action completes", () => {
        beforeEach(() => {
          resolver(expectedResult);
        });

        it("should not log the item text", async () => {
          await resultPromise;

          expect(await voiceOverClient.itemTextLog()).toHaveLength(0);
        });

        it("should not log the last spoken phrase", async () => {
          await resultPromise;

          expect(await voiceOverClient.spokenPhraseLog()).toHaveLength(0);
        });

        it("should return the action's result", async () => {
          await expect(resultPromise).resolves.toBe(expectedResult);
        });

        it("should not return the item text from the last action", async () => {
          expect(await voiceOverClient.itemText()).toEqual("");
        });

        it("should not return the last spoken phrase from the last action", async () => {
          expect(await voiceOverClient.lastSpokenPhrase()).toEqual("");
        });
      });
    });

    describe("when enqueueAndTap is called on an action with capture enabled", () => {
      const expectedResult = Symbol("test-expected-result");
      let resultPromise: Promise<unknown>,
        resolver: (r: typeof expectedResult) => void;

      beforeEach(() => {
        const action = () =>
          new Promise((resolve) => {
            resolver = resolve;
          });

        resultPromise = voiceOverClient.enqueueAndTap(action, {
          capture: true,
        });
      });

      afterEach(async () => {
        resolver(expectedResult);
        await resultPromise;
      });

      describe("when the action completes", () => {
        beforeEach(() => {
          resolver(expectedResult);
        });

        it("should log the item text", async () => {
          await resultPromise;

          expect(await voiceOverClient.itemTextLog()).toEqual([
            `cleaned_${itemTextDummy}`,
          ]);
        });

        it("should log the last spoken phrase", async () => {
          await resultPromise;

          expect(await voiceOverClient.spokenPhraseLog()).toEqual([
            `cleaned_${lastSpokenPhraseDummy}`,
          ]);
        });

        it("should return the action's result", async () => {
          await expect(resultPromise).resolves.toBe(expectedResult);
        });

        it("should return the item text from the last action", async () => {
          expect(await voiceOverClient.itemText()).toEqual(
            `cleaned_${itemTextDummy}`,
          );
        });

        it("should return the last spoken phrase from the last action", async () => {
          expect(await voiceOverClient.lastSpokenPhrase()).toEqual(
            `cleaned_${lastSpokenPhraseDummy}`,
          );
        });
      });
    });

    describe("when enqueueAndTap is called on an action with capture disabled", () => {
      const expectedResult = Symbol("test-expected-result");
      let resultPromise: Promise<unknown>,
        resolver: (r: typeof expectedResult) => void;

      beforeEach(() => {
        const action = () =>
          new Promise((resolve) => {
            resolver = resolve;
          });

        resultPromise = voiceOverClient.enqueueAndTap(action, {
          capture: false,
        });
      });

      afterEach(async () => {
        resolver(expectedResult);
        await resultPromise;
      });

      describe("when the action completes", () => {
        beforeEach(() => {
          resolver(expectedResult);
        });

        it("should not log the item text", async () => {
          await resultPromise;

          expect(await voiceOverClient.itemTextLog()).toHaveLength(0);
        });

        it("should not log the last spoken phrase", async () => {
          await resultPromise;

          expect(await voiceOverClient.spokenPhraseLog()).toHaveLength(0);
        });

        it("should return the action's result", async () => {
          await expect(resultPromise).resolves.toBe(expectedResult);
        });

        it("should not return the item text from the last action", async () => {
          expect(await voiceOverClient.itemText()).toEqual("");
        });

        it("should not return the last spoken phrase from the last action", async () => {
          expect(await voiceOverClient.lastSpokenPhrase()).toEqual("");
        });
      });
    });
  });

  describe("when multiple actions are enqueued", () => {
    let voiceOverClientWithCapture: VoiceOverClient;

    beforeEach(() => {
      voiceOverClientWithCapture = new VoiceOverClient({ capture: true });
    });

    it("should execute actions serially and accumulate logs", async () => {
      const result1 = Symbol("result-1");
      const result2 = Symbol("result-2");
      const result3 = Symbol("result-3");

      const promise1 = voiceOverClientWithCapture.enqueueAndTap(async () => {
        return result1;
      });

      const promise2 = voiceOverClientWithCapture.enqueueAndTap(async () => {
        return result2;
      });

      const promise3 = voiceOverClientWithCapture.enqueueAndTap(async () => {
        return result3;
      });

      const [r1, r2, r3] = await Promise.all([promise1, promise2, promise3]);

      expect(r1).toBe(result1);
      expect(r2).toBe(result2);
      expect(r3).toBe(result3);

      expect(await voiceOverClientWithCapture.itemTextLog()).toEqual([
        `cleaned_${itemTextDummy}`,
        `cleaned_${itemTextDummy}`,
        `cleaned_${itemTextDummy}`,
      ]);

      expect(await voiceOverClientWithCapture.spokenPhraseLog()).toEqual([
        `cleaned_${lastSpokenPhraseDummy}`,
        `cleaned_${lastSpokenPhraseDummy}`,
        `cleaned_${lastSpokenPhraseDummy}`,
      ]);
    });

    it("should allow accessing logs while actions are in flight", async () => {
      let actionStarted = false;
      let resolveAction!: () => void;

      const action = async () => {
        actionStarted = true;

        await new Promise<void>((resolve) => {
          resolveAction = resolve;
        });
      };

      voiceOverClientWithCapture.enqueueAndTap(action);

      await new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (actionStarted) {
            clearInterval(checkInterval);
            resolve(undefined);
          }
        }, 10);
      });

      resolveAction();

      const itemLogs = await voiceOverClientWithCapture.itemTextLog();
      const spokenLogs = await voiceOverClientWithCapture.spokenPhraseLog();

      expect(itemLogs).toEqual([`cleaned_${itemTextDummy}`]);
      expect(spokenLogs).toEqual([`cleaned_${lastSpokenPhraseDummy}`]);
    });
  });

  describe("when an enqueued action throws an error", () => {
    let voiceOverClientWithCapture: VoiceOverClient;

    beforeEach(() => {
      voiceOverClientWithCapture = new VoiceOverClient({ capture: true });
    });

    it("should reject the action's promise", async () => {
      const testError = new Error("test-action-error");

      const promise = voiceOverClientWithCapture.enqueueAndTap(async () => {
        throw testError;
      });

      await expect(promise).rejects.toBe(testError);
    });

    it("should not log the failed action and continue processing subsequent actions", async () => {
      const testError = new Error("test-action-error");
      const successResult = Symbol("success-result");

      const rejectingPromise = voiceOverClientWithCapture.enqueueAndTap(
        async () => {
          throw testError;
        },
      );

      const successPromise = voiceOverClientWithCapture.enqueueAndTap(
        async () => successResult,
      );

      await expect(rejectingPromise).rejects.toBe(testError);
      const result = await successPromise;

      expect(result).toBe(successResult);

      // Only the successful action should be logged
      expect(await voiceOverClientWithCapture.itemTextLog()).toEqual([
        `cleaned_${itemTextDummy}`,
      ]);

      expect(await voiceOverClientWithCapture.spokenPhraseLog()).toEqual([
        `cleaned_${lastSpokenPhraseDummy}`,
      ]);
    });

    it("should not log when an action errors and capture is disabled", async () => {
      const testError = new Error("test-action-error");

      const promise = voiceOverClientWithCapture.enqueueAndTap(
        async () => {
          throw testError;
        },
        { capture: false },
      );

      await expect(promise).rejects.toBe(testError);

      expect(await voiceOverClientWithCapture.itemTextLog()).toHaveLength(0);
      expect(await voiceOverClientWithCapture.spokenPhraseLog()).toHaveLength(
        0,
      );
    });
  });

  describe("stop", () => {
    describe("when there is something in flight", () => {
      let voiceOverClientWithCapture: VoiceOverClient;
      let actionStarted: boolean;
      let resolveInFlightAction: () => void;

      beforeEach(async () => {
        voiceOverClientWithCapture = new VoiceOverClient({ capture: true });
        actionStarted = false;

        const inFlightAction = async () => {
          actionStarted = true;

          await new Promise<void>((resolve) => {
            resolveInFlightAction = resolve;
          });
        };

        voiceOverClientWithCapture.enqueueAndTap(inFlightAction);

        await new Promise((resolve) => {
          const checkInterval = setInterval(() => {
            if (actionStarted) {
              clearInterval(checkInterval);
              resolve(undefined);
            }
          }, 10);
        });
      });

      it("should wait for the in-flight action to complete before resolving", async () => {
        const stopPromise = voiceOverClientWithCapture.stop();

        let stopResolved = false;
        stopPromise.then(() => {
          stopResolved = true;
        });

        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(stopResolved).toBe(false);

        resolveInFlightAction();

        await stopPromise;

        expect(stopResolved).toBe(true);
      });
    });

    describe("when there is something in flight and something queued", () => {
      let voiceOverClientWithCapture: VoiceOverClient;
      let inFlightActionStarted: boolean;
      let resolveInFlightAction: () => void;
      let queuedAction1Error!: Error;
      let queuedAction2Error!: Error;

      beforeEach(async () => {
        voiceOverClientWithCapture = new VoiceOverClient({ capture: true });
        inFlightActionStarted = false;

        const inFlightAction = async () => {
          inFlightActionStarted = true;

          await new Promise<void>((resolve) => {
            resolveInFlightAction = resolve;
          });
        };

        const queuedAction1 = async () => {};
        const queuedAction2 = async () => {};

        voiceOverClientWithCapture
          .enqueueAndTap(inFlightAction)
          .catch(() => {});
        voiceOverClientWithCapture.enqueueAndTap(queuedAction1).catch((e) => {
          queuedAction1Error = e;
        });
        voiceOverClientWithCapture.enqueueAndTap(queuedAction2).catch((e) => {
          queuedAction2Error = e;
        });

        await new Promise((resolve) => {
          const checkInterval = setInterval(() => {
            if (inFlightActionStarted) {
              clearInterval(checkInterval);
              resolve(undefined);
            }
          }, 10);
        });
      });

      it("should wait for the in-flight action and queued actions to resolve and/or reject before resolving", async () => {
        const stopPromise = voiceOverClientWithCapture.stop();

        let stopResolved = false;
        stopPromise.then(() => {
          stopResolved = true;
        });

        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(stopResolved).toBe(false);

        resolveInFlightAction();

        await stopPromise;

        expect(stopResolved).toBe(true);
        expect(queuedAction1Error).toEqual(
          new Error(ERR_VOICE_OVER_NOT_RUNNING),
        );
        expect(queuedAction2Error).toEqual(
          new Error(ERR_VOICE_OVER_NOT_RUNNING),
        );
      });
    });

    describe("when enqueueAndTap is called after stop", () => {
      let voiceOverClientWithCapture: VoiceOverClient;

      beforeEach(async () => {
        voiceOverClientWithCapture = new VoiceOverClient({ capture: true });
        await voiceOverClientWithCapture.stop();
      });

      it("should throw ERR_VOICE_OVER_NOT_RUNNING", async () => {
        const promise = voiceOverClientWithCapture.enqueueAndTap(async () => {
          return Symbol("action-result");
        });

        await expect(promise).rejects.toThrow(ERR_VOICE_OVER_NOT_RUNNING);
      });

      it("should throw ERR_VOICE_OVER_NOT_RUNNING for all subsequent calls", async () => {
        const promise1 = voiceOverClientWithCapture.enqueueAndTap(async () => {
          return Symbol("action-result-1");
        });

        const promise2 = voiceOverClientWithCapture.enqueueAndTap(async () => {
          return Symbol("action-result-2");
        });

        await expect(promise1).rejects.toThrow(ERR_VOICE_OVER_NOT_RUNNING);
        await expect(promise2).rejects.toThrow(ERR_VOICE_OVER_NOT_RUNNING);
      });
    });
  });
});
