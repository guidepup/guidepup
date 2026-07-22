import { execFileSync } from "child_process";
import { keyCodeCommands } from "./keyCodeCommands";
import { MacOSApplications } from "..";
import { quit } from "../quit";
import { sendKeys } from "../sendKeys";
import { terminateVoiceOverProcess } from "./terminateVoiceOverProcess";

jest.mock("child_process", () => ({
  execFileSync: jest.fn(),
}));

jest.mock("../quit", () => ({
  quit: jest.fn(),
}));

jest.mock("../sendKeys", () => ({
  sendKeys: jest.fn(),
}));

const optionsDummy = {};

describe("terminateVoiceOverProcess", () => {
  beforeEach(async () => {
    await terminateVoiceOverProcess(optionsDummy);
  });

  it("should attempt to a quit key code command", () => {
    expect(sendKeys).toHaveBeenCalledWith(
      keyCodeCommands.quit,
      undefined,
      optionsDummy,
    );
  });

  it("should attempt an AppleScript based quit of the VoiceOver application", () => {
    expect(quit).toHaveBeenCalledWith(
      MacOSApplications.VoiceOver,
      optionsDummy,
    );
  });

  it("should attempt to terminate (kill -15) the VoiceOver process (SIGTERM over SIGKILL owing to the process being run by launchd)", () => {
    expect(execFileSync).toHaveBeenCalledWith(
      "pkill",
      ["-15", "-f", "VoiceOver.app/Contents/MacOS/VoiceOver launchd -s"],
      {
        stdio: "ignore",
        timeout: 2000,
      },
    );
  });
});
