// higher order function -> returns a function

import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = () => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const token = req.headers.authorization;
			if (!token) {
				return res.status(500).json({ message: "You are not allowed!!" });
			}
			const decoded = jwt.verify(token, config.jwt_secret as string);
			req.user = decoded as JwtPayload;
			next();
		} catch (error: any) {
			res.status(500).json({
				success: false,
				message: error.message,
				error: error,
			});
		}
	};
};

export default auth;
