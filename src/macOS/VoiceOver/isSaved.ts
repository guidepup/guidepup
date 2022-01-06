import type { RetryableCommandOptions } from "../../options";
import { getLastSpokenPhrase } from "./getLastSpokenPhrase";

export async function isSaved(options?: RetryableCommandOptions): Promise<boolean> {
  const lastPhrase = await getLastSpokenPhrase(options);

  return lastPhrase.startsWith("Last phrase saved to Desktop");
}
