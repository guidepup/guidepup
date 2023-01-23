import { cleanSpokenPhrase } from "./cleanSpokenPhrase";

describe("cleanSpokenPhrase", () => {
  it.each`
    description                                                                               | input                                      | output
    ${"should return an empty string for an empty string"}                                    | ${""}                                      | ${""}
    ${"should return an empty string for 'missing value'"}                                    | ${"missing value"}                         | ${""}
    ${"should return an empty string for 'missing value' with whitespace padding"}            | ${"  missing value   "}                    | ${""}
    ${"should return the string when includes 'missing value' as part but not whole"}         | ${"This element has a missing value"}      | ${"This element has a missing value"}
    ${"should return the trimmed string when includes 'missing value' as part but not whole"} | ${"  This element has a missing value   "} | ${"This element has a missing value"}
    ${"should return a clean string as-is"}                                                   | ${"This is a string"}                      | ${"This is a string"}
    ${"should remove whitespace padding from a string"}                                                   | ${"   This is a string "}                      | ${"This is a string"}
  `("$description", ({ input, output }) => {
    expect(cleanSpokenPhrase(input)).toEqual(output);
  });
});
