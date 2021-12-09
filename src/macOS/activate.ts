import { run } from "@jxa/run";
import { Applications } from "./Applications";
import "@jxa/global-type";

export async function activate(
  applicationName: Applications | string
): Promise<void> {
  return await run<void, Applications | string>((name) => {
    const app = Application(name);

    return app.activate();
  }, applicationName);
}
