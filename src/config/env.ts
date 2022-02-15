import * as typedDotenv from 'typed-dotenv';

const dotEnv = typedDotenv.config({
  debug: false,
});

if (dotEnv.error) {
  console.error(dotEnv.error);
}

export const env = dotEnv.env as Env;

type Env = {
  NODE_ENV: string;
  ALTAIR_ENABLED: boolean;
  PORT: number;
  HOST: string;
  LOG_PRETTY_PRINT: boolean;
  LOG_LEVEL: string;
  DB_URL: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_PASS: string;
  JWT_SECRET: string;
  TOKEN_TTL: string;
  TEMP_PASS_LEN: number;
  MAILGUN_DOMAIN: string;
  MAILGUN_API_KEY: string;
  MAILGUN_FROM_EMAIL: string;
  MAILGUN_FROM_NAME: string;
  FILE_STORAGE_URL: string;
  FILE_STORAGE_DIR: string;
  [key: string]: any;
};

module.exports = { env };
