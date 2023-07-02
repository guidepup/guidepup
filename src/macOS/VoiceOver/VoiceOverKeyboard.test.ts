import { Applications } from "../Applications";
import { keyCodeCommands } from "./keyCodeCommands";
import { KeyCodes } from "../KeyCodes";
import { LogStore } from "./LogStore";
import { Modifiers } from "../Modifiers";
import { parseKey } from "../../parseKey";
import { sendKeys } from "../sendKeys";
import { VoiceOverKeyboard } from "./VoiceOverKeyboard";

jest.mock("./LogStore", () => ({
  LogStore: jest.fn(),
}));
jest.mock("../../parseKey", () => ({
  parseKey: jest.fn(),
}));
jest.mock("../sendKeys", () => ({
  sendKeys: jest.fn(),
}));

const logStoreStub = { tap: jest.fn() } as unknown as LogStore;

const applicationDummy = "test-application";
const parsedKeyDummy = { keyCode: 123456 };

describe("VoiceOverKeyboard", () => {
  let keyboard: VoiceOverKeyboard;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();

    jest.mocked(parseKey).mockReturnValue(parsedKeyDummy);
    jest
      .mocked(logStoreStub.tap)
      .mockImplementation(async (action) => await action());

    keyboard = new VoiceOverKeyboard(logStoreStub);
  });

  describe("press", () => {
    describe.each`
      description                         | options                              | expectedApplication
      ${"without options"}                | ${undefined}                         | ${undefined}
      ${"with options, no application"}   | ${{}}                                | ${undefined}
      ${"with options, with application"} | ${{ application: applicationDummy }} | ${applicationDummy}
    `("when called $description", ({ options, expectedApplication }) => {
      const keyDummy = "test-key";

      beforeEach(async () => {
        await keyboard.press(keyDummy, options);
      });

      it("should parse the key", () => {
        expect(parseKey).toHaveBeenCalledWith(keyDummy, Modifiers, KeyCodes);
      });

      it("should send the parsed keys", () => {
        expect(sendKeys).toHaveBeenCalledWith(
          parsedKeyDummy,
          expectedApplication,
          options
        );
      });

      it("should tap the sendKeys", () => {
        expect(logStoreStub.tap).toHaveBeenCalledWith(
          expect.any(Function),
          options
        );
      });
    });
  });

  describe("type", () => {
    describe.each`
      description                         | options                              | expectedApplication
      ${"without options"}                | ${undefined}                         | ${undefined}
      ${"with options, no application"}   | ${{}}                                | ${undefined}
      ${"with options, with application"} | ${{ application: applicationDummy }} | ${applicationDummy}
    `("when called $description", ({ options, expectedApplication }) => {
      const textDummy = "test-key";

      beforeEach(async () => {
        await keyboard.type(textDummy, options);
      });

      it("should send the parsed keys", () => {
        expect(sendKeys).toHaveBeenCalledWith(
          { characters: textDummy },
          expectedApplication,
          options
        );
      });

      it("should tap the sendKeys", () => {
        expect(logStoreStub.tap).toHaveBeenCalledWith(
          expect.any(Function),
          options
        );
      });
    });
  });

  describe("commands", () => {
    it("should return the key code commands", () => {
      expect(keyboard.commands).toBe(keyCodeCommands);
    });
  });

  describe("perform", () => {
    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await keyboard.perform(keyCodeCommands.interactWithItem, options);
      });

      it("should perform the provided command", () => {
        expect(sendKeys).toHaveBeenCalledWith(
          keyCodeCommands.interactWithItem,
          Applications.VoiceOver,
          options
        );
      });

      it("should tap the sendKeys", () => {
        expect(logStoreStub.tap).toHaveBeenCalledWith(
          expect.any(Function),
          options
        );
      });
    });
  });
});
