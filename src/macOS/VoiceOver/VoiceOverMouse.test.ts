import { click } from "./click";
import { LogStore } from "./LogStore";
import { VoiceOverMouse } from "./VoiceOverMouse";

jest.mock("./click", () => ({
  click: jest.fn(),
}));
jest.mock("./LogStore", () => ({
  LogStore: jest.fn(),
}));

const logStoreStub = { tap: jest.fn() } as unknown as LogStore;

describe("VoiceOverMouse", () => {
  let mouse: VoiceOverMouse;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();

    mouse = new VoiceOverMouse(logStoreStub);
  });

  describe("click", () => {
    describe.each`
      description          | options
      ${"without options"} | ${undefined}
      ${"with options"}    | ${{}}
    `("when called $description", ({ options }) => {
      beforeEach(async () => {
        await mouse.click(options);
      });

      it("should click", () => {
        expect(click).toHaveBeenCalledWith(options);
      });

      it("should tap the click", () => {
        expect(logStoreStub.tap).toHaveBeenCalled();
      });
    });
  });
});
