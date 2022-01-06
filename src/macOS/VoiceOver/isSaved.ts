import type { Options } from "../types";
import { getLastSpokenPhrase } from "./getLastSpokenPhrase";

export async function isSaved(options?: Options): Promise<boolean> {
  const lastPhrase = await getLastSpokenPhrase(options);

  return lastPhrase.startsWith("Last phrase saved to Desktop");
}
