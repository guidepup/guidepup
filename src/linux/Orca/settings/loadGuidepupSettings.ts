import { ERR_ORCA_FAILED_TO_LOAD_GUIDEPUP_SETTINGS } from "../../errors";
import { execFileSync } from "node:child_process";
import { getOrcaInstallationPath } from "../getOrcaInstallationPath";
import { join } from "node:path";
import { readFileSync } from "node:fs";
import { resetGuidepupSettings } from "./resetGuidepupSettings";

export const loadGuidepupSettings = () => {
  const installationPath = getOrcaInstallationPath();
  const defaultSettingsFilePath = join(installationPath, "default.ini");
  const guidepupSettingsFilePath = join(installationPath, "guidepup.ini");

  let defaultSettings: string;
  let guidepupSettings: string;

  try {
    defaultSettings = readFileSync(defaultSettingsFilePath, {
      encoding: "utf8",
    });
  } catch (cause) {
    throw new Error(ERR_ORCA_FAILED_TO_LOAD_GUIDEPUP_SETTINGS, { cause });
  }

  try {
    guidepupSettings = readFileSync(guidepupSettingsFilePath, {
      encoding: "utf8",
    });
  } catch (cause) {
    throw new Error(ERR_ORCA_FAILED_TO_LOAD_GUIDEPUP_SETTINGS, { cause });
  }

  resetGuidepupSettings();

  try {
    execFileSync("dconf", ["load", "/org/gnome/orca/guidepup/"], {
      input: defaultSettings,
    });
  } catch (cause) {
    throw new Error(ERR_ORCA_FAILED_TO_LOAD_GUIDEPUP_SETTINGS, { cause });
  }

  try {
    execFileSync("dconf", ["load", "/org/gnome/orca/guidepup/"], {
      input: guidepupSettings,
    });
  } catch (cause) {
    throw new Error(ERR_ORCA_FAILED_TO_LOAD_GUIDEPUP_SETTINGS, { cause });
  }
};
