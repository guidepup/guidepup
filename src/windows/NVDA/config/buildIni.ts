function isSection(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function formatValue(value: unknown): string {
  if (typeof value === "boolean") {
    return value ? "True" : "False";
  }

  if (Array.isArray(value)) {
    return `${value.join(",")},`;
  }

  return String(value);
}

function writeSection(
  section: Record<string, unknown>,
  depth: number,
): string[] {
  const lines: string[] = [];

  for (const [key, value] of Object.entries(section)) {
    if (isSection(value)) {
      lines.push(`${"[".repeat(depth + 1)}${key}${"]".repeat(depth + 1)}`);
      lines.push(...writeSection(value, depth + 1));
    } else {
      lines.push(`${key} = ${formatValue(value)}`);
    }
  }

  return lines;
}

export function buildIni(config: Record<string, unknown>): string {
  return writeSection(config, 0).join("\n");
}
