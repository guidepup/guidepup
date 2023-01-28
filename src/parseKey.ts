import { KeyCodeCommand } from "./KeyCodeCommand";

export function parseKey<T extends KeyCodeCommand>(
  keyOrKeys: string,
  Modifiers: Record<string, unknown>,
  KeyCodes: Record<string, unknown>
): T {
  const keyCode: unknown[] = [];
  const modifiers: unknown[] = [];

  keyOrKeys = /^[A-Z]$/.test(keyOrKeys) ? `Shift+${keyOrKeys}` : keyOrKeys;

  const rawKeys = keyOrKeys.split("+");

  for (let rawKey of rawKeys) {
    rawKey = /^\d$/.test(rawKey) ? `Digit${rawKey}` : rawKey;

    if (typeof Modifiers[rawKey] !== "undefined") {
      modifiers.push(Modifiers[rawKey]);
    } else if (typeof KeyCodes[rawKey] !== "undefined") {
      keyCode.push(KeyCodes[rawKey]);
    }
  }

  return { keyCode, modifiers } as T;
}
