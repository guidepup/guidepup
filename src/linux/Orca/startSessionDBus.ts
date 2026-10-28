import { type ChildProcess, spawn } from "node:child_process";
import {
  ERR_ORCA_DBUS_CONNECTION_TIMEOUT,
  ERR_ORCA_DBUS_START_FAILURE,
} from "../errors";
import { type MessageBus, sessionBus } from "dbus-native";
import { base } from "../../debug";
import { logProcessOutput } from "./logProcessOutput";
import { terminateProcess } from "./terminateProcess";
import { waitForCondition } from "../../waitForCondition";

const debug = base.extend("startSessionDBus");

export interface SessionDBus {
  address: string;
  bus: MessageBus;
  process: ChildProcess | null;
}

/**
 * Use the session D-Bus at DBUS_SESSION_BUS_ADDRESS, or start a D-Bus daemon,
 * then connect and wait until the bus responds. If it never does, the
 * connection and any daemon started here are closed before the error is
 * thrown.
 *
 * @param {string} display The X display for a D-Bus daemon started here.
 */
export async function startSessionDBus(display: string): Promise<SessionDBus> {
  debug("Ensuring session D-Bus running...");

  let address = process.env.DBUS_SESSION_BUS_ADDRESS;
  let daemon: ChildProcess | null = null;
  let bus: MessageBus | null = null;

  try {
    if (!address) {
      daemon = spawn(
        "dbus-daemon",
        ["--session", "--nofork", "--print-address"],
        {
          env: {
            ...process.env,
            DISPLAY: display,
          },
        },
      );

      logProcessOutput(daemon, "dbus");

      address = await new Promise<string>((resolve) => {
        daemon.stdout.once("data", (data: Buffer) => {
          resolve(data.toString().trim());
        });

        daemon.once("error", () => resolve(""));
        daemon.once("exit", () => resolve(""));
      });

      if (!address) {
        throw new Error(ERR_ORCA_DBUS_START_FAILURE);
      }
    }

    debug(`DBUS_SESSION_BUS_ADDRESS=${address}`);

    bus = sessionBus({ busAddress: address });

    await waitForCondition(
      async () => {
        debug("Polling for D-Bus connectivity");

        await bus.listNames();

        return true;
      },
      { timeoutErrorMessage: ERR_ORCA_DBUS_CONNECTION_TIMEOUT },
    );
  } catch (error) {
    await terminateProcess(daemon, "session D-Bus");
    await bus?.close();

    throw error;
  }

  return { address, bus, process: daemon };
}
