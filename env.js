import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

const env = process.env;

const ENV = {
  DB: {
    MONGODB_URI: env.MONGODB_URI,
    DB_NAME: env.DB_NAME,
  },
  port: env.PORT,
  CORS: env.CORS_ORIGIN,
  JWT_SECRET: env.JWT_SECRET,
  expiresIn: env.expiresIn,
  CLIENT_ID: env.CLIENT_ID,
  CLIENT_SECRET: env.CLIENT_SECRET,
  REFRESH_TOKEN: env.REFRESH_TOKEN,
  EMAIL_USER: env.EMAIL_USER,
};

export default ENV;
