import { Request, Response } from 'express'
import { DeleteLikeReply, DeleteLikeThreads, likereply, likeThreads } from '../services/likes'

export const handleLikeThreads = async (req:Request, res:Response) =>{
    try{
    const user_id = (req as any).session.user.user_id
    const thread_id = Number(req.params.id)
    if (!user_id) throw new Error ("user tidak ditemukan")
    if (!thread_id) throw new Error("threads tidak ditemukan")
     await likeThreads(user_id, thread_id)
    
    return res.status(200).json({
            code: 200,
            status: "success",
            message: "Sukses Like Thread",
            data: "Sukses Menambah Like Baru",
            });

    } catch (err: any) {
        return res.status(500).json({
            code: 500,
            status: "error",
            message: err.message || "profil tidak ditemukan",
            });
  };
} 

export const handleLikeReply = async (req:Request, res:Response) =>{
    try{
    const user_id = (req as any).session.user.user_id
    const reply_id = Number(req.params.id)
    if (!user_id) throw new Error ("user tidak ditemukan")
    if (!reply_id) throw new Error("reply tidak ditemukan")
     await likereply(user_id, reply_id)
    
    return res.status(200).json({
            code: 200,
            status: "success",
            message: "Sukses Like Reply",
            data: "Sukses Menambah Like Baru",
            });

    } catch (err: any) {
        return res.status(500).json({
            code: 500,
            status: "error",
            message: err.message || "profil tidak ditemukan",
            });
  };
} 

export const handledeleteLikeThreads = async (req:Request, res:Response) =>{
    try{
    const user_id = (req as any).session.user.user_id
    const thread_id = Number(req.params.id)
    if (!user_id) throw new Error ("user tidak ditemukan")
    if (!thread_id) throw new Error("threads tidak ditemukan")
     await DeleteLikeThreads(user_id, thread_id)
    
    return res.status(200).json({
            code: 200,
            status: "success",
            message: "Sukses Deleting",
            data: "Sukses Menghapus Like Thread",
            });

    } catch (err: any) {
        return res.status(500).json({
            code: 500,
            status: "error",
            message: err.message || "profil tidak ditemukan",
            });
  };
} 


export const handledeleteLikeReply = async (req:Request, res:Response) =>{
    try{
    const user_id = (req as any).session.user.user_id
    const reply_id = Number(req.params.id)
    if (!user_id) throw new Error ("user tidak ditemukan")
    if (!reply_id) throw new Error("reply tidak ditemukan")
     await DeleteLikeReply(user_id, reply_id)
    
    return res.status(200).json({
            code: 200,
            status: "success",
            message: "Sukses Deleting",
            data: "Sukses Menghapus Like Reply",
            });

    } catch (err: any) {
        return res.status(500).json({
            code: 500,
            status: "error",
            message: err.message || "profil tidak ditemukan",
            });
  };
} 