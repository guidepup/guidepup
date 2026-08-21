import { base } from "../../debug";
import { execFile } from "child_process";
import { promisify } from "util";
import { sessionBus } from "dbus-native";

const debug = base.extend("isRunning");

const SERVICE = "org.gnome.Orca.Service";
const OBJECT_PATH = "/org/gnome/Orca/Service/SystemInformationPresenter";
const INTERFACE = "org.gnome.Orca.Module";

const execFileAsync = promisify(execFile);

export async function isRunning(): Promise<boolean> {
  try {
    const { stdout } = await execFileAsync("pgrep", ["-x", "orca"]);

    debug("`pgrep -x orca`: ", stdout);

    if (!stdout.trim()) {
      return false;
    }

    // const { stdout: apps } = await execFileAsync("orca", ["--list-apps"]);

    // debug("`orca --list-apps`: ", apps);

    // if (!apps.includes("orca")) {
    //   return false;
    // }

    const bus = sessionBus();
    await bus.getInterface(SERVICE, OBJECT_PATH, INTERFACE);
    debug(`D-Bus service "${SERVICE}" is available`);
    await bus.close();

    return true;
  } catch (cause) {
    debug("checks failed: ", cause);

    return false;
  }
}
