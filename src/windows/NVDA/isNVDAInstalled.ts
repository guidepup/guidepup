import { getNVDAInstallationPath } from "./getNVDAInstallationPath";

export async function isNVDAInstalled() {
  try {
    const path = await getNVDAInstallationPath();

    return !!path;
  } catch {
    return false;
  }
}
