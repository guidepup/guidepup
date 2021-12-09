import { getLastPhrase } from "./getLastPhrase";

export async function isSaved(): Promise<boolean> {
  const lastPhrase = await getLastPhrase();

  return lastPhrase.startsWith("Last phrase saved to Desktop");
}
