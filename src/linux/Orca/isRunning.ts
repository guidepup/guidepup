export async function isRunning(): Promise<boolean> {
  // TODO: could consider `orca --list-apps` and check for output and orca listed
  // Probably more interested in a similar setup to NVDA where can prove that we can
  // successfully open a connection for receiving speech output.
  return Promise.resolve(true);
}
