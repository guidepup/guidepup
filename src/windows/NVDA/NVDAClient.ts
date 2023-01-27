import { connect, TLSSocket } from "tls";
import { dirname, join } from "path";
import { ERR_NVDA_CANNOT_CONNECT, ERR_NVDA_NOT_INSTALLED } from "../errors";
import { NVDA_HOST, NVDA_PORT } from "./constants";
import { EventEmitter } from "events";
import { getNVDAInstallationPath } from "./getNVDAInstallationPath";
import { KeyCodeCommand } from "../KeyCodeCommand";
import { keyCodeCommands } from "./keyCodeCommands";
import { readFileSync } from "fs";

const CHANNEL_JOINED = "channel_joined";
const CANCEL = "cancel";
const SPEAK = "speak";

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

const CANCEL_DEBOUNCE_TIMEOUT = 250;
const SPEAK_DEBOUNCE_TIMEOUT = 500;

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

export class NVDAClient extends EventEmitter {
  #activePromise = null;

  #socket: TLSSocket;
  #spokenPhrases = [];

  /**
   * Get the log of all spoken phrases for this NVDA connection.
   *
   * @returns {Promise<string[]>} All spoken phrases
   */
  async spokenPhraseLog(): Promise<string[]> {
    if (this.#activePromise) {
      await this.#activePromise;
    }

    return this.#spokenPhrases;
  }

  /**
   * Connect to a NVDA instance.
   */
  async connect(): Promise<void> {
    const executablePath = await getNVDAInstallationPath();

    if (!executablePath) {
      throw new Error(ERR_NVDA_NOT_INSTALLED);
    }

    const caPath = join(
      dirname(executablePath),
      "userConfig",
      "addons",
      "remote",
      "globalPlugins",
      "remoteClient",
      "server.pem"
    );

    return await new Promise<void>((resolve, reject) => {
      this.#socket = connect(
        NVDA_PORT,
        NVDA_HOST,
        {
          ca: [readFileSync(caPath)],
          checkServerIdentity: () => null,
        },
        async () => {
          this.once(CHANNEL_JOINED, () => {
            resolve();
          });

          await this.#send(connectionMessage);
          await this.#send(protocolMessage);
        }
      );

      this.#socket.setEncoding("utf8");

      this.#socket.on("error", (e) => {
        this.disconnect();
        reject(new Error(`${ERR_NVDA_CANNOT_CONNECT}\n${e.message}`));
      });

      this.#socket.on("data", (data: string) => {
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
            spokenPhrasePart.trim().replaceAll(/\s\s+/g, " ")
          );
        }

        const spokenPhrase = spokenPhraseParts.join(", ");

        this.emit(SPEAK, spokenPhrase);
      });
    });
  }

  /**
   * disconnect the NVDA connection.
   */
  disconnect(): void {
    this.#socket?.destroy();
    this.#socket = null;
  }

  /**
   * Send a Key Code command to NVDA.
   *
   * @param {object} keyCommand Key Code command to send to NVDA.
   */
  async sendKeyCode(keyCommand: KeyCodeCommand): Promise<void> {
    const modifiers = keyCommand.modifiers ? keyCommand.modifiers : [];

    const keyCodes = keyCommand.keyCode
      ? Array.isArray(keyCommand.keyCode)
        ? keyCommand.keyCode
        : [keyCommand.keyCode]
      : [];

    const keys = [...modifiers, ...keyCodes];

    for (const key of keys) {
      await this.#send(key.toString(true));
    }

    for (const key of keys.reverse()) {
      await this.#send(key.toString(false));
    }
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
    if (this.#activePromise) {
      await this.#activePromise;
    }

    let activePromiseResolver: () => void;
    this.#activePromise = new Promise<void>(
      (resolve) => (activePromiseResolver = resolve)
    );

    await this.#stopReading();

    let speakPromiseResolver: () => void;

    const speakPromise = new Promise<void>((resolve) => {
      speakPromiseResolver = resolve;
    });

    let timeoutId: NodeJS.Timeout = null;

    const spokenPhrases = [];

    const speakHandler = (spokenPhrase) => {
      spokenPhrases.push(spokenPhrase);

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

    this.#spokenPhrases.push(spokenPhrases.join(". "));

    activePromiseResolver();
    this.#activePromise = null;

    return result;
  }

  async #stopReading(): Promise<void> {
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
      this.sendKeyCode(keyCodeCommands.stopSpeech);

      await cancelPromise;
      await delay(CANCEL_DEBOUNCE_TIMEOUT);
    }

    this.removeListener(SPEAK, speakHandler);
  }

  async #send(message: string): Promise<void> {
    if (!message.endsWith("\n")) {
      message += "\n";
    }

    return new Promise<void>((resolve, reject) => {
      this.#socket?.write(message, (err) => {
        if (err) {
          reject(err);

          return;
        }

        resolve();
      });
    });
  }
}
