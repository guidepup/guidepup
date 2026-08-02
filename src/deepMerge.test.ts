import { deepMerge } from "./deepMerge";

describe("deepMerge", () => {
  it.each`
    description                           | target                   | source             | expected
    ${"empty objects"}                    | ${{}}                    | ${{}}              | ${{}}
    ${"adds new keys"}                    | ${{ a: 1 }}              | ${{ b: 2 }}        | ${{ a: 1, b: 2 }}
    ${"overwrites primitive values"}      | ${{ a: 1 }}              | ${{ a: 2 }}        | ${{ a: 2 }}
    ${"merges nested objects"}            | ${{ a: { b: 1, c: 2 } }} | ${{ a: { b: 3 } }} | ${{ a: { b: 3, c: 2 } }}
    ${"overwrites object with primitive"} | ${{ a: { b: 1 } }}       | ${{ a: "value" }}  | ${{ a: "value" }}
    ${"overwrites primitive with object"} | ${{ a: "value" }}        | ${{ a: { b: 1 } }} | ${{ a: { b: 1 } }}
    ${"replaces arrays"}                  | ${{ a: [1, 2] }}         | ${{ a: [3] }}      | ${{ a: [3] }}
    ${"handles null values"}              | ${{ a: { b: 1 } }}       | ${{ a: null }}     | ${{ a: null }}
  `("$description", ({ target, source, expected }) => {
    expect(deepMerge(target, source)).toEqual(expected);
  });

  it("should not mutate the target", () => {
    const target = {
      a: {
        b: 1,
      },
    };

    deepMerge(target, {
      a: {
        c: 2,
      },
    });

    expect(target).toEqual({
      a: {
        b: 1,
      },
    });
  });

  it("should not mutate the source", () => {
    const source = {
      a: {
        c: 2,
      },
    };

    deepMerge(
      {
        a: {
          b: 1,
        },
      },
      source,
    );

    expect(source).toEqual({
      a: {
        c: 2,
      },
    });
  });
});
