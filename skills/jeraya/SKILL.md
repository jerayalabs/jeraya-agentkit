---
name: jeraya
description: Work with the user's Jeraya account through the Jeraya MCP - find and run their Jeraya skills, browse integrations (actions and triggers), read or run script modules, query and edit their tables and records, and create Mini Apps. Use when the user mentions Jeraya, a Jeraya skill, integration, automation, script, table, record or app.
---

# Jeraya

All Jeraya capabilities come from the **Jeraya MCP server** (named `mcp`, bundled with this plugin). If its tools are not available, the user has not connected yet: tell them to run `/mcp` (on its own, in the `claude` terminal app), pick **plugin:jeraya:mcp**, choose **Authenticate** and click **Allow** on the Jeraya page that opens (no token needed), then stop.

## Skills
- `listSkills` lists the user's skills (name, description, status).
- `skill-details` with `skill_name` returns a skill's full instructions. Follow them.

## Integrations
- `listIntegrations` lists every integration (slug, actions, triggers, auth).
- `getIntegrationFunctions` with a slug lists its functions; `integrationFunctionDetails` describes one.
- `execute-integration` runs a function. It can have side effects: only run it when the user asked, and confirm the inputs first.

## Scripts
- `readScriptModule` with a module id shows the source and exported functions.
- `runScript` (`module_id`, `scriptName`, `inputs`) runs one. Confirm the inputs with the user first.

## Tables and records
- `getTablesList` lists tables; tools take a `tableId`, so resolve names through it. `getTableSchema` gives fields (with ids) and views.
- `queryRecords` (`where` like `(Status,eq,Open)`, `sort` required: `[]` for none, `fields`, `pageSize` up to 200), `countRecords`, `getRecord`, `aggregate_single` (field **ids**), `readAttachment`.
- `createRecords`, `updateRecords`, `deleteRecords` change data: confirm first; for deletes show the rows and get an explicit yes.
- `createTable` (with `listMenu` / `createMenuGroup` for folders) creates a table, where the server offers it.

## Mini Apps
- `createMiniApp` (`slug`, `name`, `type`, optional `icon`, `description`, `config` with `theme`, `navigation`, `features`, `dataSources`, `integrations`, `settings`). Use table ids from `getTablesList`. Confirm the draft first. There is no tool to list or edit apps.
