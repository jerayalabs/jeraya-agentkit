---
name: record
description: Open a Jeraya record from its reference (/jeraya:record baseId,tableId,recordId, copied from the record's copy button), read its fields and Updates thread, post an update, mention members, attach files, images or videos, or change its fields. Use when the user pastes a Jeraya record reference, or asks to post an update, leave a note, notify or mention someone on a Jeraya record.
argument-hint: baseId,tableId,recordId [what to do]
---

Use the Jeraya MCP connector. All tools work on the base the user connected. If its tools are not available, tell the user to run `/jeraya:setup` and stop.

## 1. Find the record

`$ARGUMENTS` starts with a record reference, copied from the copy button at the top of a record:

```
baseId,tableId,recordId optional request
```

Example: `pq96l92fx0xu8gu,mtp990yqqpk73rl,147 tell @sara the invoice is ready` → baseId `pq96l92fx0xu8gu`, tableId `mtp990yqqpk73rl`, recordId `147`, request `tell @sara the invoice is ready`.

- Split the first word on `,`: exactly three parts. A record id with several primary keys keeps its `___` inside the third part.
- The older form `[baseId][tableId]:[recordId]` works the same way.

- The leading `/jeraya:record` may be pasted too: ignore it.
- No reference, but the user names a table and a record: find the table with `getTablesList` and the record with `queryRecords`, and confirm which one.
- `getBaseInfo` shows another base id than `baseId`: say the connector is set to another base, and that they can connect that base with `/jeraya:setup`. Stop.

## 2. Read it

1. `getTableSchema` with `tableId`: field titles, types and ids.
2. `getRecord` with `tableId` and `recordId`.
3. `listRecordUpdates` with `tableId` and `recordId`: the Updates thread, oldest first.

With no request, show the main fields as a short list, the last 3 updates (author, time, text), and ask what to do.

## 3. Post an update

Updates are the record's discussion thread (the "Updates" panel in the record). Post with `addRecordUpdate`:

| Argument | What to pass |
|---|---|
| `tableId`, `recordId` | From the reference. |
| `text` | The update, in Markdown: **bold**, lists, links, `code`. Keep it short and written for the people on the record. |
| `mentions` | User ids or emails of the people to mention. They are added at the start and notified. |
| `files` | Files to attach: `[{ url, fileName, mimeType }]` or `[{ data, fileName, mimeType }]`. |

**Mentions.** Resolve every name with `listBaseMembers` (`search` with part of the name or email). Pass the member's `id` in `mentions`. When a name matches several people, or nobody, ask. Never guess. To mention someone in the middle of the text, write their `mention` token from `listBaseMembers`, e.g. `@(usr123|sara@acme.com|Sara)`.

**Files, images and videos.** Images and videos are shown inline in the update; other files (PDF, docs, sheets, zip...) as a download link. Each file is uploaded to Jeraya storage, so the update keeps working after the source is gone.
- A file on the web: pass its public `url` (http or https).
- A local file: read it and pass `data` as a data URI, `data:<mime>;base64,<content>`. Get the base64 with `base64 -i <file>` (macOS) or `base64 -w0 <file>` (Linux). Always set `fileName` with the extension and `mimeType` (`image/png`, `image/jpeg`, `video/mp4`, `application/pdf`...).
- Keep `data` files small, up to about 5 MB. For a larger file, especially a video, ask the user for a public link, or to add it in the app.
- A screenshot or image you made: save it to a file first, then send it as `data`.

Before posting, show the text, who is mentioned and the files, and get a yes, unless the user gave the exact text and asked you to post it. After posting, say it was posted and who was notified.

## 4. Change the record

For field changes, use `updateRecords` with `records: [{ id: recordId, fields: { "<Field title>": value } }]`, using the exact field titles from the schema. Show the old and new values and get a yes first. To write the record's document body, use the `content` field in Markdown. Don't put updates there.

## Notes

- `addRecordUpdate` needs Commenter access or higher, and `updateRecords` needs Editor or higher. If a tool is missing, say the user's role in this base does not allow it.
- Report errors from a tool as they came back.
