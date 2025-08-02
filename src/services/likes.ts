import { threadId } from "worker_threads"
import {prisma} from "../prisma/client"
import redis from "../utils/redis";

const getCacheKey = (user_id: number) => `my_threads:${user_id}`;

export async function likeThreads ( user_id:number, thread_id:number) {
    try{
         const liked = await prisma.likes.create({
            data: {
                user_id,
                thread_id,
                created_by:user_id
            }   
        })
        if (!liked) throw new Error("invalid like content")
        
        const cacheKey = getCacheKey(user_id);
        const cached = await redis.get(cacheKey);
        if (cached) {
            const parsed = JSON.parse(cached); // return hasil cache

            const updated = parsed.map((thread: any) => {
            if (thread.id === thread_id) {
                return {
                ...thread,
                likes_count: thread.likes_count + 1,
                isLiked: true,
                };
            }
            return thread;
            })
        await redis.set(cacheKey, JSON.stringify(updated), "EX", 60);
        }
        return 
    } catch (err:any) {throw new Error(err.message || "Terjadi kesalahan")}
}

export async function likereply ( user_id:number, reply_id:number) {
    try{
        const thread = await prisma.replies.findFirst({
            where: {id:reply_id},
            select: {
                thread_id:true
            }
        })

        if (!thread) throw new Error ("reply tidak ditemukan")
         const liked = await prisma.likes.create({
            data: {
                user_id,
                reply_id,
                created_by:user_id
            }   
        })
        if (!liked) throw new Error("invalid like content")
        return 
    } catch (err:any) {throw new Error(err.message || "Terjadi kesalahan")}
}

export async function DeleteLikeThreads ( user_id:number, thread_id:number,) {
    try{
         const liked = await prisma.likes.deleteMany({
            where:{user_id, 
                thread_id}
        })
        if (!liked) throw new Error("invalid like content")
        
        const cacheKey = getCacheKey(user_id);
        const cached = await redis.get(cacheKey);
        if (cached) {
            const parsed = JSON.parse(cached); // return hasil cache

            const updated = parsed.map((thread: any) => {
            if (thread.id === thread_id) {
                return {
                ...thread,
                likes_count: Math.max(thread.likes_count - 1, 0),
                isLiked: false,
                };
            }
            return thread;
            })
        await redis.set(cacheKey, JSON.stringify(updated), "EX", 60);
        }
        return 
    } catch (err:any) {throw new Error(err.message || "Terjadi kesalahan")}
}

export async function DeleteLikeReply ( user_id:number, reply_id:number) {
    try{
         const liked = await prisma.likes.deleteMany({
            where:{user_id, 
                reply_id}
        })
        if (!liked) throw new Error("invalid like content")
        return 
    } catch (err:any) {throw new Error(err.message || "Terjadi kesalahan")}
}