import { randomBytes } from "crypto";

const jwtSecret = process.env.JWT_SECRET ?? randomBytes(32).toString('base64');

export default function getJWTSecret(): string {
    return jwtSecret;
}
