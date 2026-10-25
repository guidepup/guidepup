import type { Capture } from "./Capture";
import type { ClickOptions } from "./ClickOptions";
import type { CommandOptions } from "./CommandOptions";
import type { KeyboardOptions } from "./KeyboardOptions";
import type { NavigateOptions } from "./NavigateOptions";
import type { SpokenPhraseMatcher } from "./SpokenPhraseMatcher";
import type { StartOptions } from "./StartOptions";

export interface IScreenReader {
  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-iscreenreader#screenreader-name)
   *
   * The screen reader name.
   */
  name: string;

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-iscreenreader#screenreader-version)
   *
   * The screen reader version.
   */
  version: string;

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-iscreenreader#screenreader-detect)
   *
   * Detect whether the screen reader is supported for the current OS.
   *
   * @returns {boolean}
   */
  detect(): boolean;

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-iscreenreader#screenreader-default)
   *
   * Detect whether the screen reader is the default screen reader for the current OS.
   *
   * @returns {boolean}
   */
  default(): boolean;

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-iscreenreader#screenreader-start)
   *
   * Turn the screen reader on.
   *
   * @param {object} [options] Additional options.
   */
  start(options?: StartOptions): Promise<void>;

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-iscreenreader#screenreader-stop)
   *
   * Turn the screen reader off.
   *
   * @param {object} [options] Additional options.
   */
  stop(options?: CommandOptions): Promise<void>;

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-iscreenreader#screenreader-previous)
   *
   * Move the screen reader cursor to the previous location.
   *
   * @param {object} [options] Additional options.
   */
  previous(options?: CommandOptions): Promise<void>;

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-iscreenreader#screenreader-next)
   *
   * Move the screen reader cursor to the next location.
   *
   * @param {object} [options] Additional options.
   */
  next(options?: CommandOptions): Promise<void>;

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-iscreenreader#screenreader-previous-heading)
   *
   * Move the screen reader cursor to the previous heading.
   *
   * @param {object} [options] Additional options.
   */
  previousHeading(options?: CommandOptions): Promise<void>;

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-iscreenreader#screenreader-next-heading)
   *
   * Move the screen reader cursor to the next heading.
   *
   * @param {object} [options] Additional options.
   */
  nextHeading(options?: CommandOptions): Promise<void>;

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-iscreenreader#screenreader-previous-link)
   *
   * Move the screen reader cursor to the previous link.
   *
   * @param {object} [options] Additional options.
   */
  previousLink(options?: CommandOptions): Promise<void>;

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-iscreenreader#screenreader-next-link)
   *
   * Move the screen reader cursor to the next link.
   *
   * @param {object} [options] Additional options.
   */
  nextLink(options?: CommandOptions): Promise<void>;

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-iscreenreader#screenreader-previous-landmark)
   *
   * Move the screen reader cursor to the previous landmark.
   *
   * @param {object} [options] Additional options.
   */
  previousLandmark(options?: CommandOptions): Promise<void>;

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-iscreenreader#screenreader-next-landmark)
   *
   * Move the screen reader cursor to the next landmark.
   *
   * @param {object} [options] Additional options.
   */
  nextLandmark(options?: CommandOptions): Promise<void>;

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-iscreenreader#screenreader-act)
   *
   * Perform the default action for the item in the screen reader cursor.
   *
   * @param {object} [options] Additional options.
   */
  act(options?: CommandOptions): Promise<void>;

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-iscreenreader#screenreader-interact)
   *
   * Interact with the item under the screen reader cursor.
   *
   * @param {object} [options] Additional options.
   */
  interact(options?: CommandOptions): Promise<void>;

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-iscreenreader#screenreader-stop-interacting)
   *
   * Stop interacting with the current item.
   *
   * @param {object} [options] Additional options.
   */
  stopInteracting(options?: CommandOptions): Promise<void>;

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-iscreenreader#screenreader-press)
   *
   * Press a key on the focused item.
   *
   * `key` can specify the intended [keyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)
   * value or a single character to generate the text for. A superset of the `key` values can be found
   * [on the MDN key values page](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values). Examples of the keys are:
   *
   * `F1` - `F20`, `Digit0` - `Digit9`, `KeyA` - `KeyZ`, `Backquote`, `Minus`, `Equal`, `Backslash`, `Backspace`, `Tab`,
   * `Delete`, `Escape`, `ArrowDown`, `End`, `Enter`, `Home`, `Insert`, `PageDown`, `PageUp`, `ArrowRight`, `ArrowUp`, etc.
   *
   * Following modification shortcuts are also supported: `Shift`, `Control`, `Alt`, `Meta`.
   *
   * Holding down `Shift` will type the text that corresponds to the `key` in the upper case.
   *
   * If `key` is a single character, it is case-sensitive, so the values `a` and `A` will generate different respective
   * texts.
   *
   * Shortcuts such as `key: "Control+f"` or `key: "Control+Shift+f"` are supported as well. When specified with the
   * modifier, modifier is pressed and being held while the subsequent key is being pressed.
   *
   * @param {string} key Name of the key to press or a character to generate, such as `ArrowLeft` or `a`.
   * @param {object} [options] Additional options.
   */
  press(key: string, options?: KeyboardOptions): Promise<void>;

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-iscreenreader#screenreader-type)
   *
   * Type text into the focused item.
   *
   * To press a special key, like `Control` or `ArrowDown`, use `press(key[, options])`.
   *
   * @param {string} text Text to type into the focused item.
   * @param {object} [options] Additional options.
   */
  type(text: string, options?: KeyboardOptions): Promise<void>;

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-iscreenreader#screenreader-perform)
   *
   * Perform a screen reader command.
   *
   * @param {any} command Screen reader keyboard command or commander command to execute.
   * @param {object} [options] Additional options.
   */
  perform(command: unknown, options?: CommandOptions): Promise<void>;

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-iscreenreader#screenreader-click)
   *
   * Click the mouse.
   *
   * @param {object} [options] Click options.
   */
  click(options?: ClickOptions): Promise<void>;

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-iscreenreader#screenreader-last-spoken-phrase)
   *
   * Get the last spoken phrase.
   *
   * @returns {Promise<string>} The last spoken phrase.
   */
  lastSpokenPhrase(): Promise<string>;

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-iscreenreader#screenreader-item-text)
   *
   * Get the text of the item in the screen reader cursor.
   *
   * @returns {Promise<string>} The item's text.
   */
  itemText(): Promise<string>;

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-iscreenreader#screenreader-spoken-phrase-log)
   *
   * Get the log of all spoken phrases for this screen reader instance.
   *
   * @returns {Promise<string[]>} The spoken phrase log.
   */
  spokenPhraseLog(): Promise<string[]>;

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-iscreenreader#screenreader-clear-spoken-phrase-log)
   *
   * Clear the log of all spoken phrases for this screen reader instance.
   */
  clearSpokenPhraseLog(): Promise<void>;

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-iscreenreader#screenreader-item-text-log)
   *
   * Get the log of all visited item text for this screen reader instance.
   *
   * @returns {Promise<string[]>} The item text log.
   */
  itemTextLog(): Promise<string[]>;

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-iscreenreader#screenreader-clear-item-text-log)
   *
   * Clear the log of all visited item text for this screen reader instance.
   */
  clearItemTextLog(): Promise<void>;

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-iscreenreader#screenreader-get-settings)
   *
   * Returns all the current settings for this screen reader instance.
   *
   * @returns {Record<string, unknown>} Current settings values.
   */
  getSettings(): Record<string, unknown>;

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-iscreenreader#screenreader-get-setting)
   *
   * Returns the value of a setting for this screen reader instance.
   *
   * @param {string} key The setting name.
   * @returns {unknown} The setting value.
   */
  getSetting(key: string): unknown;

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-iscreenreader#screenreader-capture)
   *
   * Capture screen reader output produced by an action.
   *
   * The action can be performed using an external automation tool such as
   * Playwright. Guidepup captures the screen reader output associated with
   * the action and returns it together with the action's result.
   *
   * @param {() => Promise<T>} action The action to perform while capturing screen reader output.
   * @param {object} [options] Additional options.
   * @returns {Promise<Capture<T>>} The action's result and captured screen reader output.
   */
  capture<T>(
    action: () => Promise<T>,
    options?: CommandOptions,
  ): Promise<Capture<T>>;

  /**
   * Move the virtual cursor to the previous location until its spoken phrase
   * matches the provided matcher.
   *
   * The matcher can be an exact matching string, a regular expression, or a function
   * that returns whether the spoken phrase matches. The command throws if no
   * match is found within `maxNavigationAttempts`. If the last spoken phrase is
   * already a match then navigation occurs.
   *
   * @param spokenPhraseMatcher Matcher for the phrase spoken at each location.
   * @param options Additional navigation and command options.
   */
  navigatePreviousUntil(
    spokenPhraseMatcher: SpokenPhraseMatcher,
    options?: NavigateOptions,
  ): Promise<void>;

  /**
   * Move the virtual cursor to the next location until its spoken phrase matches
   * the provided matcher.
   *
   * The matcher can be an exact matching string, a regular expression, or a function
   * that returns whether the spoken phrase matches. The command throws if no
   * match is found within `maxNavigationAttempts`. If the last spoken phrase is
   * already a match then navigation occurs.
   *
   * @param spokenPhraseMatcher Matcher for the phrase spoken at each location.
   * @param options Additional navigation and command options.
   */
  navigateNextUntil(
    spokenPhraseMatcher: SpokenPhraseMatcher,
    options?: NavigateOptions,
  ): Promise<void>;

  /**
   * Move the virtual cursor to the previous heading until its spoken phrase
   * matches the provided matcher.
   *
   * The matcher can be an exact matching string, a regular expression, or a function
   * that returns whether the spoken phrase matches. The command throws if no
   * match is found within `maxNavigationAttempts`. If the last spoken phrase is
   * already a match then navigation occurs.
   *
   * @param spokenPhraseMatcher Matcher for the phrase spoken at each heading.
   * @param options Additional navigation and command options.
   */
  navigatePreviousHeadingUntil(
    spokenPhraseMatcher: SpokenPhraseMatcher,
    options?: NavigateOptions,
  ): Promise<void>;

  /**
   * Move the virtual cursor to the next heading until its spoken phrase matches
   * the provided matcher.
   *
   * The matcher can be an exact matching string, a regular expression, or a function
   * that returns whether the spoken phrase matches. The command throws if no
   * match is found within `maxNavigationAttempts`. If the last spoken phrase is
   * already a match then navigation occurs.
   *
   * @param spokenPhraseMatcher Matcher for the phrase spoken at each heading.
   * @param options Additional navigation and command options.
   */
  navigateNextHeadingUntil(
    spokenPhraseMatcher: SpokenPhraseMatcher,
    options?: NavigateOptions,
  ): Promise<void>;

  /**
   * Move the virtual cursor to the previous link until its spoken phrase matches
   * the provided matcher.
   *
   * The matcher can be an exact matching string, a regular expression, or a function
   * that returns whether the spoken phrase matches. The command throws if no
   * match is found within `maxNavigationAttempts`. If the last spoken phrase is
   * already a match then navigation occurs.
   *
   * @param spokenPhraseMatcher Matcher for the phrase spoken at each link.
   * @param options Additional navigation and command options.
   */
  navigatePreviousLinkUntil(
    spokenPhraseMatcher: SpokenPhraseMatcher,
    options?: NavigateOptions,
  ): Promise<void>;

  /**
   * Move the virtual cursor to the next link until its spoken phrase matches the
   * provided matcher.
   *
   * The matcher can be an exact matching string, a regular expression, or a function
   * that returns whether the spoken phrase matches. The command throws if no
   * match is found within `maxNavigationAttempts`. If the last spoken phrase is
   * already a match then navigation occurs.
   *
   * @param spokenPhraseMatcher Matcher for the phrase spoken at each link.
   * @param options Additional navigation and command options.
   */
  navigateNextLinkUntil(
    spokenPhraseMatcher: SpokenPhraseMatcher,
    options?: NavigateOptions,
  ): Promise<void>;

  /**
   * Move the virtual cursor to the previous landmark until its spoken phrase
   * matches the provided matcher.
   *
   * The matcher can be an exact matching string, a regular expression, or a function
   * that returns whether the spoken phrase matches. The command throws if no
   * match is found within `maxNavigationAttempts`. If the last spoken phrase is
   * already a match then navigation occurs.
   *
   * @param spokenPhraseMatcher Matcher for the phrase spoken at each landmark.
   * @param options Additional navigation and command options.
   */
  navigatePreviousLandmarkUntil(
    spokenPhraseMatcher: SpokenPhraseMatcher,
    options?: NavigateOptions,
  ): Promise<void>;

  /**
   * Move the virtual cursor to the next landmark until its spoken phrase matches
   * the provided matcher.
   *
   * The matcher can be an exact matching string, a regular expression, or a function
   * that returns whether the spoken phrase matches. The command throws if no
   * match is found within `maxNavigationAttempts`. If the last spoken phrase is
   * already a match then navigation occurs.
   *
   * @param spokenPhraseMatcher Matcher for the phrase spoken at each landmark.
   * @param options Additional navigation and command options.
   */
  navigateNextLandmarkUntil(
    spokenPhraseMatcher: SpokenPhraseMatcher,
    options?: NavigateOptions,
  ): Promise<void>;
}
