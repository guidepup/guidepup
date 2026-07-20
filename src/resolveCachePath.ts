import { homedir, platform } from "node:os";
import { join, resolve } from "node:path";

const defaultCacheLocationMap = {
  darwin: resolve(homedir(), "Library", "Caches", "guidepup"),
  win32: resolve(
    process.env.LOCALAPPDATA ?? join(homedir(), "AppData", "Local"),
    "guidepup",
  ),
};

const defaultCacheLocation = resolve(homedir(), ".cache", "guidepup");

export function resolveCachePath() {
  const currentPlatform = platform();

  const cacheLocationOverride = process.env.GUIDEPUP_SCREEN_READERS_PATH;

  const resolvedCacheLocation = cacheLocationOverride
    ? resolve(cacheLocationOverride)
    : (defaultCacheLocationMap[currentPlatform] ?? defaultCacheLocation);

  return resolvedCacheLocation;
}
