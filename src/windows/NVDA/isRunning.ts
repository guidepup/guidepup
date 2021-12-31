import { exec } from "child_process";

export async function isRunning(): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    exec("nvda --check-running", (err) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}
