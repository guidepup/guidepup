import { writeFile } from "fs";
import { resolve } from "path";
import { keyCodeCommands } from "./keyCodeCommands";
import { CommanderCommands } from "./CommanderCommands";

function camelCase(str: string): string {
  return str
    .replace(/[()-]/g, " ")
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    )
    .replace(/\s+/g, "");
}

function title(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const prefix = `// This file was automatically generated.
// Manual changes will not be preserved.

import type { CommandOptions } from "../../options";
import { VoiceOverBase } from "./VoiceOverBase";
import { keyCodeCommands } from "./keyCodeCommands";
import { CommanderCommands } from "./CommanderCommands";

/**
 * Class for controlling the VoiceOver ScreenReader on MacOS.
 */
export class VoiceOver extends VoiceOverBase {
`;

const suffix = `}\n`;

const commandMethodDefinitions = Object.entries(keyCodeCommands).reduce(
  (definitions, [name, command], i, commandsArray) => {
    const methodSuffix = i === commandsArray.length - 1 ? "\n" : "\n\n";

    return (definitions += `  /**\n   * ${
      command.description
    }\n   *\n   * Uses VoiceOver keycode command\n   *\n   * Representation: ${
      command.representation
    }\n   *\n   * @param {object} [options] Additional options.\n   */\n  async command${title(
      name
    )}(options?: CommandOptions): Promise<void> {\n    return await this.sendKeys(keyCodeCommands.${name}, options);\n  }${methodSuffix}`);
  },
  ""
);

const commanderMethodDefinitions = Object.entries(CommanderCommands).reduce(
  (definitions, [name, command], i, commandsArray) => {
    const methodSuffix = i === commandsArray.length - 1 ? "\n" : "\n\n";

    return (definitions += `  /**\n   * ${title(
      command
    )}\n   *\n   * Uses VoiceOver Commander\n   *\n   * @param {object} [options] Additional options.\n   */\n  async ${camelCase(
      `commander ${command}`
    )}(options?: CommandOptions): Promise<void> {\n    return await this.performCommand(CommanderCommands.${name}, options);\n  }${methodSuffix}`);
  },
  ""
);

const generatedClass = `${prefix}${commandMethodDefinitions}\n${commanderMethodDefinitions}${suffix}`;

writeFile(resolve(__dirname, "./VoiceOver.ts"), generatedClass, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});
