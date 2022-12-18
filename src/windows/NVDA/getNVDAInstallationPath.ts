import { existsSync, readdirSync } from "fs";
import { getNVDARegistryData } from "./getNVDARegistryData";
import { join } from "path";
import { maxSatisfying } from "semver";

let installationPath: string;

export async function getNVDAInstallationPath() {
  if (installationPath) {
    return installationPath;
  }

  const { exists, values } = await getNVDARegistryData();

  const versions = Object.keys(values).map((value) =>
    value.replace("guidepup_nvda_", "")
  );

  if (!exists || !versions.length) {
    return null;
  }

  const latestVersion = `guidepup_nvda_${maxSatisfying(versions, ">=0")}`;
  const guidepupNVDADirectory = values[latestVersion]?.value;

  if (!guidepupNVDADirectory) {
    return null;
  }

  const guidepupNVDAExecutablePath = join(guidepupNVDADirectory, "nvda.exe");

  if (!existsSync(guidepupNVDAExecutablePath)) {
    return null;
  }

  return (installationPath = guidepupNVDAExecutablePath);
}
