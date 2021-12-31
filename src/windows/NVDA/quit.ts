import { exec } from "child_process";

export async function quit(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    exec("nvda --quit", (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
