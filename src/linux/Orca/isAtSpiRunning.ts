import { execFileSync } from "node:child_process";

export function isAtSpiRunning(): boolean {
  try {
    execFileSync("pgrep", ["-f", "(^|/)at-spi-bus-launcher(\\s|$)"]);

    return true;
  } catch {
    return false;
  }
}
