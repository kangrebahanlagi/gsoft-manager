// Simple Lua syntax checker
// Note: In production, you might want to use a proper Lua parser/wasm

interface SyntaxCheckResult {
  valid: boolean;
  error?: string;
  warnings: string[];
}

export async function checkLuaSyntax(content: string): Promise<SyntaxCheckResult> {
  try {
    const warnings: string[] = [];
    
    // Basic syntax checks
    if (!content.trim()) {
      return {
        valid: false,
        error: 'Empty script',
        warnings: [],
      };
    }

    // Check for common syntax errors
    const lines = content.split('\n');
    let bracketCount = 0;
    let parenCount = 0;
    let curlyCount = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Count brackets
      bracketCount += (line.match(/\[/g) || []).length;
      bracketCount -= (line.match(/\]/g) || []).length;
      
      // Count parentheses
      parenCount += (line.match(/\(/g) || []).length;
      parenCount -= (line.match(/\)/g) || []).length;
      
      // Count curly braces
      curlyCount += (line.match(/\{/g) || []).length;
      curlyCount -= (line.match(/\}/g) || []).length;

      // Check for common errors
      if (line.includes('===') || line.includes('!==')) {
        warnings.push(`Line ${i + 1}: Use '==' and '~=' for equality checks in Lua`);
      }

      if (line.includes('++') || line.includes('--')) {
        warnings.push(`Line ${i + 1}: Lua doesn't support increment/decrement operators`);
      }

      if (line.includes(';') && !line.trim().startsWith('--')) {
        warnings.push(`Line ${i + 1}: Semicolons are optional in Lua`);
      }
    }

    // Check for unbalanced delimiters
    if (bracketCount !== 0) {
      return {
        valid: false,
        error: `Unbalanced brackets: ${bracketCount > 0 ? 'missing ]' : 'extra ]'}`,
        warnings,
      };
    }

    if (parenCount !== 0) {
      return {
        valid: false,
        error: `Unbalanced parentheses: ${parenCount > 0 ? 'missing )' : 'extra )'}`,
        warnings,
      };
    }

    if (curlyCount !== 0) {
      return {
        valid: false,
        error: `Unbalanced curly braces: ${curlyCount > 0 ? 'missing }' : 'extra }'}`,
        warnings,
      };
    }

    // Check for function definitions without end
    const functionMatches = content.match(/function\s+(\w+)/g) || [];
    const endMatches = content.match(/\bend\b/g) || [];
    
    if (functionMatches.length !== endMatches.length) {
      return {
        valid: false,
        error: `Mismatched function definitions and 'end' statements`,
        warnings,
      };
    }

    return {
      valid: true,
      warnings,
    };
  } catch (error) {
    console.error('Syntax check error:', error);
    return {
      valid: false,
      error: 'Failed to check syntax',
      warnings: [],
    };
  }
}