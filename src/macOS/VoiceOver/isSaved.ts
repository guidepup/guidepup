import type { CommandOptions } from "../../CommandOptions";
import { getLastSpokenPhrase } from "./getLastSpokenPhrase";

export async function isSaved(options?: CommandOptions): Promise<boolean> {
  const lastPhrase = await getLastSpokenPhrase(options);

  return lastPhrase.startsWith("Last phrase saved to Desktop");
}
