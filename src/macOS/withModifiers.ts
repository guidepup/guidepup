import { Modifiers } from "./Modifiers";

export const withModifiers = (modifiers: Modifiers[], script: string) => {
  let commandString = "\n";

  if (!script) {
    return commandString;
  }

  const hasShift = !!modifiers.find((modifier) => modifier === Modifiers.Shift);
  const filteredModifiers = modifiers.filter(
    (modifier) => modifier !== Modifiers.Shift
  );

  if (hasShift) {
    commandString += `key down ${Modifiers.Shift}\n`;
  }

  commandString += `${script}${
    filteredModifiers.length
      ? ` using {${filteredModifiers
          .map((modifier) => `${modifier} down`)
          .join(", ")}}`
      : ""
  }\n`;

  if (hasShift) {
    commandString += `key up ${Modifiers.Shift}\n`;
  }

  return commandString;
};
