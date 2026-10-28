import { type ChildProcess, spawn } from "node:child_process";
import {
  ERR_ORCA_AT_SPI_LAUNCHER_MISSING,
  ERR_ORCA_AT_SPI_SERVICE_TIMEOUT,
} from "../errors";
import { AT_SPI_DBUS_A11Y_WELL_KNOWN_SERVICE_NAME } from "./constants";
import { base } from "../../debug";
import { existsSync } from "node:fs";
import { isAtSpiRunning } from "./isAtSpiRunning";
import { logProcessOutput } from "./logProcessOutput";
import type { SessionDBus } from "./startSessionDBus";
import { terminateAtSpi } from "./terminateAtSpi";
import { waitForCondition } from "../../waitForCondition";

const debug = base.extend("startAtSpi");

/**
 * Start the AT-SPI bus launcher, unless AT-SPI is already running, and wait
 * for the accessibility bus to appear on the session D-Bus. If it never does,
 * the launcher started here is stopped before the error is thrown.
 *
 * @param {string} display The X display for the launcher.
 * @param {SessionDBus} sessionDBus The session D-Bus for the launcher.
 * @returns {Promise<ChildProcess | null>} The launcher, if started here.
 */
export async function startAtSpi(
  display: string,
  sessionDBus: SessionDBus,
): Promise<ChildProcess | null> {
  debug("Ensuring AT-SPI D-Bus running...");

  let launcher: ChildProcess | null = null;

  if (!isAtSpiRunning()) {
    debug("Starting AT-SPI D-Bus...");

    const atSpiLauncher = [
      "/usr/libexec/at-spi-bus-launcher",
      "/usr/lib/at-spi2-core/at-spi-bus-launcher",
    ].find((command) => existsSync(command));

    if (!atSpiLauncher) {
      throw new Error(ERR_ORCA_AT_SPI_LAUNCHER_MISSING);
    }

    // In its own process group, so that terminateAtSpi() also reaches the
    // a11y bus and at-spi2-registryd that the launcher starts.
    launcher = spawn(atSpiLauncher, ["--launch-immediately"], {
      detached: true,
      env: {
        ...process.env,
        DBUS_SESSION_BUS_ADDRESS: sessionDBus.address,
        DISPLAY: display,
      },
    });

    logProcessOutput(launcher, "at-spi");
  }

  try {
    await waitForCondition(
      async () => {
        debug(
          `Polling for '${AT_SPI_DBUS_A11Y_WELL_KNOWN_SERVICE_NAME}' name ownership`,
        );

        return await sessionDBus.bus.nameHasOwner(
          AT_SPI_DBUS_A11Y_WELL_KNOWN_SERVICE_NAME,
        );
      },
      { timeoutErrorMessage: ERR_ORCA_AT_SPI_SERVICE_TIMEOUT },
    );
  } catch (error) {
    await terminateAtSpi(launcher);

    throw error;
  }

  return launcher;
}
