import { connectAtSpiDeviceEventController } from "./connectAtSpiDeviceEventController";
import type { MessageBus } from "dbus-native";
import { sessionBus } from "dbus-native";

jest.mock("dbus-native", () => ({
  sessionBus: jest.fn(),
}));
jest.mock("../../debug", () => {
  const debug = jest.fn();

  return { base: { extend: () => debug } };
});

const AT_SPI_SERVICE = "org.a11y.Bus";
const mockAtSpiBusAddress = "test-at-spi-bus-address";
const controllerStub = Symbol("test-device-event-controller");

describe("connectAtSpiDeviceEventController", () => {
  let a11yBusInterfaceStub: { GetAddress: jest.Mock };
  let a11yServiceStub: { getInterface: jest.Mock };
  let sessionDBusStub: { getService: jest.Mock };
  let atSpiRegistryStub: { getInterface: jest.Mock };
  let atSpiBusStub: { close: jest.Mock; getService: jest.Mock };

  const connect = () =>
    connectAtSpiDeviceEventController(sessionDBusStub as unknown as MessageBus);

  beforeEach(() => {
    jest.clearAllMocks();

    a11yBusInterfaceStub = {
      GetAddress: jest.fn().mockResolvedValue(mockAtSpiBusAddress),
    };
    a11yServiceStub = {
      getInterface: jest.fn().mockResolvedValue(a11yBusInterfaceStub),
    };
    sessionDBusStub = {
      getService: jest.fn().mockReturnValue(a11yServiceStub),
    };
    atSpiRegistryStub = {
      getInterface: jest.fn().mockResolvedValue(controllerStub),
    };
    atSpiBusStub = {
      close: jest.fn().mockResolvedValue(undefined),
      getService: jest.fn().mockReturnValue(atSpiRegistryStub),
    };

    jest
      .mocked(sessionBus)
      .mockReturnValue(
        atSpiBusStub as unknown as ReturnType<typeof sessionBus>,
      );
  });

  describe("when the device event controller is available", () => {
    let result: Awaited<ReturnType<typeof connectAtSpiDeviceEventController>>;

    beforeEach(async () => {
      result = await connect();
    });

    it("should ask the session D-Bus for the accessibility bus address", () => {
      expect(sessionDBusStub.getService).toHaveBeenCalledWith(AT_SPI_SERVICE);
      expect(a11yServiceStub.getInterface).toHaveBeenCalledWith(
        "/org/a11y/bus",
        AT_SPI_SERVICE,
      );
      expect(a11yBusInterfaceStub.GetAddress).toHaveBeenCalled();
    });

    it("should connect to the accessibility bus", () => {
      expect(sessionBus).toHaveBeenCalledWith({
        busAddress: mockAtSpiBusAddress,
      });
    });

    it("should get the device event controller from the registry", () => {
      expect(atSpiBusStub.getService).toHaveBeenCalledWith(
        "org.a11y.atspi.Registry",
      );
      expect(atSpiRegistryStub.getInterface).toHaveBeenCalledWith(
        "/org/a11y/atspi/registry/deviceeventcontroller",
        "org.a11y.atspi.DeviceEventController",
      );
    });

    it("should return the connection and the controller", () => {
      expect(result).toEqual({ bus: atSpiBusStub, controller: controllerStub });
    });
  });

  describe("when the accessibility bus address can't be read", () => {
    it("should throw without connecting", async () => {
      const stubError = new Error("test-error");

      a11yBusInterfaceStub.GetAddress.mockRejectedValue(stubError);

      await expect(connect()).rejects.toBe(stubError);

      expect(sessionBus).not.toHaveBeenCalled();
    });
  });

  describe("when the device event controller can't be reached", () => {
    it("should close the accessibility bus connection and throw", async () => {
      const stubError = new Error("test-error");

      atSpiRegistryStub.getInterface.mockRejectedValue(stubError);

      await expect(connect()).rejects.toBe(stubError);

      expect(atSpiBusStub.close).toHaveBeenCalled();
    });
  });
});
