import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import AccountUser from "../models/account-user.model";
import AccountCompany from "../models/account-company.model";
import { AccountRequest } from "../interfaces/request.interface";

export const verifyTokenUser = async (req: AccountRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            res.json({
                code: "error",
                message: "Vui lòng gửi kèm theo token!"
            });
            return;
        }

        const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as jwt.JwtPayload; // Giải mã token
        const { id, email } = decoded;

        const existAccount = await AccountUser.findOne({
            _id: id,
            email: email
        });

        if (!existAccount) {
            res.clearCookie("token");
            res.json({
                code: "error",
                message: "Token không hợp lệ!"
            });
            return;
        }

        req.account = existAccount;

        next();
    } catch (error) {
        res.clearCookie("token");
        res.json({
            code: "error",
            message: "Token không hợp lệ!"
        });
    }
}
export const verifyTokenCompany = async (req: AccountRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            res.json({
                code: "error",
                message: "Vui lòng gửi kèm theo token!"
            });
            return;
        }

        const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as jwt.JwtPayload; // Giải mã token
        const { id, email } = decoded;

        const existAccount = await AccountCompany.findOne({
            _id: id,
            email: email
        });

        if (!existAccount) {
            res.clearCookie("token");
            res.json({
                code: "error",
                message: "Token không hợp lệ!"
            });
            return;
        }

        req.account = existAccount;

        next();
    } catch (error) {
        res.clearCookie("token");
        res.json({
            code: "error",
            message: "Token không hợp lệ!"
        });
    }
}

