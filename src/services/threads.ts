
import {prisma} from "../prisma/client"
import redis from "../utils/redis";

const getCacheKey = (user_id: number) => `my_threads:${user_id}`;

export async function seeAllTreads (user_id:number, limit:number) {
    try {
        const cacheKey = getCacheKey(user_id);

        const cached = await redis.get(cacheKey);
        if (cached) {
            return JSON.parse(cached); // return hasil cache
        }
        const threads = await prisma.threads.findMany({
            orderBy:{
                created_at : "desc",
            },
            select: {
                id:true,
                content:true,
                image:true,
                user:{
                    select: {
                        id:true,
                        username:true,
                        full_name:true,
                        photo_profile:true
                    }
                },
                created_at:true,
                number_of_replies:true,
                likes: {
                    select: {user: {select: {
                        id:true,
                    }}
                    }
                }
            },
            take:Number(limit)
         });
        if(!threads) throw new Error("tidak ada treads tersedia")
        
        const result = threads.map(thread => {
            const liked = thread.likes.some(like => like.user.id === user_id);

            return {
                ...thread,
                likes_count: thread.likes.length,
                isLiked: liked,
            };
            });
        
        await redis.set(cacheKey, JSON.stringify(result), "EX", 60);
        
        return result
    } catch (err:any) {throw new Error(err.message || "Terjadi kesalahan")}
}


export async function ThreadsDetail (user_id:number, threads_id:number) {
    try {
        const threads = await prisma.threads.findFirst({
            where: {id: threads_id},
            select: {
                id:true,
                content:true,
                image:true,
                user:{
                    select: {
                        id:true,
                        username:true,
                        full_name:true,
                        photo_profile:true
                    }
                },
                created_at:true,
                number_of_replies:true,
                likes: {
                    select: {user: {select: {
                        id:true,
                    }}
                    }
                }
            },
         });
        if(!threads) throw new Error("tidak ada treads tersedia")
        
            const liked = threads.likes.some(like => like.user.id === user_id);

            return {
                ...threads,
                likes_count: threads.likes.length,
                isLiked: liked,
            };
    } catch (err:any) {throw new Error(err.message || "Terjadi kesalahan")}
}




export async function addThreads(created_by:number, content:string, image?:string | null) {
    try{
        const imageToSave = image ?? null;
        const threads = await prisma.threads.create({
            data:{
                content,
                created_by,
                image:imageToSave
            }
        })
        if (!threads) throw new Error("invalid threads content")
        await redis.del(`my_threads:${created_by}`);
        return ({id:threads.id, user_id:threads.created_by, content: threads.content, image: threads.image, timeStamp: threads.created_at })
    } catch (err:any) {throw new Error(err.message || "Terjadi kesalahan")}
}

export async function imageThreads(user_id:number) {
    try{
        const threads = await prisma.threads.findMany({
            where:{created_by:user_id,
                image: {
                    not:null,
                    notIn:[""]
                }
            },
            orderBy:{
                created_at : "desc",
            },
            select: {
                user: {
                    select: {
                        id:true,
                        username:true,
                        full_name:true,
                        photo_profile:true
                    }
                },
                image:true,
                likes:{
                    select:{user:true}
                },
                number_of_replies:true
            },
        })
        if(threads.length === 0) throw new Error ("image kosong")
        const threadsWithMeta = threads.map(thread => {
            const liked = thread.likes.some(like => like.user.id === user_id);

            return {
                ...thread,
                likes_count: thread.likes.length,
                isLiked: liked,
            };
        })

        return threadsWithMeta
            
    } catch (err:any) {throw new Error(err.message || "Terjadi kesalahan")}
}

export async function seeUserThreads (user_id:number) {
    try {
        const threads = await prisma.threads.findMany({
            orderBy:{
                created_at : "desc",
            },
            where:{
                created_by: user_id,
                content:{
                    not: ""
                }
            },
            select: {
                id:true,
                content:true,
                created_at:true,
                number_of_replies:true,
                likes: {
                    select: {user: {select: {
                        id:true,
                    }}
                    }
                },
                user: {
                    select: {
                        id:true,
                        username:true,
                        full_name:true,
                        photo_profile:true,
                    }
                }
            },
         });
        if(!threads) throw new Error("tidak ada treads tersedia")
        
        const result = threads.map(thread => {
            const liked = thread.likes.some(like => like.user.id === user_id);

            return {
                ...thread,
                likes_count: thread.likes.length,
                isLiked: liked,
            };
            });
        
        return result
    } catch (err:any) {throw new Error(err.message || "Terjadi kesalahan")}
}