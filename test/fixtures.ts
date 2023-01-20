import { join } from "path";
import { readFileSync } from "fs";

export const fixturesDir = join(__dirname, "fixtures");

export function fixturesPath(...args: string[]) {
  return join(fixturesDir, ...args);
}

export function readKey(name: string) {
  return readFileSync(fixturesPath("keys", name));
}
