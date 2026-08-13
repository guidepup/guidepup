import { spawnSync } from "child_process";

export function quit(): void {
  try {
    spawnSync("orca", ["--quit"], {
      shell: true,
      stdio: "ignore",
    });
  } catch (e) {
    throw new Error(`TODO: stop failed error`, { cause: e });
  }
}
