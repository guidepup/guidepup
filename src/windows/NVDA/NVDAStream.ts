import { connect, TLSSocket } from "tls";
import { NVDA_HOST, NVDA_PORT } from "./constants";
import { EventEmitter } from "events";
import { KeyCodeCommand } from "../KeyCodeCommand";
import { keyCodeCommands } from "./keyCodeCommands";

export const CHANNEL_JOINED = "channel_joined";
export const CANCEL = "cancel";
export const SPEAK = "speak";

interface NVDABaseMessage extends Record<string, unknown> {
  type: string;
}

interface NVDAChannelJoinedMessage extends NVDABaseMessage {
  type: typeof CHANNEL_JOINED;
  user_id: number;
}

interface NVDACancelMessage extends NVDABaseMessage {
  type: typeof CANCEL;
}

interface NVDASpeakMessage extends NVDABaseMessage {
  type: typeof SPEAK;
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

const CANCEL_DEBOUNCE_TIMEOUT = 100;
const SPEAK_DEBOUNCE_TIMEOUT = 250;

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

const delay = async (ms: number) =>
  await new Promise((resolve) => setTimeout(resolve, ms));

export class NVDAStream extends EventEmitter {
  #stream: TLSSocket;
  #spokenPhrases = [];

  constructor() {
    super();
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
    const modifiers = keyCommand.modifiers
      ? Array.isArray(keyCommand.modifiers)
        ? keyCommand.modifiers
        : [keyCommand.modifiers]
      : [];

    const keyCodes = keyCommand.keyCode
      ? Array.isArray(keyCommand.keyCode)
        ? keyCommand.keyCode
        : [keyCommand.keyCode]
      : [];

    const keys = [...modifiers, ...keyCodes];

    for (const key of keys) {
      await this.send(key.toString(true));
    }

    for (const key of keys.reverse()) {
      await this.send(key.toString(false));
    }
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

  async stopReading(): Promise<void> {
    let spoken: boolean;
    let cancelPromiseResolver: () => void;

    const speakHandler = () => {
      spoken = true;
    };
    const cancelHandler = () => {
      cancelPromiseResolver();
    };

    this.addListener(SPEAK, speakHandler);

    while (spoken) {
      spoken = false;

      const cancelPromise = new Promise<void>((resolve) => {
        cancelPromiseResolver = resolve;
      });

      this.once(CANCEL, cancelHandler);
      this.sendKeyCode(keyCodeCommands.stopReading);

      await cancelPromise;
      await delay(CANCEL_DEBOUNCE_TIMEOUT);
    }

    this.removeListener(SPEAK, speakHandler);
  }

  /**
   * Stops the current spoken phrase, executes the provided action, and waits
   * for the associated spoken phrase.
   *
   * This is used internally to ensure there isn't a race condition when
   * calling lastSpokenPhrase() after executing an action.
   *
   * @param {Promise<unknown>} promise Underlying action to capture logs for.
   * @returns {Promise<unknown>}
   */
  async waitForSpokenPhrase<T>(action: () => Promise<T>): Promise<T> {
    await this.stopReading();

    let speakPromiseResolver: () => void;

    const speakPromise = new Promise<void>((resolve) => {
      speakPromiseResolver = resolve;
    });

    let timeoutId: NodeJS.Timeout = null;

    const speakHandler = (spokenPhrase) => {
      this.#spokenPhrases.push(spokenPhrase);

      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(timeoutHandler, SPEAK_DEBOUNCE_TIMEOUT);
      }
    };

    const timeoutHandler = () => {
      this.removeListener(SPEAK, speakHandler);
      speakPromiseResolver();
    };

    this.addListener(SPEAK, speakHandler);

    const result = await action();

    timeoutId = setTimeout(timeoutHandler, SPEAK_DEBOUNCE_TIMEOUT);

    await speakPromise;

    timeoutId = null;

    return result;
  }
}
