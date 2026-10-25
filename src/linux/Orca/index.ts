import { Orca } from "./Orca";

/**
 * This object can be used to launch and control Orca.
 *
 * Here's a typical example:
 *
 * ```ts
 * import { orca } from "@guidepup/guidepup";
 *
 * (async () => {
 *   // Start Orca.
 *   await orca.start();
 *
 *   // Move to the next item.
 *   await orca.next();
 *
 *   // Stop Orca.
 *   await orca.stop();
 * })();
 * ```
 */
export const orca = new Orca();

/**
 * This object can be used to launch and control Orca.
 *
 * Here's a typical example:
 *
 * ```ts
 * import { orca } from "@guidepup/guidepup";
 *
 * (async () => {
 *   // Start Orca.
 *   await orca.start();
 *
 *   // Move to the next item.
 *   await orca.next();
 *
 *   // Stop Orca.
 *   await orca.stop();
 * })();
 * ```
 */
type _Orca = typeof orca;

export { _Orca as Orca };
export { keyCodeCommands as orcaKeyCodeCommands } from "./keyCodeCommands";
export type { KeyCodeCommand as OrcaKeyCodeCommand } from "./keyCodeCommands";
