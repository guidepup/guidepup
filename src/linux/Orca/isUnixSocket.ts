import { statSync } from "fs";

export function isUnixSocket(path: string): boolean {
  try {
    return statSync(path).isSocket();
  } catch {
    return false;
  }
}
