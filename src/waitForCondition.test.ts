import {
  DEFAULT_POLL_INTERVAL,
  DEFAULT_TIMEOUT,
  ERR_WAITING_TIMEOUT,
} from "./constants";
import { waitForCondition } from "./waitForCondition";

describe("waitForCondition", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe.each`
    description                        | options
    ${"defaults"}                      | ${undefined}
    ${"defaults from partial options"} | ${{}}
    ${"custom options"}                | ${{ pollInterval: 10, pollTimeout: 100, timeoutErrorMessage: "test-timeout-error-message" }}
  `("when using the $description", ({ options }) => {
    const expectedPollInterval = options?.pollInterval ?? DEFAULT_POLL_INTERVAL;
    const expectedPollTimeout = options?.pollTimeout ?? DEFAULT_TIMEOUT;
    const expectedTimeoutErrorMessage =
      options?.timeoutErrorMessage ?? ERR_WAITING_TIMEOUT;

    describe("when the condition passes first time before the timeout", () => {
      const condition = () => Promise.resolve(true);

      it("should not throw", async () => {
        const result = waitForCondition(condition, options);

        await expect(result).resolves.not.toThrow();
      });
    });

    describe("when the condition fails first time, but passes second time before the timeout", () => {
      let count = 0;
      let resolver: () => void;
      const resolverPromise = new Promise<void>(
        (resolve) => (resolver = resolve)
      );

      const condition = () => {
        if (count++ === 1) {
          return Promise.resolve(true);
        }

        resolver();

        return Promise.resolve(false);
      };

      it("should not throw", async () => {
        const result = waitForCondition(condition, options);

        await resolverPromise;
        jest.advanceTimersByTime(expectedPollInterval);

        await expect(result).resolves.not.toThrow();
      });
    });

    describe("when the condition throw first time, but passes second time before the timeout", () => {
      let count = 0;
      let resolver: () => void;
      const resolverPromise = new Promise<void>(
        (resolve) => (resolver = resolve)
      );

      const condition = () => {
        if (count++ === 1) {
          return Promise.resolve(true);
        }

        resolver();

        return Promise.reject(new Error("test-error"));
      };

      it("should not throw", async () => {
        const result = waitForCondition(condition, options);

        await resolverPromise;
        jest.advanceTimersByTime(expectedPollInterval);

        await expect(result).resolves.not.toThrow();
      });
    });

    describe("when the condition doesn't pass before the timeout", () => {
      let resolver: () => void;
      const resolverPromise = new Promise<void>(
        (resolve) => (resolver = resolve)
      );

      const condition = () => {
        resolver();

        return Promise.reject(new Error("test-error"));
      };

      it("should throw", async () => {
        const result = waitForCondition(condition, options);

        await resolverPromise;
        jest.advanceTimersByTime(expectedPollTimeout);

        await expect(result).rejects.toEqual(
          new Error(expectedTimeoutErrorMessage)
        );
      });
    });
  });
});
