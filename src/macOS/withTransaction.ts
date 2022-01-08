export const withTransaction = (script: string) =>
  `\nwith transaction\n${script}\nend transaction\n`;
