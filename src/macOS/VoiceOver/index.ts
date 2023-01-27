import { VoiceOver } from "./VoiceOver";

export const voiceOver = new VoiceOver();

type _VoiceOver = typeof voiceOver;

export { _VoiceOver as VoiceOver };

export { CommanderCommands as VoiceOverCommanderCommands } from "./CommanderCommands";
export { keyCodeCommands as voiceOverKeyCodeCommands } from "./keyCodeCommands";
