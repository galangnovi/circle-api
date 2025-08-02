import { Request, Response } from "express";
import { addThreads, imageThreads, seeAllTreads, seeUserThreads, ThreadsDetail } from "../services/threads";
import { notifyNewThread } from '../app'
import { addImageJob } from "../queues/imageQueue";
import path from 'path'


export const handlerAllThreads = async (req:Request, res:Response) =>{
    try{
    const user_id = (req as any).session.user.user_id
    const {limit} = (req as any).query
    if (!user_id) throw new Error ("user tidak ditemukan")
    const result = await seeAllTreads(user_id, limit)
    
    return res.status(200).json({
            code: 200,
            status: "success",
            message: "Data Threads ditemukan",
            data: result,
            });

    } catch (err: any) {
        return res.status(500).json({
            code: 500,
            status: "error",
            message: err.message || "Threads tidak ditemukan",
            });
  };
} 

export const handlerThreadsDetail = async (req:Request, res:Response) => {
    try{
        const user_id = (req as any).session.user.user_id
        const threads_id = Number(req.params.id)
        if (!user_id) throw new Error ("user tidak ditemukan")
        if (!threads_id) throw new Error ("id Threads tidak ada")
        const result = await ThreadsDetail(user_id, threads_id)

    return res.status(200).json({
            code: 200,
            status: "success",
            message: "Data Threads ditemukan",
            data: result,
            });

    } catch (err: any) {
        return res.status(500).json({
            code: 500,
            status: "error",
            message: err.message || "Threads tidak ditemukan",
            });
  };
}

export const handlerAddNewThread = async (req:Request, res:Response) =>{
    try{
        const created_by = (req as any).session.user.user_id
        const {content} = req.body
        const image = req.file?.path ?? null

        const result = await addThreads(created_by, content, image)
        notifyNewThread(result)

        // if (image) {
        // await addImageJob(image)
        // }

    return res.status(200).json({
            code: 200,
            status: "success",
            message: "Berhasil menambahkan threads",
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

export const handlerImageThreads = async (req:Request, res:Response) => {
    try{
        const user_id = (req as any).session.user.user_id
        if (!user_id) throw new Error ("user tidak ditemukan")
        const result = await imageThreads(user_id)
    
    return res.status(200).json({
            code: 200,
            status: "success",
            message: "Data Image Threads ditemukan",
            data: result,
            });

    } catch (err: any) {
        return res.status(500).json({
            code: 500,
            status: "error",
            message: err.message || "Threads tidak ditemukan",
            });
  };
}

export const handlerUserThreads = async (req:Request, res:Response) => {
    try{
        const user_id = (req as any).session.user.user_id
        if (!user_id) throw new Error ("user tidak ditemukan")
        const result = await seeUserThreads(user_id)
    
    return res.status(200).json({
            code: 200,
            status: "success",
            message: "Data Threads User ditemukan",
            data: result,
            });

    } catch (err: any) {
        return res.status(500).json({
            code: 500,
            status: "error",
            message: err.message || "Threads tidak ditemukan",
            });
  };
}