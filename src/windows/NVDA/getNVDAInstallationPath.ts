import { existsSync } from "fs";
import { getNVDARegistryData } from "./getNVDARegistryData";
import { join } from "path";
import { maxSatisfying } from "semver";

let installationPath: string;

export async function getNVDAInstallationPath(): Promise<string | null> {
  if (installationPath) {
    return installationPath;
  }

  const { exists, values } = await getNVDARegistryData();

  const versions = Object.keys(values).map((value) =>
    value.replace("guidepup_nvda_", "")
  );

  const versionsWithoutSubVersion = versions.map(
    (version) => version.split("-")[0]
  );

  if (!exists || !versions.length) {
    return null;
  }

  const maxSatisfyingVersion = maxSatisfying(versionsWithoutSubVersion, ">=0");
  const maxSatisfyingVersionWithSubVersion = versions.find((version) =>
    version.startsWith(maxSatisfyingVersion)
  );

  const latestVersion = `guidepup_nvda_${maxSatisfyingVersionWithSubVersion}`;
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
