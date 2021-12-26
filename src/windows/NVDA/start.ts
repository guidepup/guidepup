import { runVbsCode } from "../runVbsCode";

const script = `
set WshShell = CreateObject("WScript.Shell")
WshShell.SendKeys "^%n"
`;

export async function start(): Promise<string> {
  return await runVbsCode(script);
}
