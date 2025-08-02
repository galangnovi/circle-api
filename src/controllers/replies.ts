import { Request, Response } from "express";
import { addreplies, seeAllReplies } from "../services/replies";
import {  notifyNewReply } from '../app'
import { addImageJob } from "../queues/imageQueue";
import path from 'path'


export const handlerAllReplies = async (req:Request, res:Response) => {
    try{
        const user_id = (req as any).session.user.user_id
        const limit = Number(req.query.limit)
        const thread_id = Number(req.query.thread_id)
        if (!user_id) throw new Error ("user tidak ditemukan")
        if (!thread_id) throw new Error ("id Threads tidak ada")
        if (!limit) throw new Error ("atur batas limit dahulu !")
        const result = await seeAllReplies(user_id, thread_id, limit)
    
    return res.status(200).json({
            code: 200,
            status: "success",
            message: "Data Replies ditemukan",
            data: result,
            });

    } catch (err: any) {
        return res.status(500).json({
            code: 500,
            status: "error",
            message: err.message || "Replies tidak ditemukan",
            });
  };
}


export const handlerAddNewReply = async (req:Request, res:Response) =>{
    try{
        const user_id = (req as any).session.user.user_id
        if(!user_id) throw new Error ("user tidak ditemukan")
        const thread_id = Number(req.query.thread_id)
        const content = req.body.content
        const image = req.file?.path ?? null

        const result = await addreplies(user_id, thread_id, content, image)
        notifyNewReply(result)

        if (image) {
        await addImageJob(image)
        }

    return res.status(200).json({
            code: 200,
            status: "success",
            message: "Reply Berhasil Diposting",
            data: result,
            });

    } catch (err: any) {
        return res.status(500).json({
            code: 500,
            status: "error",
            message: err.message || "Gagal menambahkan threads",
            });
  };
}