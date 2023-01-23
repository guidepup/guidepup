import { CommanderCommands } from "./CommanderCommands";
import { LogStore } from "./LogStore";
import { performCommand } from "./performCommand";
import { VoiceOverCommander } from "./VoiceOverCommander";

jest.mock("./LogStore", () => ({
  LogStore: jest.fn(),
}));
jest.mock("./performCommand", () => ({
  performCommand: jest.fn(),
}));

const logStoreStub = { tap: jest.fn() } as unknown as LogStore;

describe("VoiceOverCommander", () => {
  let commander: VoiceOverCommander;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();

    commander = new VoiceOverCommander(logStoreStub);
  });

  describe("commands", () => {
    it("should provide a getter for the CommanderCommands", () => {
      expect(commander.commands).toBe(CommanderCommands);
    });
  });

  describe("perform", () => {
    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await commander.perform(CommanderCommands.ACTIONS, options);
      });

      it("should perform the provided command", () => {
        expect(performCommand).toHaveBeenCalledWith(
          CommanderCommands.ACTIONS,
          options
        );
      });

      it("should tap the performCommand", () => {
        expect(logStoreStub.tap).toHaveBeenCalled();
      });
    });
  });
});
