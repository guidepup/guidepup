import { EventEmitter } from "node:events";
import { spawn } from "node:child_process";
import { startUserOrca } from "./startUserOrca";

jest.mock("node:child_process", () => ({
  spawn: jest.fn(),
}));

describe("startUserOrca", () => {
  let userOrca: EventEmitter & { unref: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();

    userOrca = Object.assign(new EventEmitter(), { unref: jest.fn() });

    jest
      .mocked(spawn)
      .mockReturnValue(userOrca as unknown as ReturnType<typeof spawn>);

    startUserOrca();
  });

  it("should start Orca from the PATH, without replacing any other Orca", () => {
    expect(spawn).toHaveBeenCalledWith("orca", [], expect.anything());
  });

  it("should leave it running independently of this process", () => {
    expect(spawn).toHaveBeenCalledWith("orca", [], {
      detached: true,
      stdio: "ignore",
    });
    expect(userOrca.unref).toHaveBeenCalled();
  });

  it("should not crash the process if Orca cannot be spawned", () => {
    expect(() =>
      userOrca.emit("error", new Error("test-enoent")),
    ).not.toThrow();
  });
});
