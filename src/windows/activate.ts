import { runVbsScript } from "./runVbsScript";

export async function activate(application: string): Promise<void> {
  const script = `set WshShell = CreateObject("WScript.Shell")\nWshShell.Run """${application}"" -p1 -c"\nset WshShell = Nothing`;

  try {
    await runVbsScript(script);
  } catch (e) {
    throw new Error(`Unable to activate application\n${e.message}`);
  }
}
