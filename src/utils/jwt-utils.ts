import jwt from "jsonwebtoken"
import CryptoJS from "crypto-js";

const JWT_SECRET = process.env.JWT_SECRET as string || "data_aman"
const ENC_SECRET = process.env.ENC_SECRET as string || "data_terlindungi"

export interface userPayLoad{
    id : Number
    email: string
    username: string
    name: string
}

export function signEncToken(payload: userPayLoad) {
    const encPayload = CryptoJS.AES.encrypt(
        JSON.stringify(payload),
        ENC_SECRET
    ).toString();
    return jwt.sign ({data: encPayload}, JWT_SECRET, {expiresIn: "1d"})
}

export function verifyToken(token:string):userPayLoad {
    const verify= jwt.verify(token, JWT_SECRET) as any
    const decp = CryptoJS.AES.decrypt(verify.data, ENC_SECRET)
    const decrypted = decp.toString(CryptoJS.enc.Utf8)
    return JSON.parse(decrypted)
}