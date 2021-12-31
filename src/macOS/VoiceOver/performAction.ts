import { run } from "@jxa/run";
import { Applications } from "../Applications";
import { activate } from "../activate";
import "@jxa/global-type";

export async function performAction(): Promise<void> {
  await activate(Applications.VOICE_OVER);

  const script = `tell application "${Applications.VOICE_OVER}"\ntell vo cursor to perform action\nend tell`;

  return await run<void, string>((appleScript) => {
    const app = Application.currentApplication();
    app.includeStandardAdditions = true;
    app.runScript(appleScript);
  }, script);
}
