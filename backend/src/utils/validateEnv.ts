import { cleanEnv, port, str, num, url, bool } from "envalid";

export function validateEnv() {
  cleanEnv(process.env, {
    PORT: port(),
    NODE_ENV: str({ choices: ["development", "production"] }),
    DATABASE_URL: url(),
    SESSION_SECRET: str(),
    BCRYPT_SALT_ROUNDS: num(),
    REDIS_URL: str({ default: "" }),
    GEMINI_API_KEY: str({ default: "" }),
  });
}
