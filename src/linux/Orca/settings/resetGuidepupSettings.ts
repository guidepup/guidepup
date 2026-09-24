import { ERR_ORCA_FAILED_TO_LOAD_GUIDEPUP_SETTINGS } from "../../errors";
import { execFileSync } from "node:child_process";
import { ORCA_GUIDEPUP_DCONF_PATH_PREFIX } from "./constants";

export const resetGuidepupSettings = () => {
  try {
    execFileSync("dconf", ["reset", "-f", ORCA_GUIDEPUP_DCONF_PATH_PREFIX]);
  } catch (cause) {
    throw new Error(ERR_ORCA_FAILED_TO_LOAD_GUIDEPUP_SETTINGS, { cause });
  }
};
