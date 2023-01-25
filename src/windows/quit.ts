import { runVbsScript } from "./runVbsScript";

export async function quit(application: string): Promise<void> {
  const script = `set WshShell = CreateObject("WScript.Shell")\nWshShell.Run "taskkill /im ""${application}""",0,False\nset WshShell = Nothing`;

  try {
    await runVbsScript(script);
  } catch (e) {
    throw new Error(`Unable to quit application\n${e.message}`);
  }
}