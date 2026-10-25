export type SpokenPhraseMatcherFunction = (spokenPhrase: string) => boolean;

export type SpokenPhraseMatcher = SpokenPhraseMatcherFunction | RegExp | string;
