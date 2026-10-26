import type { Capture } from "./Capture";
import type { ClickOptions } from "./ClickOptions";
import type { CommandOptions } from "./CommandOptions";
import type { IScreenReader } from "./IScreenReader";
import type { KeyboardOptions } from "./KeyboardOptions";
import type { NavigateOptions } from "./NavigateOptions";
import { navigateUntil } from "./navigateUntil";
import type { SpokenPhraseMatcher } from "./SpokenPhraseMatcher";
import type { StartOptions } from "./StartOptions";

export abstract class BaseScreenReader implements IScreenReader {
  abstract get name(): string;
  abstract get version(): string;
  abstract detect(): boolean;
  abstract default(): boolean;
  abstract start(options?: StartOptions): Promise<void>;
  abstract stop(options?: CommandOptions): Promise<void>;
  abstract previous(options?: CommandOptions): Promise<void>;
  abstract next(options?: CommandOptions): Promise<void>;
  abstract previousHeading(options?: CommandOptions): Promise<void>;
  abstract nextHeading(options?: CommandOptions): Promise<void>;
  abstract previousLink(options?: CommandOptions): Promise<void>;
  abstract nextLink(options?: CommandOptions): Promise<void>;
  abstract previousLandmark(options?: CommandOptions): Promise<void>;
  abstract nextLandmark(options?: CommandOptions): Promise<void>;
  abstract act(options?: CommandOptions): Promise<void>;
  abstract interact(options?: CommandOptions): Promise<void>;
  abstract stopInteracting(options?: CommandOptions): Promise<void>;
  abstract press(key: string, options?: KeyboardOptions): Promise<void>;
  abstract type(text: string, options?: KeyboardOptions): Promise<void>;
  abstract perform(command: unknown, options?: CommandOptions): Promise<void>;
  abstract click(options?: ClickOptions): Promise<void>;
  abstract lastSpokenPhrase(): Promise<string>;
  abstract itemText(): Promise<string>;
  abstract spokenPhraseLog(): Promise<string[]>;
  abstract clearSpokenPhraseLog(): Promise<void>;
  abstract itemTextLog(): Promise<string[]>;
  abstract clearItemTextLog(): Promise<void>;
  abstract getSettings(): Record<string, unknown>;
  abstract getSetting(key: string): unknown;
  abstract capture<T>(
    action: () => Promise<T>,
    options?: CommandOptions,
  ): Promise<Capture<T>>;

  /**
   * Move the virtual cursor to the previous location until its spoken phrase
   * matches the provided matcher.
   *
   * ```ts
   * import { screenReader } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start the screen reader.
   *   await screenReader.start();
   *
   *   // Move to the previous item containing the exact spoken phrase.
   *   await screenReader.navigatePreviousUntil(/Submit/);
   *
   *   // Stop the screen reader.
   *   await screenReader.stop();
   * })();
   * ```
   *
   * The matcher can be an exact matching string, a regular expression, or a function
   * that returns whether the spoken phrase matches. The command throws if no
   * match is found within `maxNavigationAttempts` (default is `10`). If the last spoken phrase is
   * already a match then no navigation occurs.
   *
   * @param spokenPhraseMatcher Matcher for the phrase spoken at each location.
   * @param options Additional navigation and command options.
   */
  async navigatePreviousUntil(
    spokenPhraseMatcher: SpokenPhraseMatcher,
    options?: NavigateOptions,
  ) {
    return await navigateUntil(this, "previous", spokenPhraseMatcher, options);
  }

  /**
   * Move the virtual cursor to the next location until its spoken phrase matches
   * the provided matcher.
   *
   * ```ts
   * import { screenReader } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start the screen reader.
   *   await screenReader.start();
   *
   *   // Move to the next item containing the exact spoken phrase.
   *   await screenReader.navigateNextUntil(/Submit/);
   *
   *   // Stop the screen reader.
   *   await screenReader.stop();
   * })();
   * ```
   *
   * The matcher can be an exact matching string, a regular expression, or a function
   * that returns whether the spoken phrase matches. The command throws if no
   * match is found within `maxNavigationAttempts` (default is `10`). If the last spoken phrase is
   * already a match then no navigation occurs.
   *
   * @param spokenPhraseMatcher Matcher for the phrase spoken at each location.
   * @param options Additional navigation and command options.
   */
  async navigateNextUntil(
    spokenPhraseMatcher: SpokenPhraseMatcher,
    options?: NavigateOptions,
  ) {
    return await navigateUntil(this, "next", spokenPhraseMatcher, options);
  }

  /**
   * Move the virtual cursor to the previous heading until its spoken phrase
   * matches the provided matcher.
   *
   * ```ts
   * import { screenReader } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start the screen reader.
   *   await screenReader.start();
   *
   *   // Move to the previous heading with a matching spoken phrase.
   *   await screenReader.navigatePreviousHeadingUntil(/Account/);
   *
   *   // Stop the screen reader.
   *   await screenReader.stop();
   * })();
   * ```
   *
   * The matcher can be an exact matching string, a regular expression, or a function
   * that returns whether the spoken phrase matches. The command throws if no
   * match is found within `maxNavigationAttempts` (default is `10`). If the last spoken phrase is
   * already a match then no navigation occurs.
   *
   * @param spokenPhraseMatcher Matcher for the phrase spoken at each heading.
   * @param options Additional navigation and command options.
   */
  async navigatePreviousHeadingUntil(
    spokenPhraseMatcher: SpokenPhraseMatcher,
    options?: NavigateOptions,
  ) {
    return await navigateUntil(
      this,
      "previousHeading",
      spokenPhraseMatcher,
      options,
    );
  }

  /**
   * Move the virtual cursor to the next heading until its spoken phrase matches
   * the provided matcher.
   *
   * ```ts
   * import { screenReader } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start the screen reader.
   *   await screenReader.start();
   *
   *   // Move to the next heading with a matching spoken phrase.
   *   await screenReader.navigateNextHeadingUntil(/Account/);
   *
   *   // Stop the screen reader.
   *   await screenReader.stop();
   * })();
   * ```
   *
   * The matcher can be an exact matching string, a regular expression, or a function
   * that returns whether the spoken phrase matches. The command throws if no
   * match is found within `maxNavigationAttempts` (default is `10`). If the last spoken phrase is
   * already a match then no navigation occurs.
   *
   * @param spokenPhraseMatcher Matcher for the phrase spoken at each heading.
   * @param options Additional navigation and command options.
   */
  async navigateNextHeadingUntil(
    spokenPhraseMatcher: SpokenPhraseMatcher,
    options?: NavigateOptions,
  ) {
    return await navigateUntil(
      this,
      "nextHeading",
      spokenPhraseMatcher,
      options,
    );
  }

  /**
   * Move the virtual cursor to the previous link until its spoken phrase matches
   * the provided matcher.
   *
   * ```ts
   * import { screenReader } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start the screen reader.
   *   await screenReader.start();
   *
   *   // Move to the previous link with a matching spoken phrase.
   *   await screenReader.navigatePreviousLinkUntil(/Home/);
   *
   *   // Stop the screen reader.
   *   await screenReader.stop();
   * })();
   * ```
   *
   * The matcher can be an exact matching string, a regular expression, or a function
   * that returns whether the spoken phrase matches. The command throws if no
   * match is found within `maxNavigationAttempts` (default is `10`). If the last spoken phrase is
   * already a match then no navigation occurs.
   *
   * @param spokenPhraseMatcher Matcher for the phrase spoken at each link.
   * @param options Additional navigation and command options.
   */
  async navigatePreviousLinkUntil(
    spokenPhraseMatcher: SpokenPhraseMatcher,
    options?: NavigateOptions,
  ) {
    return await navigateUntil(
      this,
      "previousLink",
      spokenPhraseMatcher,
      options,
    );
  }

  /**
   * Move the virtual cursor to the next link until its spoken phrase matches the
   * provided matcher.
   *
   * ```ts
   * import { screenReader } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start the screen reader.
   *   await screenReader.start();
   *
   *   // Move to the next link with a matching spoken phrase.
   *   await screenReader.navigateNextLinkUntil(/Home/);
   *
   *   // Stop the screen reader.
   *   await screenReader.stop();
   * })();
   * ```
   *
   * The matcher can be an exact matching string, a regular expression, or a function
   * that returns whether the spoken phrase matches. The command throws if no
   * match is found within `maxNavigationAttempts` (default is `10`). If the last spoken phrase is
   * already a match then no navigation occurs.
   *
   * @param spokenPhraseMatcher Matcher for the phrase spoken at each link.
   * @param options Additional navigation and command options.
   */
  async navigateNextLinkUntil(
    spokenPhraseMatcher: SpokenPhraseMatcher,
    options?: NavigateOptions,
  ) {
    return await navigateUntil(this, "nextLink", spokenPhraseMatcher, options);
  }

  /**
   * Move the virtual cursor to the previous landmark until its spoken phrase
   * matches the provided matcher.
   *
   * ```ts
   * import { screenReader } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start the screen reader.
   *   await screenReader.start();
   *
   *   // Move to the previous landmark with a matching spoken phrase.
   *   await screenReader.navigatePreviousLandmarkUntil(/Main/);
   *
   *   // Stop the screen reader.
   *   await screenReader.stop();
   * })();
   * ```
   *
   * The matcher can be an exact matching string, a regular expression, or a function
   * that returns whether the spoken phrase matches. The command throws if no
   * match is found within `maxNavigationAttempts` (default is `10`). If the last spoken phrase is
   * already a match then no navigation occurs.
   *
   * @param spokenPhraseMatcher Matcher for the phrase spoken at each landmark.
   * @param options Additional navigation and command options.
   */
  async navigatePreviousLandmarkUntil(
    spokenPhraseMatcher: SpokenPhraseMatcher,
    options?: NavigateOptions,
  ) {
    return await navigateUntil(
      this,
      "previousLandmark",
      spokenPhraseMatcher,
      options,
    );
  }

  /**
   * Move the virtual cursor to the next landmark until its spoken phrase matches
   * the provided matcher.
   *
   * ```ts
   * import { screenReader } from "@guidepup/guidepup";
   *
   * (async () => {
   *   // Start the screen reader.
   *   await screenReader.start();
   *
   *   // Move to the next landmark with a matching spoken phrase.
   *   await screenReader.navigateNextLandmarkUntil(/Main/);
   *
   *   // Stop the screen reader.
   *   await screenReader.stop();
   * })();
   * ```
   *
   * The matcher can be an exact matching string, a regular expression, or a function
   * that returns whether the spoken phrase matches. The command throws if no
   * match is found within `maxNavigationAttempts` (default is `10`). If the last spoken phrase is
   * already a match then no navigation occurs.
   *
   * @param spokenPhraseMatcher Matcher for the phrase spoken at each landmark.
   * @param options Additional navigation and command options.
   */
  async navigateNextLandmarkUntil(
    spokenPhraseMatcher: SpokenPhraseMatcher,
    options?: NavigateOptions,
  ) {
    return await navigateUntil(
      this,
      "nextLandmark",
      spokenPhraseMatcher,
      options,
    );
  }
}
