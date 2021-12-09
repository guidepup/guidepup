import type { VoiceOver } from "@jxa/types";
import { run } from "@jxa/run";
import { Directions } from "./Directions";
import { Containments } from "./Containments";
import { Places } from "./Places";
import { Applications } from "../Applications";
import { activate } from "../activate";
import "@jxa/global-type";

export async function move(
  direction: Directions | Containments,
  place?: Places
): Promise<void> {
  await activate(Applications.VOICE_OVER);

  const script = `tell application "VoiceOver"\ntell vo cursor to move ${direction}${
    place ? ` to ${place}` : ""
  }\nend tell`;

  return await run<void, string>((appleScript) => {
    const app = Application.currentApplication();
    app.includeStandardAdditions = true;
    app.runScript(appleScript);
  }, script);
}
