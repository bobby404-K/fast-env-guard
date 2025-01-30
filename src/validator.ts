import { EnvSchema, EnvType, ValidationResult } from './types.js';

export class EnvGuard {
  static parseValue(val: string | undefined, type: EnvType, def: any): any {
    if (val === undefined || val === '') return def;
    switch (type) {
      case 'number':
      case 'port': {
        const n = Number(val);
        return isNaN(n) ? NaN : n;
      }
      case 'boolean':
        return val === 'true' || val === '1' || val === 'yes';
      default:
        return val;
    }
  }

  static validate<T extends Record<string, any>>(schema: EnvSchema, source: Record<string, string | undefined> = process.env): ValidationResult<T> {
    const data: any = {};
    const masked: Record<string, string> = {};
    const errors: Array<{ key: string; message: string }> = [];

    for (const [key, rule] of Object.entries(schema)) {
      const raw = source[key];
      const parsed = this.parseValue(raw, rule.type, rule.default);

      if (rule.required && (parsed === undefined || (typeof parsed === 'number' && isNaN(parsed)))) {
        errors.push({ key, message: `Missing required environment variable: ${key}` });
        continue;
      }

      data[key] = parsed;
      masked[key] = rule.secret && parsed ? '***[REDACTED]***' : String(parsed ?? '');
    }

    return {
      success: errors.length === 0,
      data: data as T,
      errors,
      masked
    };
  }
}
