---
name: script
description: Read a Jeraya script module, or run one of its functions
argument-hint: <module id> [function name]
disable-model-invocation: true
---

Use the Jeraya MCP connector. There is no tool to list script modules, so a module id is required.

- If `$ARGUMENTS` is empty: ask the user for a script module id and stop.
- First word = module id. Call `readScriptModule` with it and show the source and the exported function names.
- If a second word is given, it is the function name: confirm the inputs with the user, then call `runScript` (`module_id`, `scriptName`, `inputs` as an object). `runScript` can have side effects, so never run it without that confirmation.
