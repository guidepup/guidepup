import { NVDA_HOST, NVDA_PORT } from "./constants";
import { connect } from "net";

export async function isRunning(): Promise<boolean> {
  return new Promise((resolve) => {
    const client = connect(NVDA_PORT, NVDA_HOST);

    client.on("connect", () => {
      client.end();
      resolve(true);
    });

    client.on("error", () => {
      client.end();
      resolve(false);
    });
  });
}
