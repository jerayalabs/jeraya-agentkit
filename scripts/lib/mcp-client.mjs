// Minimal MCP streamable-HTTP client (no dependencies). Enough to call tools on the Jeraya server.
export function createMcpClient({ mcpUrl, token, timeoutMs = 15000 }) {
  const headers = {
    'content-type': 'application/json',
    accept: 'application/json, text/event-stream',
    authorization: `Bearer ${token}`,
  };
  let session;
  let id = 0;

  // The response is either plain JSON or an SSE stream containing the JSON-RPC message.
  const rpc = async (method, params, notify = false) => {
    const reqId = notify ? undefined : ++id;
    const res = await fetch(mcpUrl, {
      method: 'POST',
      headers: { ...headers, ...(session ? { 'mcp-session-id': session } : {}) },
      body: JSON.stringify({ jsonrpc: '2.0', method, params, ...(notify ? {} : { id: reqId }) }),
      signal: AbortSignal.timeout(timeoutMs),
    });
    session = res.headers.get('mcp-session-id') || session;
    if (res.status === 401 || res.status === 403) throw new Error('the Jeraya token was rejected');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    if (notify) return null;
    const text = await res.text();
    const json = (res.headers.get('content-type') || '').includes('text/event-stream')
      ? text.split('\n').filter((l) => l.startsWith('data:'))
          .map((l) => JSON.parse(l.slice(5))).find((m) => m.id === reqId)
      : JSON.parse(text);
    if (json?.error) throw new Error(json.error.message);
    return json?.result;
  };

  let ready;
  const init = () => (ready ??= (async () => {
    await rpc('initialize', {
      protocolVersion: '2025-03-26',
      capabilities: {},
      clientInfo: { name: 'jeraya-plugin', version: '1.0.0' },
    });
    await rpc('notifications/initialized', {}, true);
  })());

  // Calls a tool and returns its first text content parsed as JSON (or raw text).
  const callTool = async (name, args = {}) => {
    await init();
    const res = await rpc('tools/call', { name, arguments: args });
    const text = res?.content?.[0]?.text ?? '';
    if (res?.isError) throw new Error(text || `${name} failed`);
    try { return JSON.parse(text); } catch { return text; }
  };

  return { callTool };
}
