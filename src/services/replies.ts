import {prisma} from "../prisma/client"


export async function seeAllReplies (user_id:number, thread_id:number, limit:number) {
    try {
        const replies = await prisma.replies.findMany({
            where: {thread_id},
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
                likes: {
                    select: {user: {select: {
                        id:true,
                    }}
                    }
                }
            },
            take:Number(limit)
         });
        if(!replies) throw new Error("tidak ada treads tersedia")
        

        const result = replies.map((reply) => {
        const isLiked = reply.likes.some((like) => like.user.id === user_id);
        return {
            ...reply,
            likes_count: reply.likes.length,
            isLiked,
        };
        });

    return result;
    } catch (err:any) {throw new Error(err.message || "Terjadi kesalahan")}
}


export async function addreplies (user_id:number, thread_id:number,  content:string, image?:string | null) {
    try{
        const imageToSave = image ?? null;
        const replies = await prisma.replies.create({
            data: {
                user_id:user_id,
                thread_id,
                content,
                created_by:user_id,
                image:imageToSave
            }   
        })
        if (!replies) throw new Error("invalid threads content")
        await prisma.threads.update({
        where: {id:thread_id},
        data: {
            number_of_replies: {increment: 1}
        }
    })
        return ({id:replies.id, user_id, content: replies.content, image: replies.image, timeStamp: replies.created_at })
    } catch (err:any) {throw new Error(err.message || "Terjadi kesalahan")}
}