import { connect, Socket } from "net";
import { NVDA_HOST, NVDA_PORT } from "./constants";
import { isRunning } from "./isRunning";
import { mockType } from "../../../test/mockType";

jest.mock("net", () => ({
  connect: jest.fn(),
}));

const clientStub = {
  end: jest.fn(),
  on: jest.fn(),
};

describe("isRunning", () => {
  let resultPromise;

  beforeEach(() => {
    jest.clearAllMocks();

    mockType(connect).mockReturnValue(clientStub as unknown as Socket);

    resultPromise = isRunning();
  });

  afterEach(async () => {
    try {
      clientStub.on.mock.calls[0][1]();
    } catch {
      // swallow
    }

    await resultPromise;
  });

  it("should attempt to connect to NVDA", () => {
    expect(mockType(connect)).toHaveBeenCalledWith(NVDA_PORT, NVDA_HOST);
  });

  describe("when creating a connection to NVDA is successful", () => {
    beforeEach(() => {
      clientStub.on.mock.calls.find(([key]) => key === "connect")[1]();
    });

    it("should end the connection", () => {
      expect(clientStub.end).toHaveBeenCalled();
    });

    it("should resolve to true", async () => {
      await expect(resultPromise).resolves.toBe(true);
    });
  });

  describe("when creating a connection to NVDA fails", () => {
    beforeEach(() => {
      clientStub.on.mock.calls.find(([key]) => key === "error")[1]();
    });

    it("should end the connection", () => {
      expect(clientStub.end).toHaveBeenCalled();
    });

    it("should resolve to false", async () => {
      await expect(resultPromise).resolves.toBe(false);
    });
  });
});
