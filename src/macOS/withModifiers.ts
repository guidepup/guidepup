import { Modifiers } from "./Modifiers";

export const withModifiers = (modifiers: Modifiers[], script: string) => {
  let commandString = "\n";

  for (const modifier of modifiers) {
    commandString += `key down ${modifier}\n`;
  }

  commandString += `${script}\n`;

  for (const modifier of modifiers.reverse()) {
    commandString += `key up ${modifier}\n`;
  }

  return commandString;
};
