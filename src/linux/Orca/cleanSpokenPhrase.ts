export function cleanSpokenPhrase(spokenPhrase: string): string {
  return spokenPhrase
    .replace(
      /<sub\b[^>]*\balias=(?:"([^"]*)"|'([^']*)')[^>]*>.*?<\/sub>/gi,
      (_, doubleQuoted, singleQuoted) => doubleQuoted ?? singleQuoted,
    )
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
