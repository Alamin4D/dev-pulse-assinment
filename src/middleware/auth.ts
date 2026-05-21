import type { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization
            if (!token) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    success: false,
                    message: "You are not authorized",
                });
            }

            const decoded = jwt.verify(
                token,
                config.jwt_secret
            ) as JwtPayload;

            req.user = decoded;
            

            if (
                roles.length &&
                !roles.includes(decoded.role)
            ) {
                return res.status(StatusCodes.FORBIDDEN).json({
                    success: false,
                    message: "Forbidden access",
                });
            }

            next();
        } catch (error) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Invalid token",
            });
        }
    }
}

export default auth;