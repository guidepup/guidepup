import { getLastSpokenPhrase } from "./getLastSpokenPhrase";

export async function isSaved(): Promise<boolean> {
  const lastPhrase = await getLastSpokenPhrase();

  return lastPhrase.startsWith("Last phrase saved to Desktop");
}
