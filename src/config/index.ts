import dotenv from "dotenv";

dotenv.config({quiet: true});

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  jwt_secret: process.env.JWT_SECRET as string,
  bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUNDS),
};