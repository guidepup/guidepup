import type { CommandOptions } from "../../CommandOptions";
import { ERR_VOICE_OVER_SAVED_TIMEOUT } from "../errors";
import { isSaved } from "./isSaved";
import { waitForCondition } from "../../waitForCondition";

const ONE_SECOND = 1000;
const TWENTY_SECONDS = 20000;

export async function waitForSaved(options?: CommandOptions): Promise<void> {
  return await waitForCondition(async () => await isSaved(options), {
    timeoutErrorMessage: ERR_VOICE_OVER_SAVED_TIMEOUT,
    pollInterval: ONE_SECOND,
    pollTimeout: TWENTY_SECONDS,
  });
}
