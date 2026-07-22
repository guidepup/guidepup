import {
  ERR_VOICE_OVER_FAILED_TO_SET_SETTING,
  ERR_VOICE_OVER_UNSUPPORTED_SETTING,
} from "../../errors";
import { execFileSync } from "node:child_process";
import { VOICEOVER_DOMAIN } from "./constants";

function getWriteArguments(key: string, value: unknown): string[] {
  if (typeof value === "string") {
    return ["write", VOICEOVER_DOMAIN, key, "-string", value];
  }

  if (typeof value === "boolean") {
    return ["write", VOICEOVER_DOMAIN, key, "-bool", value ? "YES" : "NO"];
  }

  if (typeof value === "number") {
    return [
      "write",
      VOICEOVER_DOMAIN,
      key,
      Number.isInteger(value) ? "-int" : "-float",
      value.toString(),
    ];
  }

  throw new TypeError(`${ERR_VOICE_OVER_UNSUPPORTED_SETTING}${typeof value}`);
}

export function setPreference(key: string, value: unknown): void {
  try {
    execFileSync("defaults", getWriteArguments(key, value));
  } catch (cause) {
    throw new Error(ERR_VOICE_OVER_FAILED_TO_SET_SETTING, { cause });
  }
}
