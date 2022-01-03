import { run } from "@jxa/run";
import { Applications } from "./Applications";
import { ERR_PREFIX_QUIT } from "./errors";
import "@jxa/global-type";

export async function quit(applicationName: Applications): Promise<void> {
  try {
    return await run<void, Applications>(
      (name) => Application(name).quit(),
      applicationName
    );
  } catch (e) {
    throw new Error(`${ERR_PREFIX_QUIT}${applicationName}\n${e.message}`);
  }
}
