import type { CommandOptions } from "../../CommandOptions";
import { lastSpokenPhrase } from "./lastSpokenPhrase";

export async function isSaved(options?: CommandOptions): Promise<boolean> {
  const lastPhrase = await lastSpokenPhrase(options);

  return lastPhrase.startsWith("Last phrase saved to Desktop");
}
