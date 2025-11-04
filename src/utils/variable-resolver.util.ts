/**
 * Variable resolver utility - Postman style {{variable}} syntax
 */

export interface VariableContext {
  [key: string]: string | number | boolean;
}

/**
 * Resolves variables in a string using {{variable}} syntax
 * @param template - Template string with {{variable}} placeholders
 * @param context - Variable context object
 * @returns Resolved string with variables replaced
 */
export function resolveVariables(template: string, context: VariableContext): string {
  if (!template || typeof template !== 'string') {
    return template;
  }

  return template.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
    const value = context[varName];
    if (value === undefined || value === null) {
      return match; // Keep original if variable not found
    }
    return String(value);
  });
}

/**
 * Resolves variables in an object recursively
 */
export function resolveVariablesInObject<T extends Record<string, any>>(
  obj: T,
  context: VariableContext
): T {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => resolveVariablesInObject(item, context)) as unknown as T;
  }

  const resolved: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      resolved[key] = resolveVariables(value, context);
    } else if (typeof value === 'object' && value !== null) {
      resolved[key] = resolveVariablesInObject(value, context);
    } else {
      resolved[key] = value;
    }
  }

  return resolved as T;
}

/**
 * Extracts all variable names from a template string
 */
export function extractVariables(template: string): string[] {
  const matches = template.match(/\{\{(\w+)\}\}/g);
  if (!matches) return [];
  
  return matches.map(match => match.replace(/\{\{|\}\}/g, ''));
}

/**
 * Checks if a string contains variables
 */
export function hasVariables(str: string): boolean {
  return /\{\{(\w+)\}\}/.test(str);
}

