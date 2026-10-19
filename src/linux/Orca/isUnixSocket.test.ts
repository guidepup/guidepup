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

  describe("when the path exists", () => {
    const stubIsSocket = Symbol("test-is-socket");

    beforeEach(() => {
      jest.mocked(statSync).mockReturnValue({
        isSocket: () => stubIsSocket,
      } as unknown as ReturnType<typeof statSync>);
    });

    it("should return whether the path is a socket", () => {
      expect(isUnixSocket(mockPath)).toBe(stubIsSocket);
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
