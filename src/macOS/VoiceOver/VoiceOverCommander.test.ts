import { CommanderCommands } from "./CommanderCommands";
import { performCommand } from "./performCommand";
import { VoiceOverClient } from "./VoiceOverClient";
import { VoiceOverCommander } from "./VoiceOverCommander";

jest.mock("./VoiceOverClient", () => ({
  VoiceOverClient: jest.fn(),
}));
jest.mock("./performCommand", () => ({
  performCommand: jest.fn(),
}));

const voiceOverClientStub = {
  enqueueAndTap: jest.fn(),
} as unknown as VoiceOverClient;

describe("VoiceOverCommander", () => {
  let commander: VoiceOverCommander;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();

    jest
      .mocked(voiceOverClientStub.enqueueAndTap)
      .mockImplementation(async (action) => await action());

    commander = new VoiceOverCommander(voiceOverClientStub);
  });

  describe("commands", () => {
    it("should provide a getter for the CommanderCommands", () => {
      expect(commander.commands).toBe(CommanderCommands);
    });
  });

  describe("perform", () => {
    describe.each`
      description                  | options
      ${"without options"}         | ${undefined}
      ${"with options"}            | ${{}}
      ${"with options to capture"} | ${{ capture: true }}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await commander.perform(CommanderCommands.ACTIONS, options);
      });

      it("should perform the provided command", () => {
        expect(performCommand).toHaveBeenCalledWith(
          CommanderCommands.ACTIONS,
          options,
        );
      });

      it("should enqueueAndTap the performCommand", () => {
        expect(voiceOverClientStub.enqueueAndTap).toHaveBeenCalledWith(
          expect.any(Function),
          options,
        );
      });
    });
  });
});
