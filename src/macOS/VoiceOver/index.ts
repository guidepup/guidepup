import { VoiceOver } from "./VoiceOver";

/**
 * [API Reference](https://www.guidepup.dev/docs/api/class-voiceover)
 *
 * This object can be used to launch and control VoiceOver.
 *
 * Here's a typical example:
 *
 * ```ts
 * import { voiceOver } from "@guidepup/guidepup";
 *
 * (async () => {
 *   // Start VoiceOver.
 *   await voiceOver.start();
 *
 *   // Move to the next item.
 *   await voiceOver.next();
 *
 *   // ... perform some commands.
 *
 *   // Stop VoiceOver.
 *   await voiceOver.stop();
 * })();
 * ```
 */
export const voiceOver = new VoiceOver();

/**
 * [API Reference](https://www.guidepup.dev/docs/api/class-voiceover)
 *
 * This object can be used to launch and control VoiceOver.
 *
 * Here's a typical example:
 *
 * ```ts
 * import { voiceOver } from "@guidepup/guidepup";
 *
 * (async () => {
 *   // Start VoiceOver.
 *   await voiceOver.start();
 *
 *   // Move to the next item.
 *   await voiceOver.next();
 *
 *   // ... perform some commands.
 *
 *   // Stop VoiceOver.
 *   await voiceOver.stop();
 * })();
 * ```
 */
type _VoiceOver = typeof voiceOver;

export { _VoiceOver as VoiceOver };

export { CommanderCommands as VoiceOverCommanderCommands } from "./CommanderCommands";
export { keyCodeCommands as voiceOverKeyCodeCommands } from "./keyCodeCommands";
