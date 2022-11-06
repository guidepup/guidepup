import { ERR_NVDA_NOT_SUPPORTED } from "../errors";
import { isNVDAInstalled } from "./isNVDAInstalled";
import { isWindows } from "../isWindows";
import { quit } from "./quit";
import { start } from "./start";

/**
 * Class for controlling the NVDA ScreenReader on MacOS.
 */
export class NVDA {
  /**
   * Detect whether NVDA is supported for the current OS.
   *
   * @returns {Promise<boolean>}
   */
  async detect(): Promise<boolean> {
    return (await isWindows()) && (await isNVDAInstalled());
  }

  /**
   * Detect whether NVDA is the default screen reader for the current OS.
   *
   * @returns {Promise<boolean>}
   */
  async default(): Promise<boolean> {
    return await Promise.resolve(false);
  }

  /**
   * Turn NVDA on.
   */
  async start(): Promise<void> {
    if (!(await this.detect())) {
      throw new Error(ERR_NVDA_NOT_SUPPORTED);
    }

    await start();
  }

  /**
   * Turn NVDA off.
   */
  async stop(): Promise<void> {
    await quit();
  }
}
