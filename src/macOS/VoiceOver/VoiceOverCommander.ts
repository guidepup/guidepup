import { CommanderCommands } from "./CommanderCommands";
import { CommandOptions } from "../../CommandOptions";
import { LogStore } from "../../LogStore";
import { performCommand } from "./performCommand";

export class VoiceOverCommander {
  /**
   * @ignore
   */
  #logStore: LogStore;

  constructor(logStore: LogStore) {
    this.#logStore = logStore;
  }

  /**
   * VoiceOver commander commands.
   */
  get commands(): typeof CommanderCommands {
    return CommanderCommands;
  }

  /**
   * Perform a VoiceOver commander command.
   *
   * @param {string} command The English name of the VoiceOver commander command to perform.
   * @param {object} [options] Additional options.
   */
  async perform(
    command: CommanderCommands,
    options?: CommandOptions
  ): Promise<void> {
    return await this.#logStore.tap(performCommand(command, options));
  }
}
