export const logIncludesExpectedPhrases = (
  log: string[],
  expectedPhrases: string[]
) => {
  const failures: string[] = [];

  for (const expectedPhrase of expectedPhrases) {
    const foundExpectedPhrase = !!log.find((logItem) =>
      logItem.includes(expectedPhrase)
    );

    if (!foundExpectedPhrase) {
      failures.push(expectedPhrase);
    }
  }

  if (failures.length) {
    throw new Error(
      `Did not find the following expected text:\n- ${failures.join("\n- ")}`
    );
  }
};
