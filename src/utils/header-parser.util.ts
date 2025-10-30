export function parseHeaders(input: string): Record<string, string> | undefined {
  const trimmed = input.trim();
  if (!trimmed) return undefined;
  const out: Record<string, string> = {};
  for (const part of trimmed.split(',')) {
    const [k, ...rest] = part.split(':');
    if (!k || rest.length === 0) continue;
    out[k.trim()] = rest.join(':').trim();
  }
  return out;
}

export function formatHeaders(headers?: Record<string, string>): string {
  if (!headers) return '';
  return Object.entries(headers).map(([k, v]) => `${k}: ${v}`).join(', ');
}

