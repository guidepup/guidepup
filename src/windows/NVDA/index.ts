import { NVDA } from "./NVDA";

export const nvda = new NVDA();

type _NVDA = typeof nvda;

export { _NVDA as NVDA };
export { keyCodeCommands as NVDAKeyCodeCommands } from "./keyCodeCommands";
