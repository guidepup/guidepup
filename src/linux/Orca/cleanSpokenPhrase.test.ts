import { cleanSpokenPhrase } from "./cleanSpokenPhrase";

describe("cleanSpokenPhrase", () => {
  it.each`
    description                                 | spokenPhrase                                   | expected
    ${"plain text"}                             | ${"Heading level 1"}                           | ${"Heading level 1"}
    ${"SSML tags"}                              | ${"<speak>Get Started. <break/>link.</speak>"} | ${"Get Started. link."}
    ${"a double-quoted sub alias"}              | ${'<sub alias="dot">.</sub> com'}              | ${"dot com"}
    ${"a single-quoted sub alias"}              | ${"<sub alias='dot'>.</sub> com"}              | ${"dot com"}
    ${"a sub alias with other attributes"}      | ${'<SUB data-x="1" alias="dot">.</SUB>'}       | ${"dot"}
    ${"whitespace runs and surrounding spaces"} | ${"  Screen\n reader \t on.  "}                | ${"Screen reader on."}
    ${"an empty phrase"}                        | ${"<speak></speak>"}                           | ${""}
  `("should clean $description", ({ spokenPhrase, expected }) => {
    expect(cleanSpokenPhrase(spokenPhrase)).toBe(expected);
  });
});
