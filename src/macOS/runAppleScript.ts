import { run } from "@jxa/run";
import "@jxa/global-type";

export async function runAppleScript(script: string): Promise<void> {
  return await run<void, string>((appleScript) => {
    const app = Application.currentApplication();
    app.includeStandardAdditions = true;
    app.runScript(appleScript);
  }, script);
}
