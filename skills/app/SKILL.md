---
name: app
description: Create a Jeraya Mini App wired to the user's tables and integrations
argument-hint: <app name> [what the app is for]
disable-model-invocation: true
---

Use the Jeraya MCP connector. The only app tool is `createMiniApp`: there is no tool to list, edit or delete Mini Apps, so changes after creation are made in the Jeraya app.

If `$ARGUMENTS` is empty: ask what the app should be called and what it is for, then stop.

## 1. Gather context

- `getBaseInfo`: the base the app will live in.
- `getTablesList`, then `getTableSchema` for each table the app needs (match the user's description to table titles; ask if unclear). Note the table ids and, if a specific view fits, its view id.
- `listIntegrations` only if the app should talk to an outside service; use the integration slug as `provider`.

## 2. Draft the app

| Field | Value |
|---|---|
| `name` | The app name from `$ARGUMENTS`. |
| `slug` | Lowercase, dash-separated from the name (e.g. `sales-tracker`). Must be unique. |
| `type` | What the user calls it; default `custom`. |
| `icon`, `description` | Optional; write a one-line description from the user's words. |
| `config` | Only these keys are accepted (anything else is rejected): |

```json
{
  "theme": { "primaryColor": "#2563eb", "backgroundColor": "#ffffff", "darkMode": false, "logoUrl": "" },
  "navigation": { "items": [{ "title": "Orders", "icon": "list", "route": "/orders", "roles": ["editor"] }] },
  "features": { "enableComments": false, "enableSharing": false, "enableExport": true },
  "dataSources": [{ "tableId": "<id>", "viewId": "<id>", "permissions": { "canCreate": true, "canRead": true, "canUpdate": true, "canDelete": false } }],
  "integrations": [{ "provider": "<integration slug>", "connectionId": "<optional>", "settings": {} }],
  "settings": {}
}
```

Use only table and view ids you got from the tools; never invent them. Give each data source the narrowest permissions the app needs (`canDelete: false` unless asked). Add one navigation item per main screen.

## 3. Confirm and create

Show the draft (name, slug, type, the tables with their permissions, the integrations, the navigation) and get a yes. Then call `createMiniApp`.

- `MiniApp with slug '...' already exists`: suggest a new slug, confirm, retry.
- `Invalid miniApp config schema`: fix the reported key and retry.

Report the created app's id and slug.
