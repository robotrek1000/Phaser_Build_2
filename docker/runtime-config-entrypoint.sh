#!/bin/sh
set -eu

CONFIG_PATH="${RUNTIME_CONFIG_PATH:-/tmp/runtime-config.js}"

json_string() {
  value="$1"

  if [ -z "$value" ]; then
    printf 'undefined'
    return
  fi

  printf '%s' "$value" | awk 'BEGIN { printf "\"" } { gsub(/\\/, "\\\\"); gsub(/"/, "\\\""); if (NR > 1) printf "\\n"; printf "%s", $0 } END { printf "\"" }'
}

json_boolean() {
  case "$1" in
    true | TRUE | 1 | yes | YES)
      printf 'true'
      ;;
    false | FALSE | 0 | no | NO)
      printf 'false'
      ;;
    *)
      printf 'undefined'
      ;;
  esac
}

cat > "$CONFIG_PATH" <<EOF
window.__YACHT_GAME_CONFIG__ = {
  apiBaseUrl: $(json_string "${YACHT_API_BASE_URL:-}"),
  apiWithCredentials: $(json_boolean "${YACHT_API_WITH_CREDENTIALS:-}"),
  authBaseUrl: $(json_string "${YACHT_AUTH_BASE_URL:-}"),
  authClientId: $(json_string "${YACHT_AUTH_CLIENT_ID:-}"),
  debugEnabled: $(json_boolean "${YACHT_DEBUG_ENABLED:-}"),
  sentryDsn: $(json_string "${YACHT_SENTRY_DSN:-}"),
  sentryEnvironment: $(json_string "${YACHT_SENTRY_ENVIRONMENT:-}"),
  sentryRelease: $(json_string "${YACHT_SENTRY_RELEASE:-}"),
};
EOF
