export const evaluateExpression = (expression: string, angleUnit: 'DEG' | 'RAD'): string => {
  if (!expression.trim()) return '';

  // Sanitize input to allow only math-safe characters
  // Allow numbers, operators, parenthesis, math functions, dot, and common constants
  const sanitized = expression.replace(/[^0-9+\-*/().^%a-z\s]/gi, '');

  try {
    // Create a context with Math properties
    const mathContext: any = Object.getOwnPropertyNames(Math).reduce((acc, key) => {
      acc[key] = (Math as any)[key];
      return acc;
    }, {} as any);

    // Add custom handlers for degrees/radians if needed
    // For sin, cos, tan, we need to intercept them if mode is DEG
    if (angleUnit === 'DEG') {
      mathContext.sin = (d: number) => Math.sin(d * (Math.PI / 180));
      mathContext.cos = (d: number) => Math.cos(d * (Math.PI / 180));
      mathContext.tan = (d: number) => Math.tan(d * (Math.PI / 180));
      mathContext.asin = (v: number) => Math.asin(v) * (180 / Math.PI);
      mathContext.acos = (v: number) => Math.acos(v) * (180 / Math.PI);
      mathContext.atan = (v: number) => Math.atan(v) * (180 / Math.PI);
    }

    // Replace '^' with '**' for power
    // Note: simple regex replacement for ^ might be risky for complex nested expressions without a parser,
    // but for a standard calculator input sequence it usually works.
    // A safer way for scientific notation like 10^2 is using Math.pow, but standard JS supports **
    const executableExpr = sanitized
      .replace(/\^/g, '**')
      .replace(/ln\(/g, 'log(') // Math.log is natural log
      .replace(/log\(/g, 'log10(') // Math.log10 is base 10
      .replace(/π/g, 'PI')
      .replace(/e/g, 'E')
      .replace(/√\(/g, 'sqrt(');

    // Use Function constructor to create a sandbox
    // We wrap keys in 'Math.' if they exist in Math object and aren't already handled
    // But since we passed mathContext variables as arguments to the function, we can use them directly if we map them.
    
    const keys = Object.keys(mathContext);
    const values = Object.values(mathContext);

    const fn = new Function(...keys, `"use strict"; return (${executableExpr})`);
    const result = fn(...values);

    // Format result
    if (Math.abs(result) < 1e-10 && Math.abs(result) > 0) {
       return result.toExponential(4);
    }
    
    if (result.toString().length > 12) {
      return Number(result).toPrecision(10).replace(/\.?0+$/, "");
    }

    return String(Math.round(result * 10000000000) / 10000000000); // Precision fix
  } catch (error) {
    console.error("Math evaluation error:", error);
    throw new Error("Invalid Expression");
  }
};