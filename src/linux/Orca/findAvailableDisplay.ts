import { ERR_ORCA_X_SERVER_DISPLAYS_NOT_AVAILABLE } from "../errors";
import { execFileSync } from "node:child_process";

export function findAvailableDisplay(): string {
  for (let display = 99; display < 200; display++) {
    try {
      execFileSync("xdpyinfo", ["-display", `:${display}`]);
    } catch {
      return `:${display}`;
    }
  }

  throw new Error(ERR_ORCA_X_SERVER_DISPLAYS_NOT_AVAILABLE);
}
