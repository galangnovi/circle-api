import { Request, Response } from "express";
import { editProfile, myProfile } from "../services/profile";


export const handlerMyProfile = async (req:Request, res:Response) =>{
    try{
    const user_id = (req as any).session.user.user_id
    if (!user_id) throw new Error ("user tidak ditemukan")
    const result = await myProfile(user_id)
    
    return res.status(200).json({
            code: 200,
            status: "success",
            message: "Data Profile ditemukan",
            data: result,
            });

    } catch (err: any) {
        return res.status(500).json({
            code: 500,
            status: "error",
            message: err.message || "profil tidak ditemukan",
            });
  };
} 


export const handlerEditProfile = async (req:Request, res:Response) => {
    try {
        const user_id = (req as any).session.user.user_id
         if (!user_id) throw new Error ("user tidak ditemukan")
        
        const {email, username, full_name, bio} = req.body
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        const photo_profile = files['photo_profile']?.[0]?.filename ?? null;
        const cover_Photo = files['cover_Photo']?.[0]?.filename ?? null;

        const result = await editProfile(user_id, email, username, full_name, bio, photo_profile, cover_Photo)
        return res.status(200).json({
            code: 200,
            status: "success",
            message: "Data Profile berhasil dirubah",
            data: result,
            });

    } catch (err: any) {
        return res.status(500).json({
            code: 500,
            status: "error",
            message: err.message || "profil tidak ditemukan",
            });
  };
}