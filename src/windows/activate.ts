import { runVbsCode } from "./runVbsCode";

export async function activate(application): Promise<void> {
  const script = `set WshShell = CreateObject("WScript.Shell")\nWshShell.Run """${application}"" -p1 -c"\nset WshShell = Nothing`;

  try {
    await runVbsCode(script);
  } catch (e) {
    throw new Error(`Unable to activate application\n${e.message}`);
  }
}
