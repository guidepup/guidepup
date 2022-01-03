import { run } from "@jxa/run";
import { Applications } from "./Applications";
import { ERR_PREFIX_ACTIVATE } from "./errors";
import "@jxa/global-type";

export async function activate(
  applicationName: Applications | string
): Promise<void> {
  try {
    return await run<void, Applications | string>(
      (name) => Application(name).activate(),
      applicationName
    );
  } catch (e) {
    throw new Error(`${ERR_PREFIX_ACTIVATE}${applicationName}\n${e.message}`);
  }
}
