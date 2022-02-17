import { DEFAULT_NVDA_PATH } from "./constants";
import { ERR_NVDA_CANNOT_BE_STARTED } from "../errors";
import { spawnSync } from "child_process";
import { waitForRunning } from "./waitForRunning";

export async function start(): Promise<void> {
  try {
    const a = spawnSync(`"${DEFAULT_NVDA_PATH}" --minimal`, { shell: true, stdio: "ignore", encoding: "utf-8" });
    console.log(a);
  } catch (e) {
    new Error(`${ERR_NVDA_CANNOT_BE_STARTED}\n${e.message}`)
  }

  console.log("started");

  return await waitForRunning();
}