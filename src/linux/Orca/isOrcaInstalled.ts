import { getOrcaInstallationPath } from "./getOrcaInstallationPath";

export function isOrcaInstalled() {
  try {
    getOrcaInstallationPath();

    return true;
  } catch {
    return false;
  }
}
