export function cleanSpokenPhrase(spokenPhrase: string): string {
  return spokenPhrase.replace(/<\/?(?:speak|mark)(?:\s[^>]*)?\s*\/?>/g, "");
}
