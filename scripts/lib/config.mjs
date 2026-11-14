// User-level Jeraya config shared by every agent adapter: ~/.jeraya/config.json {"mcpUrl","token"}.
// Env vars JERAYA_MCP_URL / JERAYA_MCP_TOKEN override the file.
import { mkdir, writeFile, readFile, chmod } from 'node:fs/promises';
import { join } from 'node:path';
import { homedir } from 'node:os';

export const configDir = join(homedir(), '.jeraya');
export const configFile = join(configDir, 'config.json');

export async function loadConfig() {
  let file = {};
  try { file = JSON.parse(await readFile(configFile, 'utf8')); } catch {}
  return {
    mcpUrl: process.env.JERAYA_MCP_URL || file.mcpUrl,
    token: process.env.JERAYA_MCP_TOKEN || file.token,
  };
}

// Returns the cleaned URL string, or throws with a user-facing message.
export function checkMcpUrl(mcpUrl) {
  let u;
  try { u = new URL(mcpUrl); } catch {}
  if (!u || !/^\/mcp\/[^/]+\/?$/.test(u.pathname)) {
    throw new Error('The MCP URL should look like https://api.jeraya.com/mcp/<id>');
  }
  if (u.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(u.hostname)) {
    throw new Error('The MCP URL must be https.');
  }
  u.search = ''; // never keep a token in the URL
  u.hash = '';
  return u.toString();
}

export async function saveConfig({ mcpUrl, token }) {
  await mkdir(configDir, { recursive: true, mode: 0o700 });
  await writeFile(configFile, JSON.stringify({ mcpUrl, token }, null, 2), { mode: 0o600 });
  await chmod(configFile, 0o600);
  return configFile;
}
