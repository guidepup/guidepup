import { writeFile } from "fs";
import { resolve } from "path";
import { keyCodeCommands } from "./keyCodeCommands";

const prefix = `// This file was automatically generated.\n// Manual changes will not be preserved.\n\nimport { VoiceOverBase } from "./base";\nimport { keyCodeCommands } from "./keyCodeCommands";\n\nexport class VoiceOver extends VoiceOverBase {\n`;
const suffix = `}\n`;

const methodDefinitions = Object.entries(keyCodeCommands).reduce(
  (definitions, [name, command], i, commandsArray) => {
    const methodSuffix = i === commandsArray.length - 1 ? "\n" : "\n\n";

    return (definitions += `  /**\n   * ${
      command.description
    }\n   *\n   * Gesture: ${command.gesture}\n   */\n  async gesture${
      name.charAt(0).toUpperCase() + name.slice(1)
    }(): Promise<void> {\n    return await this.keyCode(keyCodeCommands.${name});\n  }${methodSuffix}`);
  },
  ""
);

const generatedClass = `${prefix}${methodDefinitions}${suffix}`;

writeFile(resolve(__dirname, "./index.ts"), generatedClass, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});
