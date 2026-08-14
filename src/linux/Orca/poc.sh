# docker run -it ubuntu:24.04 bash

apt-get update

ln -fs /usr/share/zoneinfo/Europe/London /etc/localtime
echo "Europe/London" > /etc/timezone

apt-get install -y \
  orca \
  xvfb \
  dbus-x11 \
  libglib2.0-bin

# ============================================================
# Speech Dispatcher
# ============================================================

export SPEECHD_DIR=/tmp/guidepup-speechd

mkdir -p \
  "${SPEECHD_DIR}/modules" \
  "${SPEECHD_DIR}/logs" \
  "${SPEECHD_DIR}/run"

# ------------------------------------------------------------
# Speech Dispatcher configuration
# ------------------------------------------------------------

cat > "${SPEECHD_DIR}/speechd.conf" <<'EOF'
# Guidepup Speech Dispatcher PoC

AddModule "guidepup" "guidepup" "guidepup.conf"
DefaultModule guidepup
EOF

# ------------------------------------------------------------
# Custom module
# ------------------------------------------------------------

# TODO: Replace file-based Orca output capture with a streaming transport (Unix
# domain socket preferred) so the Guidepup Orca module can consume speech
# events in real time.
cat > "${SPEECHD_DIR}/modules/guidepup" <<'PY'
#!/usr/bin/env python3

import sys

LOG = "/tmp/speech.log"


def log(text):
    with open(LOG, "a", buffering=1) as f:
        f.write(text + "\n")


def send(text):
    log(f"OUT: {text!r}")
    sys.stdout.write(text + "\n")
    sys.stdout.flush()


def receive_data():
    lines = []

    while True:
        line = sys.stdin.readline()

        if not line:
            return None

        line = line.rstrip("\n")
        log(f"IN: {line!r}")

        if line == ".":
            break

        if line == "..":
            line = "."

        lines.append(line)

    return "\n".join(lines)


while True:
    line = sys.stdin.readline()

    if not line:
        break

    line = line.rstrip("\n")
    log(f"IN: {line!r}")

    if line == "INIT":
        send("299 OK LOADED")

    elif line == "AUDIO":
        send("207 OK RECEIVING AUDIO SETTINGS")

        data = receive_data()

        if data is None:
            break

        log(f"AUDIO SETTINGS: {data!r}")
        send("203 OK AUDIO SETTINGS RECEIVED")

    elif line == "LOGLEVEL":
        send("200 OK RECEIVING LOGLEVEL")

        data = receive_data()

        if data is None:
            break

        log(f"LOGLEVEL: {data!r}")
        send("200 OK")

    elif line == "LIST VOICES":
        send("200 OK")

    elif line == "SET":
        send("203 OK RECEIVING SETTINGS")

        data = receive_data()

        if data is None:
            break

        log(f"SETTINGS: {data!r}")
        send("203 OK SETTINGS RECEIVED")

    elif line == "SPEAK":
        send("202 OK SEND DATA")

        data = receive_data()

        if data is None:
            break

        log(f"SPEECH: {data!r}")

        send("200 OK SPEAKING")
        send("701 BEGIN")
        send("702 END")

    elif line == "STOP":
        send("703 STOP")

    elif line == "PAUSE":
        send("704 PAUSE")

    elif line == "CANCEL":
        send("703 STOP")

    elif line in ("QUIT", "END"):
        send("210 OK QUIT")
        break

    else:
        log(f"UNKNOWN: {line!r}")
        send("200 OK")
PY

chmod +x "${SPEECHD_DIR}/modules/guidepup"

# ------------------------------------------------------------
# Custom module configuration
# ------------------------------------------------------------

cat > "${SPEECHD_DIR}/modules/guidepup.conf" <<'EOF'
# Guidepup Speech Dispatcher module configuration
EOF

# ------------------------------------------------------------
# Start Speech Dispatcher
# ------------------------------------------------------------

speech-dispatcher \
  --run-single \
  --config-dir "${SPEECHD_DIR}" \
  --module-dir "${SPEECHD_DIR}/modules" \
  --communication-method unix_socket \
  --socket-path "${SPEECHD_DIR}/run/speechd.sock" \
  --log-dir "${SPEECHD_DIR}/logs" \
  --log-level 5 \
  --timeout 0 &

SPEECHD_PID=$!

export SPEECHD_ADDRESS="unix_socket:${SPEECHD_DIR}/run/speechd.sock"

# ------------------------------------------------------------
# Wait for running
# ------------------------------------------------------------

for i in $(seq 1 50); do
  if [ -S "${SPEECHD_DIR}/run/speechd.sock" ]; then
    break
  fi

  sleep 0.1
done

if [ ! -S "${SPEECHD_DIR}/run/speechd.sock" ]; then
  echo "Speech Dispatcher failed to create socket"
  cat "${SPEECHD_DIR}/logs/"* 2>/dev/null || true
  exit 1
fi

echo "Speech Dispatcher running:"
echo "  PID:    $SPEECHD_PID"
echo "  socket: ${SPEECHD_DIR}/run/speechd.sock"

# ============================================================
# X server
# ============================================================

Xvfb :99 >/dev/null 2>&1 &
export DISPLAY=:99

# ============================================================
# D-Bus session
# ============================================================

eval "$(dbus-launch --sh-syntax --exit-with-session)"

echo "DBUS_SESSION_BUS_ADDRESS=$DBUS_SESSION_BUS_ADDRESS"
echo "DBUS_SESSION_BUS_PID=$DBUS_SESSION_BUS_PID"

# ============================================================
# AT-SPI
# ============================================================

/usr/libexec/at-spi-bus-launcher &

# ============================================================
# Orca
# ============================================================

touch /tmp/guidepup.log

orca --version
orca --replace --debug --debug-file /tmp/guidepup.log &

# ============================================================
# Automate Orca
# ============================================================

gdbus call \
  --session \
  --dest org.gnome.Orca.Service \
  --object-path /org/gnome/Orca/Service/SystemInformationPresenter \
  --method org.gnome.Orca.Module.ExecuteCommand \
  PresentDate \
  true

gdbus call \
  --session \
  --dest org.gnome.Orca.Service \
  --object-path /org/gnome/Orca/Service/SystemInformationPresenter \
  --method org.gnome.Orca.Module.ExecuteCommand \
  PresentTime \
  true

# ============================================================
# Assert capturing speech output
# ============================================================

# TODO: Move away from a log file and we would instead consume off Unix socket
# in the Guidepup OrcaClient.
cat /tmp/speech.log