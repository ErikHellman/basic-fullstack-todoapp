import { Credentials } from "@my-todo-app/shared";
import { NextFunction, Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";
import { loadUserByUsername, UserInfo } from "../models/user-repository";

const secret: string =
  process.env.TOKEN_SECRET ||
  "f9daa8f6d9ec89bd339e1fa53ae744d98e8170d822f2f014ed0a5f49d392059ee1210953f28e1a535e0980c73750cb077b95c8fa3a676bbf2907e86f8dc8b741";
const JWT_COOKIE_NAME = "jwt";

export type TokenPayload = {
  sub: string;
  name: string;
  roles: string[];
};

export interface JwtRequest<T> extends Request<T> {
  jwt?: TokenPayload;
}

export const authenticateToken = (
  req: JwtRequest<any>,
  res: Response,
  next: NextFunction
) => {
  const token: string | undefined = req.header("authorization")?.split(" ")[1];

  if (token) {
    try {
      const decoded = jsonwebtoken.verify(token, secret) as TokenPayload;
      req.jwt = decoded;
    } catch (err) {
      return res.sendStatus(403); // Bad token!
    }
  } else {
    return res.sendStatus(401); // No token! Unauthorized!
  }

  next();
};

export const loginUser = async (
  req: JwtRequest<Credentials>,
  res: Response<string>
) => {
  const credentials = req.body;

  const userInfo = await performUserAuthentication(credentials);
  if (!userInfo) {
    return res.sendStatus(403);
  }

  console.log("Got credentials:", credentials);
  const token = jsonwebtoken.sign(
    { sub: userInfo.username, name: userInfo.name, roles: userInfo.roles },
    secret,
    { expiresIn: "1800s" }
  );
  res.send(token);
  return res.sendStatus(200);
};

const performUserAuthentication = async (
  credentials: Credentials
): Promise<UserInfo | null> => {
  const userInfo = await loadUserByUsername(credentials.username);
  // TODO Use bcrypt to check that password is maching
  return userInfo;
};
