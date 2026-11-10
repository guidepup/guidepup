import { base } from "../../debug";
import { spawn } from "node:child_process";

const debug = base.extend("startUserOrca");

/**
 * Start the user's own Orca again, independent of this process so that it
 * keeps running after this process exits.
 *
 * Without `--replace`, so that it never takes over from another Orca that
 * started in the meantime.
 */
export function startUserOrca(): void {
  const userOrca = spawn("orca", [], { detached: true, stdio: "ignore" });

  userOrca.once("error", (error) => {
    debug(`Cannot start the user's Orca again: ${error}`);
  });

  userOrca.unref();
}
