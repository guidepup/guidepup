import { enabledDbFile } from "./enabledDbFile";
import { enabledDefaults } from "./enabledDefaults";

export async function supportsAppleScriptControl(): Promise<boolean> {
  const results = await Promise.all([enabledDefaults(), enabledDbFile()]);

  return results.every((value) => value);
}
