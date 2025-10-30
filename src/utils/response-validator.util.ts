export function validateResponseBody(actual: string, expected?: string): boolean {
  if (!expected) return true;
  try {
    const actualParsed = JSON.parse(actual);
    const expectedParsed = JSON.parse(expected);
    return JSON.stringify(actualParsed) === JSON.stringify(expectedParsed);
  } catch {
    return actual === expected;
  }
}

export function validateResponseHeaders(
  actual: Record<string, string>,
  expected?: Record<string, string>
): { valid: boolean; errors: string[] } {
  if (!expected) return { valid: true, errors: [] };
  
  const errors: string[] = [];
  for (const [key, value] of Object.entries(expected)) {
    const actualValue = actual[key]?.toLowerCase();
    const expectedValue = value.toLowerCase();
    if (actualValue !== expectedValue) {
      errors.push(`Header ${key}: expected "${value}", got "${actual[key]}"`);
    }
  }
  
  return { valid: errors.length === 0, errors };
}

