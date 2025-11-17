import jwt from "jsonwebtoken";
import crypto from "crypto";
import env from "../config/env.js";
import type { User } from "../types/credentials.js";
import type { UUIDTypes } from "uuid";

const { jwtSecret } = env;

class Tokens {
  static access(user: User): string {
    const { userId, roleId, isVerified } = user;
    return jwt.sign(
      {
        userId,
        roleId,
        isVerified,
      },
      jwtSecret as string,
      { expiresIn: "1h" }
    );
  }

  static refresh(userId: UUIDTypes): string {
    return jwt.sign({ userId }, jwtSecret as string, { expiresIn: "7d" });
  }

  static secure(userId: UUIDTypes, secret: string): string {
    const random = crypto.randomBytes(32).toString("hex");
    const timeStamp = Date.now();
    const hmac = crypto
      .createHmac("sha256", secret)
      .update(`${userId}.${random}.${timeStamp}`)
      .digest("hex");

    return `${random}.${userId}.${timeStamp}.${hmac}`;
  }

  static validate(
    token: string,
    secret: string,
    expire: number
  ): string | boolean {
    const split = token.split(".");

    if (split.length !== 4) return false;

    const [random, userId, timeStamp, hmac] = split;
    const now = Date.now();

    if (!userId) return false;

    if (Number(now) - Number(timeStamp) > Number(expire)) return false;

    const validHmac = crypto
      .createHmac("sha256", secret)
      .update(`${userId}.${random}.${timeStamp}`)
      .digest("hex");

    if (validHmac !== hmac) return false;

    return userId;
  }
}

export default Tokens;
