---
name: table
description: List Jeraya tables, show a table's fields and records, query, count or aggregate them, and create, update or delete records or tables
argument-hint: [table name] [what to do]
disable-model-invocation: true
---

Use the Jeraya MCP connector. All tools work on the base the user connected.

## Resolve the table

Tools take a `tableId`, never a name. Call `getTablesList` and match `$ARGUMENTS`' first words to a table title (case-insensitive, then closest match). If several match, ask which one. If none match, list the closest titles and stop.

## No arguments

Call `getTablesList` and show a markdown table (Title, Id, Description), with the total count below.

## Table name only

1. `getTableSchema` with the `tableId`: show the fields (Title, Type, Id) and the views (Title, Id).
2. `countRecords` for the total.
3. `queryRecords` with `pageSize: 5` and `sort: []` for a sample, shown as a markdown table.

## Table name + a request

Read the schema first (`getTableSchema`) so field names and ids are exact, then pick the tool:

| Request | Tool | Notes |
|---|---|---|
| Find / list / filter / sort rows | `queryRecords` | `where` uses `(field,op,value)`, e.g. `(Status,eq,Open)~and(Amount,gt,100)`. `sort` is required: pass `[]` for none, or `[{ field, description: "asc" \| "desc" }]` (the direction key is `description`). `fields` limits columns. `pageSize` max 200; page with `page`. |
| How many | `countRecords` | Same `where` syntax. |
| Sum / avg / min / max / unique / % filled, earliest date... | `aggregate_single` | `aggregations: [{ field, type }]`, where `field` is the field **Id** from the schema, not its title. Optional `where`, `viewId`. |
| One row by id | `getRecord` | `recordId`; `fields` is a comma-separated string. |
| Read a file in an Attachment field | `readAttachment` | Pass the attachment objects exactly as returned in the record. |
| Add rows | `createRecords` | `records: [{ fields: { "<Field title>": value } }]`. |
| Change rows | `updateRecords` | `records: [{ id, fields: { ... } }]`. Find the ids with `queryRecords` first. |
| Remove rows | `deleteRecords` | `records: [{ id }]`. |

Writes:
- `createRecords` and `updateRecords`: show the rows you are about to write and get a yes first.
- `deleteRecords`: show the exact rows (via `queryRecords` / `getRecord`), say it cannot be undone, and only delete after an explicit yes. Never delete by a filter you have not shown.
- These tools need Editor access or higher. If they are missing, say the user's role in this base does not allow writes.

## Create a table

If the user asks for a new table and the `createTable` tool is available:
1. Propose a title and columns (`[{ title, uidt }]`; `uidt` e.g. SingleLineText, LongText, Number, Checkbox, Date, SingleSelect). Id and Title columns are added automatically.
2. For a folder: `listMenu` to find its id, or `createMenuGroup` to make one, then pass it as `parentId`.
3. Confirm, then call `createTable`. `moveMenuItem` / `renameMenuItem` reorganise the sidebar afterwards.

If `createTable` is not available, say this Jeraya server cannot create tables yet and the user should create it in the app.

Show results as markdown tables. Report errors from a tool as they came back.
