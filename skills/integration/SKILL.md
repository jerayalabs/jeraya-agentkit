---
name: integration
description: List Jeraya integrations, or show one integration's functions
argument-hint: [integration name]
disable-model-invocation: true
---

Use the Jeraya MCP connector.

- If `$ARGUMENTS` is empty: call `listIntegrations` and show a markdown table (Slug, Name, Description, Actions, Triggers, Auth required), with the total count below.
- If `$ARGUMENTS` is set: find the matching integration slug via `listIntegrations` (case-insensitive on slug or name), then call `getIntegrationFunctions` with that slug and list its functions. Use `integrationFunctionDetails` only if the user asks about one function. If nothing matches, suggest the closest names.

Do not call `execute-integration` unless the user explicitly asks to run something.
