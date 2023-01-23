import { cleanSpokenPhrase } from "./cleanSpokenPhrase";

describe("cleanSpokenPhrase", () => {
  it.each`
    description                                                                    | input                                            | output
    ${"should return an empty string for an empty string"}                         | ${""}                                            | ${""}
    ${"should return an empty string for 'missing value'"}                         | ${"missing value"}                               | ${""}
    ${"should return an empty string for 'missing value' with whitespace padding"} | ${"  missing value   "}                          | ${""}
    ${"should return the string when includes 'missing value'"}                    | ${"A missing value"}                             | ${"A missing value"}
    ${"should return the trimmed string when includes 'missing value'"}            | ${"  A missing value   "}                        | ${"A missing value"}
    ${"should return a clean string as-is"}                                        | ${"This is a string"}                            | ${"This is a string"}
    ${"should remove whitespace padding from a string"}                            | ${"   This is a string "}                        | ${"This is a string"}
    ${"should replace all instances of '@VOModifier()'"}                           | ${" Press @VOModifier() and then @VOModifier()"} | ${"Press Control-Option and then Control-Option"}
  `("$description", ({ input, output }) => {
    expect(cleanSpokenPhrase(input)).toEqual(output);
  });
});
