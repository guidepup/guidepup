import { ERR_ORCA_FAILED_TO_GET_SETTING } from "../../errors";
import { execFileSync } from "node:child_process";

export const getSetting = (key: string) => {
  try {
    execFileSync("dconf", ["read", `/org/gnome/orca/guidepup/${key}`]);
  } catch (cause) {
    throw new Error(ERR_ORCA_FAILED_TO_GET_SETTING, { cause });
  }
};
