import { ERR_ORCA_FAILED_TO_GET_SETTINGS } from "../../errors";
import { execFileSync } from "node:child_process";

const parseGVariant = (value: string): unknown => {
  const trimmed = value.trim();

  if (trimmed === "true") {
    return true;
  }

  if (trimmed === "false") {
    return false;
  }

  if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
    return trimmed.slice(1, -1);
  }

  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    const contents = trimmed.slice(1, -1).trim();

    if (!contents) {
      return [];
    }

    return contents.split(",").map(parseGVariant);
  }

  if (/^-?\d+$/.test(trimmed)) {
    return Number.parseInt(trimmed, 10);
  }

  if (/^-?\d+\.\d+$/.test(trimmed)) {
    return Number.parseFloat(trimmed);
  }

  return trimmed;
};

export const getSettings = (): Record<string, unknown> => {
  let output: string;

  try {
    output = execFileSync("dconf", ["dump", "/org/gnome/orca/guidepup/"], {
      encoding: "utf8",
    });
  } catch (cause) {
    throw new Error(ERR_ORCA_FAILED_TO_GET_SETTINGS, { cause });
  }

  const settings: Record<string, unknown> = {};

  let sectionPath = "";

  for (const line of output.split("\n")) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      sectionPath = trimmed.slice(1, -1);

      continue;
    }

    const separator = trimmed.indexOf("=");

    if (separator === -1 || !sectionPath) {
      continue;
    }

    const key = trimmed.slice(0, separator);
    const value = trimmed.slice(separator + 1);

    settings[`${sectionPath}/${key}`] = parseGVariant(value);
  }

  return settings;
};
