import {
  ERR_NAVIGATE_UNTIL_INVALID_MAX_NAVIGATION_ATTEMPTS,
  ERR_NAVIGATE_UNTIL_NOT_FOUND,
} from "./errors";
import type { IScreenReader } from "./IScreenReader";
import type { NavigateOptions } from "./NavigateOptions";
import type { SpokenPhraseMatcher } from "./SpokenPhraseMatcher";

const DEFAULT_MAX_NAVIGATION_ATTEMPTS = 10;

function matchesSpokenPhrase(
  spokenPhrase: string,
  matcher: SpokenPhraseMatcher,
): boolean {
  if (typeof matcher === "function") {
    return matcher(spokenPhrase);
  }

  if (matcher instanceof RegExp) {
    matcher.lastIndex = 0;

    return matcher.test(spokenPhrase);
  }

  return spokenPhrase === matcher;
}

export async function navigateUntil(
  screenReader: IScreenReader,
  method: string,
  spokenPhraseMatcher: SpokenPhraseMatcher,
  options?: NavigateOptions,
): Promise<void> {
  const {
    maxNavigationAttempts = DEFAULT_MAX_NAVIGATION_ATTEMPTS,
    ...commandOptions
  } = options ?? {};

  if (!Number.isInteger(maxNavigationAttempts) || maxNavigationAttempts < 0) {
    throw new RangeError(ERR_NAVIGATE_UNTIL_INVALID_MAX_NAVIGATION_ATTEMPTS);
  }

  for (let i = 0; i < maxNavigationAttempts; i++) {
    await screenReader[method](commandOptions);

    const spokenPhrase = await screenReader.lastSpokenPhrase();

    if (matchesSpokenPhrase(spokenPhrase, spokenPhraseMatcher)) {
      return;
    }
  }

  throw new Error(`${ERR_NAVIGATE_UNTIL_NOT_FOUND}${maxNavigationAttempts}`);
}
