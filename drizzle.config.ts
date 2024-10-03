import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './libs/common/src/schema/**/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
