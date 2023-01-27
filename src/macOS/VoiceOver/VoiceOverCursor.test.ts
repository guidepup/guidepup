import { Applications } from "../Applications";
import { Directions } from "./Directions";
import { keyCodeCommands } from "./keyCodeCommands";
import { LogStore } from "./LogStore";
import { mockType } from "../../../test/mockType";
import { move } from "./move";
import { performAction } from "./performAction";
import { sendKeys } from "../sendKeys";
import { takeScreenshot } from "./takeScreenshot";
import { VoiceOverCursor } from "./VoiceOverCursor";

jest.mock("./LogStore", () => ({
  LogStore: jest.fn(),
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

const logStoreStub = { tap: jest.fn() } as unknown as LogStore;

const screenshotPathDummy = "test-screenshot-path";

describe("VoiceOverCursor", () => {
  let cursor: VoiceOverCursor;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();

    mockType(takeScreenshot).mockResolvedValue(screenshotPathDummy);
    mockType(logStoreStub.tap).mockImplementation(
      async (action) => await action()
    );

    cursor = new VoiceOverCursor(logStoreStub);
  });

  describe("previous", () => {
    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await cursor.previous(options);
      });

      it("should move left", () => {
        expect(move).toHaveBeenCalledWith(Directions.Left, undefined, options);
      });

      it("should tap the move", () => {
        expect(logStoreStub.tap).toHaveBeenCalled();
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

      it("should tap the move", () => {
        expect(logStoreStub.tap).toHaveBeenCalled();
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

      it("should tap the action", () => {
        expect(logStoreStub.tap).toHaveBeenCalled();
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
          options
        );
      });

      it("should tap the sendKeys", () => {
        expect(logStoreStub.tap).toHaveBeenCalled();
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
          options
        );
      });

      it("should tap the sendKeys", () => {
        expect(logStoreStub.tap).toHaveBeenCalled();
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
