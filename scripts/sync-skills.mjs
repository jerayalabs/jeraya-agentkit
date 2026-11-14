#!/usr/bin/env node
// Download every ACTIVE Jeraya skill and write it as a user-level Agent Skill:
//   <skills dir>/jeraya-<slug>/SKILL.md
// Default skills dir is ~/.claude/skills (Claude Code, user level: loaded in every project and
// kept across plugin updates). Other agents can pass --dir, e.g. --dir ~/.config/opencode/skills.
// Each SKILL.md only tells the agent to fetch the real instructions from the Jeraya MCP.
// Only folders holding a .jeraya marker are ever deleted, so the user's own skills are safe.
//
// Flags: --quiet  (SessionStart hook: never fails; prints the setup hint when not configured)
//        --dir <path>
import { mkdir, rm, writeFile, readdir, access } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { homedir } from 'node:os';
import { loadConfig } from './lib/config.mjs';
import { createMcpClient } from './lib/mcp-client.mjs';

const args = process.argv.slice(2);
const quiet = args.includes('--quiet');
const dirArg = args[args.indexOf('--dir') + 1];
const skillsDir = args.includes('--dir') && dirArg
  ? resolve(dirArg.replace(/^~(?=$|\/)/, homedir()))
  : join(homedir(), '.claude', 'skills');
const MARKER = '.jeraya';
const log = (m) => !quiet && console.log(m);

const slug = (s) =>
  String(s).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'skill';
const oneLine = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();

async function main() {
  const { mcpUrl, token } = await loadConfig();
  if (!mcpUrl || !token) {
    // Optional local mirror of skills; the MCP connection itself uses OAuth
    // (see /jeraya:setup), so there is nothing to nag about here.
    log('No ~/.jeraya/config.json: skipping the local skill sync.');
    return;
  }

  const { skills = [] } = await createMcpClient({ mcpUrl, token }).callTool('listSkills');
  const active = skills.filter((s) => s.status === 'ACTIVE');

  // Only touch the folder after a successful fetch, so a network failure keeps the old skills.
  await mkdir(skillsDir, { recursive: true });
  for (const d of await readdir(skillsDir)) {
    const owned = await access(join(skillsDir, d, MARKER)).then(() => true, () => false);
    if (owned) await rm(join(skillsDir, d), { recursive: true, force: true });
  }

  const used = new Set();
  for (const s of active) {
    const base = `jeraya-${slug(s.name)}`.slice(0, 64).replace(/-+$/, '');
    let name = base;
    for (let i = 2; used.has(name); i++) name = `${base}-${i}`;
    used.add(name);
    const dir = join(skillsDir, name);
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, MARKER), 'Managed by the Jeraya plugin. Re-created on every sync.\n');
    await writeFile(
      join(dir, 'SKILL.md'),
      [
        '---',
        `name: ${name}`,
        `description: ${JSON.stringify(oneLine(s.description) || `Jeraya skill: ${oneLine(s.name)}`)}`,
        '---',
        '',
        `This is the Jeraya skill ${JSON.stringify(oneLine(s.name))}. Its instructions live on the Jeraya server.`,
        '',
        `Call the Jeraya MCP tool \`skill-details\` with \`skill_name\` = ${JSON.stringify(oneLine(s.name))},`,
        'then follow the instructions it returns. If the Jeraya MCP is not connected, tell the user to run `/jeraya:setup`.',
        '',
      ].join('\n'),
    );
  }
  log(`Synced ${active.length} active Jeraya skill(s) (of ${skills.length}) to ${skillsDir}`);
}

main().catch((e) => {
  if (quiet) process.exit(0); // never break a session start
  console.error(`Jeraya skill sync failed: ${e.message}`);
  process.exit(1);
});
