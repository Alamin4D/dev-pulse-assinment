import type { NextFunction, Request, Response } from "express";

const globalErrorHandler = (err: any,req: Request,res: Response,next: NextFunction) => {
  const statusCode = 500;


  res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong",
    errors: err,
  });
};


export default globalErrorHandler;