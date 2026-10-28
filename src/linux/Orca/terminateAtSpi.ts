import type { ChildProcess } from "node:child_process";
import { terminateProcess } from "./terminateProcess";

/**
 * Stop the AT-SPI bus launcher. It runs in its own process group, so that the
 * accessibility bus and at-spi2-registryd that it starts, which outlive it,
 * are signalled too.
 */
export async function terminateAtSpi(
  launcher: ChildProcess | null,
): Promise<void> {
  if (launcher?.pid) {
    try {
      process.kill(-launcher.pid, "SIGTERM");
    } catch {
      // Already gone.
    }
  }

  await terminateProcess(launcher, "AT-SPI");
}
