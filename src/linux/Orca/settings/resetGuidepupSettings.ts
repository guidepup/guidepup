import { ERR_ORCA_FAILED_TO_LOAD_GUIDEPUP_SETTINGS } from "../../errors";
import { execFileSync } from "node:child_process";

export const resetGuidepupSettings = () => {
  try {
    execFileSync("dconf", ["reset", "-f", "/org/gnome/orca/guidepup/"]);
  } catch (cause) {
    throw new Error(ERR_ORCA_FAILED_TO_LOAD_GUIDEPUP_SETTINGS, { cause });
  }
};
