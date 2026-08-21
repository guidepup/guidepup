const teardownHandlers = new Set<() => Promise<void>>();

let processHandlersInstalled = false;

async function teardownAll(): Promise<void> {
  await Promise.all(
    [...teardownHandlers].map((teardown) => teardown().catch(() => {})),
  );
}

function signalHandler(): void {
  void teardownAll();
}

export function addTeardownHandler(handler: () => Promise<void>): void {
  teardownHandlers.add(handler);

  if (teardownHandlers.size === 1) {
    processHandlersInstalled = true;

    process.on("SIGINT", signalHandler);
    process.on("SIGTERM", signalHandler);
    process.on("SIGQUIT", signalHandler);
    process.on("SIGHUP", signalHandler);
    process.on("beforeExit", signalHandler);
  }
}

export function removeTeardownHandler(handler: () => Promise<void>): void {
  teardownHandlers.delete(handler);

  if (teardownHandlers.size === 0 && processHandlersInstalled) {
    processHandlersInstalled = false;

    process.off("SIGINT", signalHandler);
    process.off("SIGTERM", signalHandler);
    process.off("SIGQUIT", signalHandler);
    process.off("SIGHUP", signalHandler);
    process.off("beforeExit", signalHandler);
  }
}
