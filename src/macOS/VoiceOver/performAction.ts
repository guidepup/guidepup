import { runAppleScript } from "../runAppleScript";
import { Applications } from "../Applications";

export async function performAction(): Promise<void> {
  const script = `tell application "${Applications.VOICE_OVER}"\ntell vo cursor to perform action\nend tell`;

  return await runAppleScript(script);
}
