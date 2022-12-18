import { getNVDAInstallationPath } from "./getNVDAInstallationPath";

export async function isNVDAInstalled() {
  try {
    const path = await getNVDAInstallationPath();

    console.log({ path });

    return !!path;
  } catch (e) {
    console.log(e);

    return false;
  }
}
