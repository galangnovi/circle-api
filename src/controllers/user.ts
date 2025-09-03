import { Request, Response } from "express";
import { recomendationUser, searchUser } from "../services/user";
import { verifyToken } from "../utils/jwt-utils";


export const handlerSearchuser = async (req:Request, res:Response) =>{
    try{
    const user_id = (req as any).session.user.user_id
    const keyword = (req as any).query.keyword
    if (!user_id) throw new Error ("user id tidak ditemukan")
    if(!keyword) throw new Error ("keyword tidak ditemukan")
    const result = await searchUser(user_id, keyword)
    
    return res.status(200).json({
            code: 200,
            status: "success",
            message: "User Ditemukan",
            data: result,
            });

    } catch (err: any) {
        return res.status(500).json({
            code: 500,
            status: "error",
            message: err.message || "Failed to fetch user data. Please try again later.",
            });
  };
} 


export const handlerRecomendation = async (req:Request, res:Response) => {
    try{
        const user_id = (req as any).session.user.user_id
        if (!user_id) throw new Error ("user id tidak ditemukan")
        
        const result = await recomendationUser(user_id)
        return res.status(200).json({
            code: 200,
            status: "success",
            message: "User Ditemukan",
            data: result,
            });
    } catch (err: any) {
        return res.status(500).json({
            code: 500,
            status: "error",
            message: err.message || "Failed to fetch user data. Please try again later.",
            });
    }
}

export const handlerisuserActive = async(req:Request, res: Response) =>{
        try {
    const token = req.cookies.token;
    if (!token) return res.json(null);

    const userSession = (req as any).session?.user;

   if (!userSession || !token) {
      return res.json(null);
    }

    return res.json({
      token,
      user: userSession
    });
  } catch (error) {
    console.error("Error in handlerisuserActive:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
}