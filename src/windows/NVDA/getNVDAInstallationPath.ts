import { existsSync } from "fs";
import getMaxVersion from "semver/ranges/max-satisfying";
import { getNVDARegistryData } from "./getNVDARegistryData";
import { join } from "path";

let installationPath: string;

export async function getNVDAInstallationPath() {
  if (installationPath) {
    return installationPath;
  }

  const { exists, values } = await getNVDARegistryData();

  console.log({ exists, values });

  if (!exists || !values.length) {
    return null;
  }

  const versions = Object.keys(values);
  const latestVersion = getMaxVersion(versions, ">=0");
  const guidepupNVDADirectory = values[latestVersion]?.value;

  console.log({ versions, latestVersion, guidepupNVDADirectory });

  if (!guidepupNVDADirectory || !existsSync(guidepupNVDADirectory)) {
    return null;
  }

  const guidepupNVDAExecutablePath = join(guidepupNVDADirectory, "nvda.exe");

  console.log({ guidepupNVDAExecutablePath });

  return (installationPath = guidepupNVDAExecutablePath);
}
