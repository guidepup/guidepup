import { connect, TLSSocket } from "tls";
import { NVDA_HOST, NVDA_PORT } from "./constants";
import { EventEmitter } from "events";
import { KeyCodeCommand } from "../KeyCodeCommand";

interface NVDABaseMessage extends Record<string, unknown> {
  type: string;
}

interface NVDAChannelJoinedMessage extends NVDABaseMessage {
  type: "channel_joined";
  user_id: number;
}

interface NVDACancelMessage extends NVDABaseMessage {
  type: "cancel";
}

interface NVDASpeakMessage extends NVDABaseMessage {
  type: "speak";
  sequence: string[];
  priority: number;
}

const connectionMessage = JSON.stringify({
  type: "join",
  connection_type: "master",
  channel: "guidepup",
});

const protocolMessage = JSON.stringify({
  type: "protocol_version",
  version: 2,
});

export const CHANNEL_JOINED = "channel_joined";
export const CANCEL = "cancel";
export const SPEAK = "speak";

const isChannelJoinedMessage = (
  message: NVDABaseMessage
): message is NVDAChannelJoinedMessage => {
  return message.type === CHANNEL_JOINED;
};

const isCancelMessage = (
  message: NVDABaseMessage
): message is NVDACancelMessage => {
  return message.type === CANCEL;
};

const isSpeakMessage = (
  message: NVDABaseMessage
): message is NVDASpeakMessage => {
  return message.type === SPEAK;
};

export class NVDAStream extends EventEmitter {
  #stream: TLSSocket;
  #spokenPhrases = [];

  constructor() {
    super();

    this.addListener(SPEAK, (spokenPhrase: string) => {
      this.#spokenPhrases.push(spokenPhrase);
    });
  }

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
          this.once(CHANNEL_JOINED, () => {
            resolve();
          });

          this.send(connectionMessage);
          this.send(protocolMessage);
        }
      );

      this.#stream.on("error", () => {
        this.stop();
        reject();
      });

      this.#stream.setEncoding("utf8");

      this.#stream.on("data", (data: string) => {
        if (!data.trim().length) {
          return;
        }

        let parsedData: NVDABaseMessage;

        try {
          parsedData = JSON.parse(data);
        } catch {
          return;
        }

        if (isChannelJoinedMessage(parsedData)) {
          this.emit(CHANNEL_JOINED);

          return;
        }

        if (isCancelMessage(parsedData)) {
          this.emit(CANCEL);

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

        const spokenPhrase = spokenPhraseParts.join(", ");

        this.emit(SPEAK, spokenPhrase);
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
    this.#stream = null;
  }
}
