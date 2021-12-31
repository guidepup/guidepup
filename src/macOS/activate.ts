import { run } from "@jxa/run";
import { Applications } from "./Applications";
import "@jxa/global-type";

const ERR_ACTIVATE = "Unable to activate application: ";

export async function activate(
  applicationName: Applications | string
): Promise<void> {
  try {
    return await run<void, Applications | string>((name) => {
      const app = Application(name);

      return app.activate();
    }, applicationName);
  } catch (_) {
    throw new Error(`${ERR_ACTIVATE}${applicationName}`);
  }
}
