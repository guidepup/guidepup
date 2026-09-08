import { ERR_ORCA_FAILED_TO_SET_SETTING } from "../../errors";
import { execFileSync } from "node:child_process";

const toGVariant = (value: unknown): string => {
  if (typeof value === "boolean" || typeof value === "number") {
    return String(value);
  }

  if (typeof value === "string") {
    return `'${value.replaceAll("\\", "\\\\").replaceAll("'", "\\'")}'`;
  }

  if (Array.isArray(value)) {
    return `[${value.map(toGVariant).join(", ")}]`;
  }

  if (typeof value === "object" && value !== null) {
    return `{${Object.entries(value)
      .map(([key, value]) => `${toGVariant(key)}: ${toGVariant(value)}`)
      .join(", ")}}`;
  }

  throw new TypeError(`Unsupported GVariant value: ${typeof value}`);
};

export const setSettings = (desiredConfig: Record<string, unknown>) => {
  try {
    Object.entries(desiredConfig).forEach(([key, value]) => {
      execFileSync("dconf", ["write", key, toGVariant(value)]);
    });
  } catch (cause) {
    throw new Error(ERR_ORCA_FAILED_TO_SET_SETTING, { cause });
  }
};
