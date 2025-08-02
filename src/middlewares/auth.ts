import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt-utils";

export function authenticate(req:Request, res:Response, next:NextFunction) {
    const token = req.cookies.token;
    console.log(req.cookies.token)

    console.log("di middleware", (req as any).session.user)
    if(!token){
        res.status(401).json({message:"Unauthorized"});
        return
    }
    try{
        const userToken = verifyToken(token);
        const userSession = (req as any).session.user
        if(!userSession) throw new Error ("Kamu belum login atau sudah logout")
        if(userSession.user_id !== userToken.id) 
            throw new Error("user token tidak cocok");
         (req as any).user = userSession;
        next()
    
    } catch (err:any){res.status(401).json({ message: err.message || "authentifikasi gagal" });}
}
