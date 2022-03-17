import { DEFAULT_NVDA_PATH } from "./constants";
import { ERR_NVDA_QUIT } from "../errors";
import { spawnSync } from "child_process";

export function quit(): void {
  try {
    spawnSync(`"${DEFAULT_NVDA_PATH}"`, ["--quit"], {
      shell: true,
      stdio: "ignore",
    });
  } catch (e) {
    throw new Error(`${ERR_NVDA_QUIT}\n${e.message}`);
  }
}
