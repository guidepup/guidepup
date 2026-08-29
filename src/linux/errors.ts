export const ERR_ORCA_NOT_SUPPORTED = "Orca is not supported";
export const ERR_ORCA_ALREADY_RUNNING = "Orca is already running";
export const ERR_ORCA_NOT_RUNNING = "Orca is not running";
export const ERR_ORCA_CANNOT_BE_STARTED = "Orca cannot be started";

export const ERR_ORCA_X_SERVER_DISPLAY_NOT_SET =
  "Orca requires an X Server to be running and the `DISPLAY` environment variable set";
export const ERR_ORCA_DBUS_ADDRESS_NOT_SET =
  "Orca requires a session D-Bus to be running and the `DBUS_SESSION_BUS_ADDRESS` environment variable set";
export const ERR_ORCA_DBUS_CONNECTION_TIMEOUT =
  "Timed out waiting to connect to the session D-Bus";
export const ERR_ORCA_AT_SPI_SERVICE_TIMEOUT =
  "Timed out waiting to discover the 'org.a11y.Bus' service on the AT-SPI D-Bus";
export const ERR_ORCA_SERVICE_TIMEOUT =
  "Timed out waiting to discover the 'org.gnome.Orca.Service' service on the service D-Bus";
