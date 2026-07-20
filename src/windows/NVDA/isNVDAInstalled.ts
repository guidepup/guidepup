import { getNVDAInstallationPath } from "./getNVDAInstallationPath";

export function isNVDAInstalled() {
  try {
    const path = getNVDAInstallationPath();

    return !!path;
  } catch {
    return false;
  }
}
