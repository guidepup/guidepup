export const ERR_LINUX_VERSION_NOT_SUPPORTED = "Linux version not supported";
export const ERR_ORCA_NOT_SUPPORTED = "Orca is not supported";
export const ERR_ORCA_ALREADY_RUNNING = "Orca is already running";
export const ERR_ORCA_FAILED_TO_LOAD_GUIDEPUP_SETTINGS =
  "Failed to load Guidepup settings\n\nPlease ensure you have run:\n\n\t- `npx @guidepup/setup setup` at least once on your machine to configure the OS\n\t- `npx @guidepup/setup install` at least once for this project to install screen reader assets";
export const ERR_ORCA_NOT_RUNNING = "Orca is not running";
export const ERR_ORCA_CANNOT_BE_STARTED = "Orca cannot be started";

export const ERR_ORCA_X_SERVER_DISPLAYS_NOT_AVAILABLE =
  "Unable to find an available X Server display";
export const ERR_ORCA_X_SERVER_TIMEOUT =
  "Timed out waiting for X Server to be running";

export const ERR_ORCA_DBUS_START_FAILURE = "Failed to start a session D-Bus";
export const ERR_ORCA_DBUS_CONNECTION_TIMEOUT =
  "Timed out waiting to connect to the session D-Bus";

export const ERR_ORCA_AT_SPI_LAUNCHER_MISSING =
  "Failed to find a AT-SPI launcher";
export const ERR_ORCA_AT_SPI_SERVICE_TIMEOUT =
  "Timed out waiting to discover the 'org.a11y.Bus' service on the AT-SPI D-Bus";

export const ERR_ORCA_SPEECH_DISPATCHER_SERVICE_TIMEOUT =
  "Timed out waiting to discover the speech dispatcher unix socket";

export const ERR_ORCA_SERVICE_TIMEOUT =
  "Timed out waiting to discover the 'org.gnome.Orca.Service' service on the service D-Bus";

export const ERR_ORCA_SPEECHD_CANNOT_CONNECT =
  "Cannot connect to Guidepup Speech Dispatcher socket";
