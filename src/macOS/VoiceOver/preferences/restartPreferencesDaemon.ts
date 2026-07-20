import { execFileSync } from "node:child_process";

export function restartPreferencesDaemon(): void {
  try {
    execFileSync("/usr/bin/killall", ["cfprefsd"], { stdio: "ignore" });
  } catch {
    // Swallow as daemon wasn't running
  }
}
