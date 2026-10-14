import { cleanString } from "../cleanString";
import { delay } from "../../src/delay";
import { execFileSync } from "node:child_process";
import type { Orca } from "../../src";

const MAX_APPLICATION_SWITCH_RETRY_COUNT = 10;

export const focusOrcaBrowser = async ({
  orca,
  pageTitle,
}: {
  orca: Orca;
  pageTitle: string;
}): Promise<void> => {
  const cleanedPageTitle = cleanString(pageTitle);

  if (!cleanedPageTitle) {
    throw new Error("Cannot focus a browser window with an empty page title.");
  }

  const currentSpokenPhraseLog = [...(await orca.spokenPhraseLog())];

  try {
    for (
      let retryCount = 0;
      retryCount <= MAX_APPLICATION_SWITCH_RETRY_COUNT;
      retryCount++
    ) {
      await orca.clearSpokenPhraseLog();
      await orca.perform(orca.keyboardCommands.PresentTitle, {
        capture: "initial",
      });

      const windowTitle = cleanString(await orca.lastSpokenPhrase());

      if (windowTitle.includes(cleanedPageTitle)) {
        return;
      }

      if (retryCount < MAX_APPLICATION_SWITCH_RETRY_COUNT) {
        execFileSync("xdotool", ["key", "--clearmodifiers", "alt+Tab"]);

        await delay(100);
      }
    }

    throw new Error(
      `Unable to focus browser window with title "${pageTitle}" after ${MAX_APPLICATION_SWITCH_RETRY_COUNT} Alt+Tab attempts.`,
    );
  } finally {
    await orca.clearSpokenPhraseLog();

    const spokenPhraseLog = await orca.spokenPhraseLog();

    spokenPhraseLog.push(...currentSpokenPhraseLog);
  }
};
