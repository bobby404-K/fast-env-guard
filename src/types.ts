export type EnvType = 'string' | 'number' | 'boolean' | 'url' | 'email' | 'port';

export interface EnvRule<T = any> {
  type: EnvType;
  required?: boolean;
  default?: T;
  secret?: boolean;
  choices?: T[];
  validate?: (val: T) => boolean | string;
}

export type EnvSchema = Record<string, EnvRule>;

export interface ValidationResult<T> {
  success: boolean;
  data: T;
  errors: Array<{ key: string; message: string }>;
  masked: Record<string, string>;
}
