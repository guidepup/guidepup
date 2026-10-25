import type { IScreenReader } from "./IScreenReader";
import { navigateUntil } from "./navigateUntil";

const screenReader = {
  lastSpokenPhrase: jest.fn(),
  next: jest.fn(),
} as unknown as IScreenReader;

describe("navigateUntil", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it("should not navigate if the current last spoken phrase is a match", async () => {
    jest
      .mocked(screenReader.lastSpokenPhrase)
      .mockResolvedValueOnce("test-spoken-phrase-target");

    await navigateUntil(screenReader, "next", "test-spoken-phrase-target", {
      maxNavigationAttempts: 0,
    });

    expect(screenReader.next).not.toHaveBeenCalled();
  });

  it("should navigate until the spoken phrase is a complete string match", async () => {
    jest
      .mocked(screenReader.lastSpokenPhrase)
      .mockResolvedValueOnce("test-spoken-phrase-1")
      .mockResolvedValueOnce("test-spoken-phrase-target");

    await navigateUntil(screenReader, "next", "test-spoken-phrase-target", {
      maxNavigationAttempts: 2,
    });

    expect(screenReader.next).toHaveBeenCalledTimes(1);
  });

  it("should support regular expression matchers", async () => {
    jest
      .mocked(screenReader.lastSpokenPhrase)
      .mockResolvedValueOnce("test-spoken-phrase-1")
      .mockResolvedValueOnce("test-spoken-phrase-2")
      .mockResolvedValue("test-spoken-phrase-target");

    await navigateUntil(screenReader, "next", /test-spoken-phrase-target/, {
      maxNavigationAttempts: 3,
    });

    expect(screenReader["next"]).toHaveBeenCalledTimes(2);
  });

  it("should reset the regular expression matcher lastIndex before each match to support global `/g` and sticky `/y` matchers", async () => {
    const matcher = /test-spoken-phrase-target/g;
    matcher.lastIndex = 25;

    jest
      .mocked(screenReader.lastSpokenPhrase)
      .mockResolvedValueOnce("test-spoken-phrase-1")
      .mockResolvedValueOnce("test-spoken-phrase-target");

    await navigateUntil(screenReader, "next", matcher, {
      maxNavigationAttempts: 1,
    });

    expect(screenReader.next).toHaveBeenCalledTimes(1);
  });

  it("should support function matchers", async () => {
    jest
      .mocked(screenReader.lastSpokenPhrase)
      .mockResolvedValueOnce("test-spoken-phrase-1")
      .mockResolvedValueOnce("test-spoken-phrase-2")
      .mockResolvedValue("test-spoken-phrase-target");

    await navigateUntil(
      screenReader,
      "next",
      (spokenPhrase) => spokenPhrase === "test-spoken-phrase-target",
      {
        maxNavigationAttempts: 3,
      },
    );

    expect(screenReader["next"]).toHaveBeenCalledTimes(2);
  });

  it("should not match on a partial string", async () => {
    jest
      .mocked(screenReader.lastSpokenPhrase)
      .mockResolvedValueOnce("test-spoken-phrase-1")
      .mockResolvedValueOnce("test-spoken-phrase-target");

    await expect(
      navigateUntil(screenReader, "next", "target", {
        maxNavigationAttempts: 3,
      }),
    ).rejects.toThrow(
      new Error(
        "Could not find a matching spoken phrase after navigation attempts: 3",
      ),
    );

    expect(screenReader.next).toHaveBeenCalledTimes(3);
  });

  it("should pass command options to each navigation method invocation", async () => {
    jest
      .mocked(screenReader.lastSpokenPhrase)
      .mockResolvedValueOnce("test-spoken-phrase-1")
      .mockResolvedValue("test-spoken-phrase-target");

    await navigateUntil(screenReader, "next", "test-spoken-phrase-target", {
      maxNavigationAttempts: 1,
      capture: false,
      retries: 2,
    });

    expect(screenReader.next).toHaveBeenCalledWith({
      capture: false,
      retries: 2,
    });
  });

  it("should throw when the matcher is not found within the provided maximum attempts", async () => {
    jest.mocked(screenReader.lastSpokenPhrase).mockResolvedValue("Other item");

    await expect(
      navigateUntil(screenReader, "next", "test-spoken-phrase-target", {
        maxNavigationAttempts: 2,
      }),
    ).rejects.toThrow(
      "Could not find a matching spoken phrase after navigation attempts: 2",
    );

    expect(screenReader.next).toHaveBeenCalledTimes(2);
  });

  it("should throw when the maximum attempt count is invalid", async () => {
    await expect(
      navigateUntil(screenReader, "next", "test-spoken-phrase-target", {
        maxNavigationAttempts: -1,
      }),
    ).rejects.toThrow("maxNavigationAttempts must be a non-negative integer.");

    await expect(
      navigateUntil(screenReader, "next", "test-spoken-phrase-target", {
        maxNavigationAttempts: Infinity,
      }),
    ).rejects.toThrow("maxNavigationAttempts must be a non-negative integer.");

    await expect(
      navigateUntil(screenReader, "next", "test-spoken-phrase-target", {
        maxNavigationAttempts: NaN,
      }),
    ).rejects.toThrow("maxNavigationAttempts must be a non-negative integer.");

    expect(screenReader.next).not.toHaveBeenCalled();
  });

  it("uses the default maximum attempt count when options are omitted", async () => {
    jest
      .mocked(screenReader.lastSpokenPhrase)
      .mockResolvedValue("test-spoken-phrase-1");

    await expect(
      navigateUntil(screenReader, "next", "test-spoken-phrase-target"),
    ).rejects.toThrow(
      "Could not find a matching spoken phrase after navigation attempts: 10",
    );

    expect(screenReader.next).toHaveBeenCalledTimes(10);
  });
});
