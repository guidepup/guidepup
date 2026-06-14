import { click } from "./click";
import { VoiceOverClient } from "./VoiceOverClient";
import { VoiceOverMouse } from "./VoiceOverMouse";

jest.mock("./click", () => ({
  click: jest.fn(),
}));
jest.mock("./VoiceOverClient", () => ({
  VoiceOverClient: jest.fn(),
}));

const voiceOverClientStub = {
  enqueueAndTap: jest.fn(),
} as unknown as VoiceOverClient;

describe("VoiceOverMouse", () => {
  let mouse: VoiceOverMouse;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();

    jest
      .mocked(voiceOverClientStub.enqueueAndTap)
      .mockImplementation(async (action) => await action());

    mouse = new VoiceOverMouse(voiceOverClientStub);
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

      it("should enqueueAndTap the click", () => {
        expect(voiceOverClientStub.enqueueAndTap).toHaveBeenCalledWith(
          expect.any(Function),
          options,
        );
      });
    });
  });
});
