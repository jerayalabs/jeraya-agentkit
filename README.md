<img src=".claude-plugin/icon.png" alt="Jeraya" width="96" height="96">

# Jeraya Agent Kit

Bring [Jeraya](https://jeraya.com) into your AI tools: a plugin that connects Claude Code to the Jeraya MCP server, plus skills to work with your Jeraya skills, integrations, scripts, tables and apps.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Installation

### Claude Code

Inside Claude Code:

```text
/plugin marketplace add jerayalabs/jeraya-agentkit
/plugin install jeraya@jeraya
```

Or from a terminal:

```bash
claude plugin marketplace add jerayalabs/jeraya-agentkit
claude plugin install jeraya@jeraya --scope user
```

Then connect your account. There is no URL or token to copy:

1. In a terminal, run `claude`, then `/mcp` (no arguments). Pick **plugin:jeraya:mcp** and choose **Authenticate**.
2. Your browser opens the Jeraya **Connect** page. Pick a base and click **Allow**.
3. You are sent back to Claude Code and the Jeraya tools are ready.

`/jeraya:setup` walks you through the same steps. Claude Code stores the OAuth token and refreshes it. Revoke access by deleting the token in the base's MCP settings.

To get new versions automatically: run `/plugin`, open **Marketplaces**, select `jeraya`, then **Enable auto-update**. Or update by hand:

```bash
claude plugin marketplace update jeraya
claude plugin update jeraya@jeraya
```

### Claude Desktop and claude.ai

Settings > Connectors > **Add custom connector**, URL `https://api.jeraya.com/mcp`, then **Connect**.

### Other agents

The skills install into other coding agents (Gemini CLI, OpenCode, Cursor, Codex...) with [`npx skills`](https://github.com/vercel-labs/skills):

```bash
npx skills add jerayalabs/jeraya-agentkit -g -a <agent>
```

Then add the Jeraya MCP server (`https://api.jeraya.com/mcp`, OAuth) in that agent's MCP settings. This path carries the skills only.

## Features

### MCP server

The plugin connects to Jeraya's hosted MCP server at `https://api.jeraya.com/mcp`:

- **Skills**: list your Jeraya skills and load their instructions
- **Integrations**: browse integrations, their actions and triggers, and run them
- **Scripts**: read script modules and run their functions
- **Tables**: list tables, read schemas, query, count and aggregate records, create, update and delete them
- **Automations**: create, update and run flows
- **Apps**: create Mini Apps

### Commands

| Command | What it does |
|---|---|
| `/jeraya:setup` | Connect your Jeraya account |
| `/jeraya:skill [name]` | List your skills, or load one |
| `/jeraya:integration [name]` | List integrations, or show one's functions |
| `/jeraya:script <module id> [function]` | Read a script module, or run a function |
| `/jeraya:table [name] [request]` | List tables, show one, query, count, aggregate or edit records |
| `/jeraya:app <name> [purpose]` | Create a Mini App wired to your tables and integrations |

The `jeraya` skill loads on its own whenever you mention Jeraya, so you can also just ask.

## Layout

```
.claude-plugin/
  marketplace.json   the jeraya marketplace (this repo)
  plugin.json        the jeraya plugin manifest
.mcp.json            the Jeraya MCP server (OAuth, no token in the config)
skills/              setup, skill, integration, script, table, app, jeraya
hooks/hooks.json     SessionStart: re-sync skills (only if ~/.jeraya/config.json exists)
scripts/
  sync-skills.mjs    sync your Jeraya skills; --dir <path> for other agents
  lib/               agent-neutral config + MCP client
```

## Uninstall

```bash
claude plugin uninstall jeraya@jeraya
claude plugin marketplace remove jeraya
rm -rf ~/.jeraya ~/.claude/skills/jeraya-*
```

## License

[MIT](LICENSE)
