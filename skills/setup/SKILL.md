---
name: setup
description: Connect this plugin to your Jeraya account (one click in the browser, no token to copy)
disable-model-invocation: true
---

Connect the user to Jeraya. The plugin already includes the Jeraya MCP server (`https://api.jeraya.com/mcp`); it signs in with OAuth, so the user never copies a URL or a token.

If the Jeraya MCP tools are already available, call `listSkills` to confirm the connection works, tell the user they are connected, and stop.

Otherwise tell the user, in a few short lines:

1. In a terminal, run `claude`, then type `/mcp` on its own (no arguments). In the list, pick **plugin:jeraya:mcp** and choose **Authenticate**. (In the Claude desktop app, `/mcp` only takes `reconnect`, `enable` or `disable`, so use the terminal for this step. The sign-in is shared with the desktop app.)
2. Their browser opens the Jeraya "Connect" page (sign in to Jeraya first if asked), where they pick a base and click **Allow**.
3. Back in Claude, the Jeraya tools are ready (in the desktop app, start a new session or run `/mcp reconnect plugin:jeraya:mcp`). Try `/jeraya:skill`.

You cannot start the sign-in yourself; only the user can. Never ask for a token or a callback URL.

**In Claude Desktop or claude.ai** (no `/mcp` command): Settings > Connectors > Add custom connector, name `Jeraya`, URL `https://api.jeraya.com/mcp`, then **Connect** and click **Allow** on the Jeraya page.
