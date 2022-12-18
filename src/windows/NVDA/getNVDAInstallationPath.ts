import { existsSync } from "fs";
import { getNVDARegistryData } from "./getNVDARegistryData";
import { join } from "path";
import { maxSatisfying } from "semver";

let installationPath: string;

export async function getNVDAInstallationPath() {
  if (installationPath) {
    return installationPath;
  }

  const { exists, values } = await getNVDARegistryData();

  console.log({ exists, values });

  const versions = Object.keys(values).map((value) =>
    value.replace("guidepup_nvda_", "")
  );

  if (!exists || !versions.length) {
    return null;
  }

  const latestVersion = `guidepup_nvda_${maxSatisfying(versions, ">=0")}`;
  const guidepupNVDADirectory = values[latestVersion]?.value;

  console.log({ versions, latestVersion, guidepupNVDADirectory });

  if (!guidepupNVDADirectory) {
    return null;
  }

  const guidepupNVDAExecutablePath = join(guidepupNVDADirectory, "nvda.exe");

  console.log({ guidepupNVDAExecutablePath });

  if (!existsSync(guidepupNVDAExecutablePath)) {
    return null;
  }

  return (installationPath = guidepupNVDAExecutablePath);
}
