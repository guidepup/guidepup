import { ERR_ORCA_QUIT } from "../errors";
import { spawnSync } from "child_process";

export function quit(): void {
  try {
    spawnSync("killall", ["orca"], {
      shell: true,
      stdio: "ignore",
    });
  } catch (e) {
    throw new Error(ERR_ORCA_QUIT, { cause: e });
  }
}
