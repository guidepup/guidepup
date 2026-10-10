import type { CommandOptions } from "../src/CommandOptions";
import { delay } from "../src/delay";
import { execFileSync } from "node:child_process";

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
  const visitedWindowIds = new Set<string>();

  try {
    while (true) {
      const windowId = execFileSync("xdotool", ["getactivewindow"], {
        encoding: "utf8",
      }).trim();

      if (visitedWindowIds.has(windowId)) {
        throw new Error(
          `Unable to focus browser window with title "${pageTitle}": Alt+Tab cycled through all active windows.`,
        );
      }

      visitedWindowIds.add(windowId);
      await orca.clearSpokenPhraseLog();
      await orca.perform(presentTitleCommand, { capture: "initial" });

      const windowTitle = cleanString(await orca.lastSpokenPhrase());

      if (windowTitle.includes(cleanedPageTitle)) {
        return;
      }

      execFileSync("xdotool", ["key", "--clearmodifiers", "alt+Tab"]);
      await delay(100);
    }
  } finally {
    await orca.clearSpokenPhraseLog();

    const spokenPhraseLog = await orca.spokenPhraseLog();

    spokenPhraseLog.push(...currentSpokenPhraseLog);
  }
};
