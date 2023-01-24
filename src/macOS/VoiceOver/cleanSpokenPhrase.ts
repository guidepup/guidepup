export function cleanSpokenPhrase(phrase: string): string {
  return phrase
    .trim()
    .replace(/^missing value$/, "")
    .replaceAll("@VOModifier()", "Control-Option")
    .replace(/\s\s+/g, " ");
}
