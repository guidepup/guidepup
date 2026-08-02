import { getConfig } from "./getConfig";

export function getConfigKey(key: string): unknown {
  const config = getConfig();

  return config[key];
}
