import { ERR_ORCA_FAILED_TO_GET_SETTING } from "../../errors";
import { execFileSync } from "node:child_process";
import { ORCA_GUIDEPUP_DCONF_PATH_PREFIX } from "./constants";

export const getSetting = (key: string) => {
  try {
    execFileSync("dconf", ["read", `${ORCA_GUIDEPUP_DCONF_PATH_PREFIX}${key}`]);
  } catch (cause) {
    throw new Error(ERR_ORCA_FAILED_TO_GET_SETTING, { cause });
  }
};
