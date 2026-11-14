---
name: skill
description: List Jeraya skills, or load one by name
argument-hint: [skill name]
disable-model-invocation: true
---

Use the Jeraya MCP connector.

- If `$ARGUMENTS` is empty: call `listSkills` (no arguments) and show a markdown table (Name, Description, Status, Updated), newest first, with the total count below.
- If `$ARGUMENTS` is set: call `skill-details` with `skill_name` = `$ARGUMENTS`, then follow the skill's instructions. If it is not found, call `listSkills` and suggest the closest names.

If the connector is not available, say the Jeraya MCP is not connected and stop.
