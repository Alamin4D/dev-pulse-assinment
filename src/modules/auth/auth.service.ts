import bcrypt from "bcrypt";
import { pool } from "../../db";
import type { TLoginUser, TRegisterUser } from "./auth.interface";
import config from "../../config";

const registerUserIntoDB = async (payload: TRegisterUser) => {
  const { name, email, password, role } = payload;

  const isUserExist = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );

  if (isUserExist.rows.length > 0) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    config.bcrypt_salt_rounds
  );

  const query = `
    INSERT INTO users(name, email, password, role)
    VALUES($1, $2, $3, $4)
    RETURNING id, name, email, role, created_at, updated_at
  `;

  const values = [name, email, hashedPassword, role];

  const result = await pool.query(query, values);
  console.log(result)

  return result.rows[0];
};

const loginUserFromDB = async (payload: TLoginUser) => {
  const { email, password } = payload;

  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );

  const user = result.rows[0];

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordMatched = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordMatched) {
    throw new Error("Password does not match");
  }

//   const jwtPayload = {
//     id: user.id,
//     name: user.name,
//     role: user.role,
//   };

//   const token = createToken(jwtPayload);

//   return {
//     token,
//     user: {
//       id: user.id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       created_at: user.created_at,
//       updated_at: user.updated_at,
//     },
//   };
};

export const AuthServices = {
    registerUserIntoDB,
    loginUserFromDB,
}