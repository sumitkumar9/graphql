import { createHmac, randomBytes } from "node:crypto";
import Jwt from "jsonwebtoken";
import { prismaClient } from "../lib/db";

export interface CreateUserInterface {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface GetUserTokenPayload {
    email: string;
    password: string;
}

const JWT_SECRET = "hiithisatest";

export class UserService {

    static generateHash(salt: string, password:string) {
        const hashedPassword = createHmac("sha256", salt).update(password).digest("hex");
        return hashedPassword;
    }

    static getUserByEmail(email: string) {
        return prismaClient.user.findUnique({ where: {email}});
    }

    static getUserById(id: string) {
        return prismaClient.user.findUnique({ where: {id}})
    }
    static createUser(payload: CreateUserInterface) {
        const { firstName, lastName, email, password } = payload;
        const salt = randomBytes(32).toString("hex");
        const hashedPassword = UserService.generateHash(salt, password);
        return prismaClient.user.create({data: {
            firstName,
            lastName, 
            email,
            password: hashedPassword,
            salt,
        }})
    }

    static async getUserToken(payload: GetUserTokenPayload) {
        const { email, password } = payload;
        const user = await UserService.getUserByEmail(email);
        if (!user) throw new Error("user not found");
        
        const userHashPassword = UserService.generateHash(user.salt, password); 

        if (userHashPassword !== user.password) throw new Error("incorrect passowrd");
        const token = Jwt.sign({email: user.email, id: user.id}, JWT_SECRET);
        return token;

    }

    static decodeToken(token: string) {
        return Jwt.verify(token, JWT_SECRET);
    }
}