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
  PORT: number;
  HOST: string;
  PRETTY_PRINT: boolean;
  LOG_LEVEL: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_PASS: string;
  JWT_SECRET: string;
  TOKEN_TTL: string;
  [key: string]: any;
};
