import { connect, TLSSocket } from "tls";
import { NVDA_HOST, NVDA_PORT } from "./constants";
import { KeyCodeCommand } from "../KeyCodeCommand";
import { KeystrokeCommand } from "../KeystrokeCommand";

interface NVDABaseMessage extends Record<string, unknown> {
  type: string;
}

interface NVDACancelMessage extends NVDABaseMessage {
  type: "cancel";
}

interface NVDASpeakMessage extends NVDABaseMessage {
  type: "speak";
  sequence: string[];
  priority: number;
}

type NVDAMessage = NVDABaseMessage | NVDACancelMessage | NVDASpeakMessage;

const connectionMessage = JSON.stringify({
  connection_type: "master",
  type: "join",
  channel: "guidepup",
});

const protocolMessage = JSON.stringify({
  version: 2,
  type: "protocol_version",
});

const isSpeakMessage = (message: NVDAMessage): message is NVDASpeakMessage => {
  return message.type === "speak";
};

export class NVDAStream {
  #stream: TLSSocket;
  #spokenPhrases = [];

  lastSpokenPhrase(): string {
    return this.#spokenPhrases.at(-1);
  }

  spokenPhraseLog(): string[] {
    return this.#spokenPhrases;
  }

  async start() {
    // TODO: generate some certs
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

    return new Promise<void>((resolve, reject) => {
      this.#stream = connect(
        NVDA_PORT,
        NVDA_HOST,
        { checkServerIdentity: () => null },
        () => {
          this.send(connectionMessage);
          this.send(protocolMessage);

          resolve();
        }
      );

      this.#stream.on("error", () => {
        this.stop();
        reject();
      });

      this.#stream.setEncoding("utf8");

      this.#stream.on("data", (data: string) => {
        if (data.trim().length === 0) {
          return;
        }

        let parsedData: NVDAMessage;

        try {
          parsedData = JSON.parse(data);
        } catch {
          return;
        }

        if (!isSpeakMessage(parsedData)) {
          return;
        }

        const spokenPhraseParts: string[] = [];

        for (const spokenPhrasePart of parsedData.sequence) {
          if (typeof spokenPhrasePart !== "string") {
            continue;
          }

          spokenPhraseParts.push(
            spokenPhrasePart.trim().replaceAll(/\s+/g, " ")
          );
        }

        const spokenPhrase = spokenPhraseParts.join(" - ");

        this.#spokenPhrases.push(spokenPhrase);
      });
    });
  }

  async sendKeyCode(keyCommand: KeyCodeCommand) {
    await this.send(keyCommand.keyCode.toString(true));
  }

  async send(message: string) {
    if (!message.endsWith("\n")) {
      message += "\n";
    }

    return new Promise<void>((resolve, reject) => {
      this.#stream.write(message, (err) => {
        if (err) {
          reject(err);

          return;
        }

        resolve();
      });
    });
  }

  stop() {
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "1";
    this.#stream?.destroy();
  }
}
