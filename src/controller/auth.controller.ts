// auth.controller.ts
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
import { UserMapper } from "../mapper/user.mapper";


const prisma = new PrismaClient();


export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ status: 400, message: "Email and password are required" });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({status: 401, message: "Credentials not valid" });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ message: "Credentials not valid" });
  } 

  const accessToken = jwt.sign(UserMapper.fromEntitytoUserResponse(user), JWT_SECRET, { algorithm: "HS256", expiresIn: "1h" });
  res.json({ access_token: accessToken, token_type: "Bearer", expires_in: 3600 });
};
