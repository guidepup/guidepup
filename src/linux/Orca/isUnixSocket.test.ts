import { isUnixSocket } from "./isUnixSocket";
import { statSync } from "fs";

jest.mock("fs", () => ({
  statSync: jest.fn(),
}));

const mockPath = "test-path";

describe("isUnixSocket", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe.each`
    isSocket | expected
    ${true}  | ${true}
    ${false} | ${false}
  `("when the path isSocket() is $isSocket", ({ isSocket, expected }) => {
    beforeEach(() => {
      jest.mocked(statSync).mockReturnValue({
        isSocket: () => isSocket,
      } as ReturnType<typeof statSync>);
    });

    it(`should return ${expected}`, () => {
      expect(isUnixSocket(mockPath)).toBe(expected);
    });

    it("should stat the path", () => {
      isUnixSocket(mockPath);

      expect(statSync).toHaveBeenCalledWith(mockPath);
    });
  });

  describe("when the path does not exist", () => {
    beforeEach(() => {
      jest.mocked(statSync).mockImplementation(() => {
        throw new Error("test-error");
      });
    });

    it("should return false", () => {
      expect(isUnixSocket(mockPath)).toBe(false);
    });
  });
});
