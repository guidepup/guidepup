import { run } from "@jxa/run";
import { Applications } from "./Applications";
import "@jxa/global-type";

export async function quit(applicationName: Applications): Promise<void> {
  return await run<void, Applications>((name) => {
    const app = Application(name);
    app.includeStandardAdditions = true;

    return app.quit();
  }, applicationName);
}
