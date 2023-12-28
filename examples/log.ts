export const log = (...messages) =>
  console.log(`[${new Date().toUTCString()}]`, ...messages);
