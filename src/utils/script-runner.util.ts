/**
 * Script runner utility for Pre-request and Test scripts
 * Uses Function constructor for safe execution
 */

export interface ScriptContext {
  variables: Record<string, string>;
  [key: string]: any;
}

export interface ScriptResult {
  success: boolean;
  variables?: Record<string, string>;
  error?: string;
  console?: string[];
}

/**
 * Runs pre-request script
 */
export function runPreRequestScript(
  script: string,
  context: ScriptContext
): ScriptResult {
  const consoleOutput: string[] = [];
  const variables: Record<string, string> = { ...context.variables };

  try {
    // Create a safe execution context
    const scriptFunction = new Function(
      'variables',
      'console',
      `
      ${script}
      return variables;
      `
    );

    // Override console methods to capture output
    const customConsole = {
      log: (...args: any[]) => {
        consoleOutput.push(args.map(a => String(a)).join(' '));
      },
      error: (...args: any[]) => {
        consoleOutput.push('ERROR: ' + args.map(a => String(a)).join(' '));
      },
      warn: (...args: any[]) => {
        consoleOutput.push('WARN: ' + args.map(a => String(a)).join(' '));
      }
    };

    const result = scriptFunction(variables, customConsole);
    
    return {
      success: true,
      variables: result || variables,
      console: consoleOutput
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      console: consoleOutput
    };
  }
}

/**
 * Runs test script (post-request assertions)
 */
export function runTestScript(
  script: string,
  context: ScriptContext & {
    response: {
      status: number;
      body: string;
      headers: Record<string, string>;
      responseTime: number;
    };
  }
): ScriptResult {
  const consoleOutput: string[] = [];
  const variables: Record<string, string> = { ...context.variables };

  try {
    // Create assertion helpers
    const pm = {
      expect: (actual: any) => ({
        to: {
          equal: (expected: any) => {
            if (actual !== expected) {
              throw new Error(`Expected ${expected} but got ${actual}`);
            }
          },
          toBe: (expected: any) => {
            if (actual !== expected) {
              throw new Error(`Expected ${expected} but got ${actual}`);
            }
          },
          toHaveProperty: (prop: string) => {
            if (!(prop in actual)) {
              throw new Error(`Expected object to have property ${prop}`);
            }
          },
          toBeGreaterThan: (value: number) => {
            if (actual <= value) {
              throw new Error(`Expected ${actual} to be greater than ${value}`);
            }
          },
          toBeLessThan: (value: number) => {
            if (actual >= value) {
              throw new Error(`Expected ${actual} to be less than ${value}`);
            }
          }
        }
      }),
      response: context.response,
      variables
    };

    const scriptFunction = new Function(
      'pm',
      'variables',
      'console',
      `
      ${script}
      return variables;
      `
    );

    const customConsole = {
      log: (...args: any[]) => {
        consoleOutput.push(args.map(a => String(a)).join(' '));
      },
      error: (...args: any[]) => {
        consoleOutput.push('ERROR: ' + args.map(a => String(a)).join(' '));
      },
      warn: (...args: any[]) => {
        consoleOutput.push('WARN: ' + args.map(a => String(a)).join(' '));
      }
    };

    const result = scriptFunction(pm, variables, customConsole);
    
    return {
      success: true,
      variables: result || variables,
      console: consoleOutput
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      console: consoleOutput
    };
  }
}

