import crypto from "crypto";
import process from "process";
require('dotenv').config()

export const random = () => crypto.randomBytes(128).toString('base64')

export const authentications = (salt: string, password: string) => {
    return crypto.createHmac('sha256', [salt, password].join('/')).update(process.env.SECRET).digest()
}