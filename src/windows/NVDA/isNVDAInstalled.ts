import { getNVDAInstallationPath } from "./getNVDAInstallationPath";

export async function isNVDAInstalled() {
  const path = await getNVDAInstallationPath();

  return !!path;
}
