import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string().url(),
  API_BASE_URL: z.string().url(),
  AUTH_REDIRECT_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
