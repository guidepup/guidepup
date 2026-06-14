import { Applications } from "../Applications";
import { Directions } from "./Directions";
import { keyCodeCommands } from "./keyCodeCommands";
import { move } from "./move";
import { performAction } from "./performAction";
import { sendKeys } from "../sendKeys";
import { takeScreenshot } from "./takeScreenshot";
import { VoiceOverClient } from "./VoiceOverClient";
import { VoiceOverCursor } from "./VoiceOverCursor";

jest.mock("./VoiceOverClient", () => ({
  VoiceOverClient: jest.fn(),
}));
jest.mock("./move", () => ({
  move: jest.fn(),
}));
jest.mock("./performAction", () => ({
  performAction: jest.fn(),
}));
jest.mock("../sendKeys", () => ({
  sendKeys: jest.fn(),
}));
jest.mock("./takeScreenshot", () => ({
  takeScreenshot: jest.fn(),
}));

const voiceOverClientStub = {
  enqueueAndTap: jest.fn(),
} as unknown as VoiceOverClient;

const screenshotPathDummy = "test-screenshot-path";

describe("VoiceOverCursor", () => {
  let cursor: VoiceOverCursor;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();

    jest.mocked(takeScreenshot).mockResolvedValue(screenshotPathDummy);
    jest
      .mocked(voiceOverClientStub.enqueueAndTap)
      .mockImplementation(async (action) => await action());

    cursor = new VoiceOverCursor(voiceOverClientStub);
  });

  describe("previous", () => {
    describe.each`
      description                  | options
      ${"without options"}         | ${undefined}
      ${"with options"}            | ${{}}
      ${"with options to capture"} | ${{ capture: true }}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await cursor.previous(options);
      });

      it("should move left", () => {
        expect(move).toHaveBeenCalledWith(Directions.Left, undefined, options);
      });

      it("should enqueueAndTap the move", () => {
        expect(voiceOverClientStub.enqueueAndTap).toHaveBeenCalledWith(
          expect.any(Function),
          options,
        );
      });
    });
  });

  describe("next", () => {
    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await cursor.next(options);
      });

      it("should move right", () => {
        expect(move).toHaveBeenCalledWith(Directions.Right, undefined, options);
      });

      it("should enqueueAndTap the move", () => {
        expect(voiceOverClientStub.enqueueAndTap).toHaveBeenCalledWith(
          expect.any(Function),
          options,
        );
      });
    });
  });

  describe("act", () => {
    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await cursor.act(options);
      });

      it("should perform the default action", () => {
        expect(performAction).toHaveBeenCalledWith(options);
      });

      it("should enqueueAndTap the action", () => {
        expect(voiceOverClientStub.enqueueAndTap).toHaveBeenCalledWith(
          expect.any(Function),
          options,
        );
      });
    });
  });

  describe("interact", () => {
    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await cursor.interact(options);
      });

      it("should interact with the item", () => {
        expect(sendKeys).toHaveBeenCalledWith(
          keyCodeCommands.interactWithItem,
          Applications.VoiceOver,
          options,
        );
      });

      it("should enqueueAndTap the sendKeys", () => {
        expect(voiceOverClientStub.enqueueAndTap).toHaveBeenCalledWith(
          expect.any(Function),
          options,
        );
      });
    });
  });

  describe("stopInteracting", () => {
    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await cursor.stopInteracting(options);
      });

      it("should stop interacting with the item", () => {
        expect(sendKeys).toHaveBeenCalledWith(
          keyCodeCommands.stopInteractingWithItem,
          Applications.VoiceOver,
          options,
        );
      });

      it("should enqueueAndTap the sendKeys", () => {
        expect(voiceOverClientStub.enqueueAndTap).toHaveBeenCalledWith(
          expect.any(Function),
          options,
        );
      });
    });
  });

  describe("takeScreenshot", () => {
    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      let result: string;

      beforeEach(async () => {
        result = await cursor.takeScreenshot(options);
      });

      it("should take a screenshot", () => {
        expect(takeScreenshot).toHaveBeenCalledWith(options);
      });

      it("should return the file path to the screenshot", () => {
        expect(result).toEqual(screenshotPathDummy);
      });
    });
  });
});
