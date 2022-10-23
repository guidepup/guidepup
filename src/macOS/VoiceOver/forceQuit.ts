import { exec } from "child_process";

export async function forceQuit(): Promise<void> {
  return new Promise<void>((resolve) => {
    exec(`kill -15 $(ps aux | egrep "[V]oiceOver" | awk '{print $2}')`, () => {
      resolve();
    });
  });
}
