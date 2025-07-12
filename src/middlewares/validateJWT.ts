import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel";
import {ExtendRequest} from "../types/extendedRequest";

const secretKey = "tCmxaEJzT/xgnSxKk3YaweRjq+5eG1HPug4zsbKKIJIcc/1QKP5UeGq2B8dM+T6v";

const validateJWT = (req: ExtendRequest, res: Response, next: NextFunction) => {
    const authorizationHeader = req.get('authorization');

    if (!authorizationHeader) {
        res.status(403).send("Authorization header was not provided");
        return;
    }

    const token = authorizationHeader.split(" ")[1];

    if (!token) {
        res.status(403).send("Bearer token not found");
        return;
    }

    jwt.verify(token, secretKey, async (err, payload) => {
        if (err) {
            res.status(403).send("Invalid token");
            return;
        }

        if (!payload) {
            res.status(403).send("Invalide token payload");
            return;
        }

        const userPayload = payload as {
            email: string;
            userName: string;
        };

        const user = await userModel.findOne({email: userPayload.email});
        req.user = user;
        next();
    });
};

export default validateJWT;