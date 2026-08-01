function isSection(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function shouldQuote(value: string): boolean {
  return (
    value.length === 0 ||
    /^\s|\s$/.test(value) ||
    /[\s#;=]/.test(value) ||
    /"/.test(value) ||
    /^-?\d+(\.\d+)?$/.test(value) ||
    /^(True|False)$/.test(value)
  );
}

function quoteIniString(value: string): string {
  return `"${value.replace(/"/g, '\\"')}"`;
}

function formatValue(value: unknown): string {
  if (typeof value === "boolean") {
    return value ? "True" : "False";
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return `${value.map((subValue) => formatValue(subValue)).join(",")},`;
  }

  const unquotedString = String(value);

  if (shouldQuote(unquotedString)) {
    return quoteIniString(unquotedString);
  }

  return unquotedString;
}

function writeSection(
  section: Record<string, unknown>,
  depth: number,
): string[] {
  const lines: string[] = [];

  for (const [key, value] of Object.entries(section ?? {})) {
    if (isSection(value)) {
      lines.push(
        `${"\t".repeat(depth)}${"[".repeat(depth + 1)}${key}${"]".repeat(depth + 1)}`,
      );
      lines.push(...writeSection(value, depth + 1));
    } else {
      lines.push(`${"\t".repeat(depth)}${key} = ${formatValue(value)}`);
    }
  }

  return lines;
}

export function buildIni(config: Record<string, unknown>): string {
  return writeSection(config, 0).join("\n");
}
