import type { CommandOptions } from "../src/CommandOptions";
import { delay } from "../src/delay";
import { execFileSync } from "node:child_process";

const MAX_APPLICATION_SWITCH_RETRY_COUNT = 10;

const cleanString = (str: string): string =>
  str
    .toLowerCase()
    .replace(/[|¦:;'"`\-‐–—·_()[\]{}\\^~]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

type OrcaFocusController<Command> = {
  perform(
    command: Command,
    options?: Pick<CommandOptions, "capture">,
  ): Promise<void>;
  lastSpokenPhrase(): Promise<string>;
  spokenPhraseLog(): Promise<string[]>;
  clearSpokenPhraseLog(): Promise<void>;
};

export const focusOrcaBrowser = async <Command>({
  orca,
  pageTitle,
  presentTitleCommand,
}: {
  orca: OrcaFocusController<Command>;
  pageTitle: string;
  presentTitleCommand: Command;
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
      await orca.perform(presentTitleCommand, { capture: "initial" });

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
