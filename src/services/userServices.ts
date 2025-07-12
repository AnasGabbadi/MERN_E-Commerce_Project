import userModel from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface RegisterParams {
    userName: String,
    email: string,
    password: string
};

export const register = async ({userName, email, password}: RegisterParams) => {
    try {
        const findUser = await userModel.findOne({email});

        if (findUser) {
            return {data: 'User already exists!', statusCode: 400};
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({email, password: hashedPassword, userName});
        await newUser.save();

        return {data: generateJWT({userName, email}), statusCode: 200};
    } catch (error) {
        console.error("Error in register:", error);
        return {data: "Internal Server Error", statusCode: 500};
    }
};

interface LoginParams {
    email: string,
    password: string
};

export const login = async ({email, password}: LoginParams) => {
    try {
        const findUser = await userModel.findOne({email});

        if (!findUser) {
            return {data: 'Incorrect email or password!', statusCode: 400};
        }

        const passwordMatch = await bcrypt.compare(password, findUser.password);

        if (passwordMatch) {
            return {data: generateJWT({email, userName: findUser.userName}), statusCode: 200};
        }

        return {data: 'Incorrect email or password!', statusCode: 400};
    } catch (error) {
        console.error("Error in login:", error);
        return {data: "Internal Server Error", statusCode: 500};
    }
};

const generateJWT = (data: any) => {
    return jwt.sign(data, process.env.JWT_SECRET || '');
};
