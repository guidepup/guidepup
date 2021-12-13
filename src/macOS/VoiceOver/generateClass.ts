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

const prefix = `// This file was automatically generated.\n// Manual changes will not be preserved.\n\nimport { VoiceOverBase } from "./VoiceOverBase";\nimport { keyCodeCommands } from "./keyCodeCommands";\nimport { CommanderCommands } from "./CommanderCommands";\n\nexport class VoiceOver extends VoiceOverBase {\n`;
const suffix = `}\n`;

const gestureMethodDefinitions = Object.entries(keyCodeCommands).reduce(
  (definitions, [name, command], i, commandsArray) => {
    const methodSuffix = i === commandsArray.length - 1 ? "\n" : "\n\n";

    return (definitions += `  /**\n   * ${
      command.description
    }\n   *\n   * Uses VoiceOver keycode gesture\n   *\n   * Gesture: ${
      command.gesture
    }\n   */\n  async gesture${title(
      name
    )}(): Promise<void> {\n    return await this.keyCode(keyCodeCommands.${name});\n  }${methodSuffix}`);
  },
  ""
);

const commanderMethodDefinitions = Object.entries(CommanderCommands).reduce(
  (definitions, [name, command], i, commandsArray) => {
    const methodSuffix = i === commandsArray.length - 1 ? "\n" : "\n\n";

    return (definitions += `  /**\n   * ${title(
      command
    )}\n   *\n   * Uses VoiceOver Commander\n   */\n  async ${camelCase(
      `commander ${command}`
    )}(): Promise<void> {\n    return await this.performCommand(CommanderCommands.${name});\n  }${methodSuffix}`);
  },
  ""
);

const generatedClass = `${prefix}${gestureMethodDefinitions}\n${commanderMethodDefinitions}${suffix}`;

writeFile(resolve(__dirname, "./VoiceOver.ts"), generatedClass, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});
