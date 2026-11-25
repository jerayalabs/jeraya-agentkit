# Changelog

## 1.3.0

- New `/jeraya:record`: paste the reference copied from a record's copy button (`/jeraya:record baseId,tableId,recordId`) to read the record and its Updates thread, post an update, mention members, attach files, images and videos, or change its fields. The skill also loads on its own when you ask to post an update on a record.
- The `jeraya` skill knows the new record update tools: `listRecordUpdates`, `addRecordUpdate` and `listBaseMembers`.

## 1.2.2

- Add the Jeraya icon for the plugin marketplace.

## 1.2.1

- The MCP connection is now named `plugin:jeraya:mcp` (was `plugin:jeraya:jeraya`). Connected users need to sign in again once.
- New `/jeraya:table`: list tables, show a table's fields and records, query, count, aggregate, and create, update or delete records.
- New `/jeraya:app`: create a Mini App wired to your tables and integrations.
- The plugin now lives at the root of [jerayalabs/jeraya-agentkit](https://github.com/jerayalabs/jeraya-agentkit).
