import userModel from "../models/userModel"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface RegisterParams {
    userName: String,
    email: string,
    password: string
};

export const register = async ({userName, email, password}: RegisterParams) => {
    const findUser = await userModel.findOne({email})

    if (findUser) {
        return {data: 'User aleardy exists!', statusCode: 400}
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({email, password: hashedPassword, userName})
    await newUser.save()

    return {data: generateJWT({userName, email}), statusCode: 200};
};

interface LoginParams {
    email: string,
    password: string
};

export const login = async ({email, password}: LoginParams) => {
    const findUser = await userModel.findOne({email})

    if (!findUser) {
        return {data: 'Incorrect email and password!', statusCode: 400}
    }

    const passwordMatch = await bcrypt.compare(password, findUser.password);
    if (passwordMatch) {
        return {data: generateJWT({email, userName: findUser.userName}), statusCode: 200};
    }

    return {data: 'Incorrect email and password!', statusCode: 400}
};

const generateJWT = (data: any) => {
    return jwt.sign(data, 'tCmxaEJzT/xgnSxKk3YaweRjq+5eG1HPug4zsbKKIJIcc/1QKP5UeGq2B8dM+T6v');
};