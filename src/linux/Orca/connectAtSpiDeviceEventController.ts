import { type MessageBus, sessionBus } from "dbus-native";
import { AT_SPI_DBUS_A11Y_WELL_KNOWN_SERVICE_NAME } from "./constants";
import { base } from "../../debug";

const debug = base.extend("connectAtSpiDeviceEventController");

interface AtSpiAccessibilityBus {
  GetAddress(): PromiseLike<string>;
}

export interface AtSpiDeviceEventController {
  GenerateKeyboardEvent(
    keycode: number,
    keystring: string,
    synthType: number,
  ): PromiseLike<void>;
}

export interface AtSpiDeviceEventControllerConnection {
  bus: MessageBus;
  controller: AtSpiDeviceEventController;
}

/**
 * Connect to the AT-SPI device event controller, which generates real
 * keyboard input (XTest under X11) that Orca hears like a person's keyboard.
 * If the controller can't be reached, the accessibility bus connection is
 * closed before the error is thrown.
 *
 * @param {MessageBus} sessionDBus The session D-Bus that AT-SPI is on.
 */
export async function connectAtSpiDeviceEventController(
  sessionDBus: MessageBus,
): Promise<AtSpiDeviceEventControllerConnection> {
  debug("Connecting to AT-SPI device event controller...");

  const a11yBus = await sessionDBus
    .getService(AT_SPI_DBUS_A11Y_WELL_KNOWN_SERVICE_NAME)
    .getInterface<AtSpiAccessibilityBus>(
      "/org/a11y/bus",
      AT_SPI_DBUS_A11Y_WELL_KNOWN_SERVICE_NAME,
    );

  const address: string = await a11yBus.GetAddress();

  debug(`AT_SPI_BUS_ADDRESS=${address}`);

  const bus = sessionBus({ busAddress: address });

  try {
    const controller = await bus
      .getService("org.a11y.atspi.Registry")
      .getInterface<AtSpiDeviceEventController>(
        "/org/a11y/atspi/registry/deviceeventcontroller",
        "org.a11y.atspi.DeviceEventController",
      );

    return { bus, controller };
  } catch (error) {
    await bus.close();

    throw error;
  }
}
