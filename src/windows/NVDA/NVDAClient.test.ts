import { createServer, Server, TLSSocket } from "tls";
import { NVDA_HOST, NVDA_PORT } from "./constants";
import { ERR_NVDA_CANNOT_CONNECT } from "../errors";
import { Key } from "../Key";
import { Modifiers } from "../Modifiers";
import { NVDAClient } from "./NVDAClient";
import { readKey } from "../../../test/fixtures";

const nvdaDataHandlerStub = jest.fn();

describe("NVDAClient", () => {
  let client: NVDAClient;

  beforeEach(() => {
    jest.clearAllMocks();

    client = new NVDAClient();
  });

  describe("when NVDA is not running", () => {
    it("should reject with a 'cannot connect' error", async () => {
      await expect(client.connect()).rejects.toThrowError(
        ERR_NVDA_CANNOT_CONNECT
      );
    });
  });

  describe("when NVDA is running", () => {
    let nvdaServerFake: Server;
    let clientSocket: TLSSocket;

    async function createServerDataPromise(expectedMessages: number) {
      let counter = 0;

      return await new Promise<void>((resolve) =>
        clientSocket.on("data", () => {
          if (++counter === expectedMessages) {
            resolve();
          }
        })
      );
    }

    beforeEach(async () => {
      const options = {
        key: readKey("server.key"),
        cert: readKey("server.cert"),
        requestCert: false,
      };

      nvdaServerFake = createServer(options, (socket) => {
        clientSocket = socket;
        socket.setEncoding("utf8");
        socket.on("data", nvdaDataHandlerStub);
      });

      await new Promise<void>((resolve) => {
        nvdaServerFake.listen(NVDA_PORT, NVDA_HOST, () => {
          resolve();
        });
      });

      nvdaDataHandlerStub.mockImplementation((data) => {
        const json = JSON.parse(data);

        if (json.type === "join") {
          clientSocket.write(
            JSON.stringify({ type: "channel_joined", user_id: 1 })
          );
        }
      });

      await client.connect();
    });

    afterEach(() => {
      nvdaServerFake.close();
      client.disconnect();
      (clientSocket as unknown) = undefined;
    });

    it("should send a connection message and a protocol message to NVDA", () => {
      expect(nvdaDataHandlerStub).toHaveBeenNthCalledWith(
        1,
        JSON.stringify({
          type: "join",
          connection_type: "master",
          channel: "guidepup",
        }) + "\n"
      );
      expect(nvdaDataHandlerStub).toHaveBeenNthCalledWith(
        2,
        JSON.stringify({
          type: "protocol_version",
          version: 2,
        }) + "\n"
      );
    });

    describe("when NVDA sends a cancel message", () => {
      it("should emit a cancel event", async () => {
        const cancelEmittedPromise = new Promise((resolve) => {
          client.on("cancel", resolve);
        });

        clientSocket.write(JSON.stringify({ type: "cancel" }) + "\n");

        await cancelEmittedPromise;
      });
    });

    describe("when NVDA sends a speak message", () => {
      it("should emit a speak event with a sanitized spoken phrase string", async () => {
        const speakEmittedPromise = new Promise((resolve) => {
          client.on("speak", resolve);
        });

        clientSocket.write(
          JSON.stringify({
            type: "speak",
            sequence: [null, 1, {}, "test", "  test  with   extra spaces  "],
            priority: 1,
          }) + "\n"
        );

        expect(await speakEmittedPromise).toEqual(
          "test, test with extra spaces"
        );
      });
    });

    describe("when sendKeyCode is called with a single key code and no modifiers", () => {
      beforeEach(async () => {
        jest.clearAllMocks();

        const serverDataPromise = createServerDataPromise(2);

        await client.sendKeyCode({
          keyCode: new Key({ keyCode: 1, scanCode: 2, extended: false }),
        });

        await serverDataPromise;
      });

      it("should send a key down and a key up command to NVDA", () => {
        expect(nvdaDataHandlerStub).toHaveBeenNthCalledWith(
          1,
          JSON.stringify({
            scan_code: 2,
            extended: false,
            vk_code: 1,
            pressed: true,
            type: "key",
          }) + "\n"
        );
        expect(nvdaDataHandlerStub).toHaveBeenNthCalledWith(
          2,
          JSON.stringify({
            scan_code: 2,
            extended: false,
            vk_code: 1,
            pressed: false,
            type: "key",
          }) + "\n"
        );
      });
    });

    describe("when sendKeyCode is called with multiple key codes and no modifiers", () => {
      beforeEach(async () => {
        jest.clearAllMocks();

        const serverDataPromise = createServerDataPromise(4);

        await client.sendKeyCode({
          keyCode: [
            new Key({ keyCode: 1, scanCode: 2, extended: false }),
            new Key({ keyCode: 3, scanCode: 4, extended: true }),
          ],
        });

        await serverDataPromise;
      });

      it("should send a key down command for each key, and then a key up command for each key in the reverse order to NVDA", () => {
        expect(nvdaDataHandlerStub).toHaveBeenNthCalledWith(
          1,
          JSON.stringify({
            scan_code: 2,
            extended: false,
            vk_code: 1,
            pressed: true,
            type: "key",
          }) + "\n"
        );
        expect(nvdaDataHandlerStub).toHaveBeenNthCalledWith(
          2,
          JSON.stringify({
            scan_code: 4,
            extended: true,
            vk_code: 3,
            pressed: true,
            type: "key",
          }) + "\n"
        );
        expect(nvdaDataHandlerStub).toHaveBeenNthCalledWith(
          3,
          JSON.stringify({
            scan_code: 4,
            extended: true,
            vk_code: 3,
            pressed: false,
            type: "key",
          }) + "\n"
        );
        expect(nvdaDataHandlerStub).toHaveBeenNthCalledWith(
          4,
          JSON.stringify({
            scan_code: 2,
            extended: false,
            vk_code: 1,
            pressed: false,
            type: "key",
          }) + "\n"
        );
      });
    });

    describe("when sendKeyCode is called with a key code and modifiers", () => {
      beforeEach(async () => {
        jest.clearAllMocks();

        const serverDataPromise = createServerDataPromise(4);

        await client.sendKeyCode({
          keyCode: new Key({ keyCode: 1, scanCode: 2, extended: false }),
          modifiers: [Modifiers.ALT],
        });

        await serverDataPromise;
      });

      it("should send a key down command for the modifier, then the key, and then a key up command in the reverse order to NVDA", () => {
        expect(nvdaDataHandlerStub).toHaveBeenNthCalledWith(
          1,
          Modifiers.ALT.toString(true) + "\n"
        );
        expect(nvdaDataHandlerStub).toHaveBeenNthCalledWith(
          2,
          JSON.stringify({
            scan_code: 2,
            extended: false,
            vk_code: 1,
            pressed: true,
            type: "key",
          }) + "\n"
        );
        expect(nvdaDataHandlerStub).toHaveBeenNthCalledWith(
          3,
          JSON.stringify({
            scan_code: 2,
            extended: false,
            vk_code: 1,
            pressed: false,
            type: "key",
          }) + "\n"
        );
        expect(nvdaDataHandlerStub).toHaveBeenNthCalledWith(
          4,
          Modifiers.ALT.toString(false) + "\n"
        );
      });
    });

    describe("when sendKeyCode is called with multiple key codes and modifiers", () => {
      beforeEach(async () => {
        jest.clearAllMocks();

        const serverDataPromise = createServerDataPromise(8);

        await client.sendKeyCode({
          keyCode: [
            new Key({ keyCode: 1, scanCode: 2, extended: false }),
            new Key({ keyCode: 3, scanCode: 4, extended: true }),
          ],
          modifiers: [Modifiers.ALT, Modifiers.CONTROL],
        });

        await serverDataPromise;
      });

      it("should send a key down command for the modifier, then the key, and then a key up command in the reverse order to NVDA", () => {
        expect(nvdaDataHandlerStub).toHaveBeenNthCalledWith(
          1,
          Modifiers.ALT.toString(true) + "\n"
        );
        expect(nvdaDataHandlerStub).toHaveBeenNthCalledWith(
          2,
          Modifiers.CONTROL.toString(true) + "\n"
        );
        expect(nvdaDataHandlerStub).toHaveBeenNthCalledWith(
          3,
          JSON.stringify({
            scan_code: 2,
            extended: false,
            vk_code: 1,
            pressed: true,
            type: "key",
          }) + "\n"
        );
        expect(nvdaDataHandlerStub).toHaveBeenNthCalledWith(
          4,
          JSON.stringify({
            scan_code: 4,
            extended: true,
            vk_code: 3,
            pressed: true,
            type: "key",
          }) + "\n"
        );
        expect(nvdaDataHandlerStub).toHaveBeenNthCalledWith(
          5,
          JSON.stringify({
            scan_code: 4,
            extended: true,
            vk_code: 3,
            pressed: false,
            type: "key",
          }) + "\n"
        );
        expect(nvdaDataHandlerStub).toHaveBeenNthCalledWith(
          6,
          JSON.stringify({
            scan_code: 2,
            extended: false,
            vk_code: 1,
            pressed: false,
            type: "key",
          }) + "\n"
        );
        expect(nvdaDataHandlerStub).toHaveBeenNthCalledWith(
          7,
          Modifiers.CONTROL.toString(false) + "\n"
        );
        expect(nvdaDataHandlerStub).toHaveBeenNthCalledWith(
          8,
          Modifiers.ALT.toString(false) + "\n"
        );
      });
    });
  });

  describe("when no phrases have been spoken", () => {
    it("should return an empty array", () => {
      expect(client.spokenPhraseLog()).toEqual([]);
    });
  });
});
