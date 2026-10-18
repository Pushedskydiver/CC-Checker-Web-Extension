#!/bin/sh
# Launch Firefox 152 on the scratch profile with Marionette listening on 2828.
# The child-process sandboxes are disabled: launched from this app's shell, the
# parent cannot issue macOS sandbox extensions to plugin-container.app.
S="$(cd "$(dirname "$0")" && pwd)"
export MOZ_DISABLE_CONTENT_SANDBOX=1 MOZ_DISABLE_GPU_SANDBOX=1 MOZ_DISABLE_RDD_SANDBOX=1 MOZ_DISABLE_SOCKET_PROCESS_SANDBOX=1 MOZ_DISABLE_UTILITY_SANDBOX=1 MOZ_DISABLE_GMP_SANDBOX=1
exec /Applications/Firefox.app/Contents/MacOS/firefox -marionette --remote-allow-system-access -no-remote -profile "$S/profile" about:blank > "$S/firefox.log" 2>&1
