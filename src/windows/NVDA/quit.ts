import { exec } from "child_process";
import { ERR_NVDA_QUIT } from "../errors";

export async function quit(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    exec("nvda --quit", (e) => {
      if (e) {
        reject(new Error(`${ERR_NVDA_QUIT}\n${e.message}`));
      } else {
        resolve();
      }
    });
  });
}
