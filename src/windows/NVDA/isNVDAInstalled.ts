import { getGuidepupNVDAInstallationPath } from "./getGuidepupNVDAInstallationPath";

export function isNVDAInstalled() {
  try {
    const path = getGuidepupNVDAInstallationPath();

    return !!path;
  } catch {
    return false;
  }
}
