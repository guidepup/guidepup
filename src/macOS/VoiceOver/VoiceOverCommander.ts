import { CommanderCommands } from "./CommanderCommands";
import { CommandOptions } from "../../CommandOptions";
import { performCommand } from "./performCommand";
import { Prettify } from "../../typeHelpers";
import { VoiceOverClient } from "./VoiceOverClient";

export class VoiceOverCommander {
  /**
   * @ignore
   */
  #voiceOverClient: VoiceOverClient;

  constructor(voiceOverClient: VoiceOverClient) {
    this.#voiceOverClient = voiceOverClient;
  }

  /**
   * VoiceOver commander commands.
   */
  get commands(): Prettify<typeof CommanderCommands> {
    return CommanderCommands;
  }

  /**
   * Perform a VoiceOver commander command.
   *
   * @param {string} command The lowercase english command for the VoiceOver commander to perform.
   * @param {object} [options] Additional options.
   */
  async perform(
    command: CommanderCommands,
    options?: CommandOptions,
  ): Promise<void> {
    return await this.#voiceOverClient.enqueueAndTap(
      () => performCommand(command, options),
      options,
    );
  }
}
