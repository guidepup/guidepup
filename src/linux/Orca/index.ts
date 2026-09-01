import { Orca } from "./Orca";

/**
 * This object can be used to launch and control Orca.
 *
 * Here's a typical example:
 *
 * ```ts
 * import { unstable_orca } from "@guidepup/guidepup";
 *
 * (async () => {
 *   // Start Orca.
 *   await unstable_orca.start();
 *
 *   // Move to the next item.
 *   await unstable_orca.next();
 *
 *   // Stop Orca.
 *   await unstable_orca.stop();
 * })();
 * ```
 */
export const unstable_orca = new Orca();

/**
 * This object can be used to launch and control Orca.
 *
 * Here's a typical example:
 *
 * ```ts
 * import { unstable_orca } from "@guidepup/guidepup";
 *
 * (async () => {
 *   // Start Orca.
 *   await unstable_orca.start();
 *
 *   // Move to the next item.
 *   await unstable_orca.next();
 *
 *   // Stop Orca.
 *   await unstable_orca.stop();
 * })();
 * ```
 */
type _Orca = typeof unstable_orca;

export { _Orca as Orca };
export { keyCodeCommands as orcaKeyCodeCommands } from "./keyCodeCommands";
export type { KeyCodeCommand as OrcaKeyCodeCommand } from "./keyCodeCommands";
