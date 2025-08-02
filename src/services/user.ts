
import {prisma} from "../prisma/client"

export async function searchUser (user_id:number, identifier:string) {
    try{
        const users = await prisma.users.findMany({
            where:{
                OR: [
                    {username: { contains: identifier, mode: 'insensitive' }},
                    {full_name: { contains: identifier, mode: 'insensitive' }}
                ]
            },
            select: {
                id:true,
                username:true,
                full_name:true,
                photo_profile:true,
                followers: {
                    select: {
                        follower: {
                            select: {id:true}
                        }
                    }
                },
                _count: {
                    select: {
                        followers: true
                    }
            }
        }
        })

        

        if (users.length === 0) {
        throw new Error("user tidak ditemukan");
        }

        const isFollowing = users.map((user) => {
        const is_following = user.followers.some(f => f.follower.id === user_id); // 🔥 cek apakah user sedang follow
            
        return {
            id: user.id,
            username: user.username,
            name: user.full_name,
            avatar: user.photo_profile,
            follower: user._count.followers,
            is_following: is_following
        };
            })

        return isFollowing
    } catch (err:any) {throw new Error(err.message || "Terjadi kesalahan")}
}


export async function recomendationUser(user_id:number) {
    try{
        const users = await prisma.users.findMany({
            where: {
                id: {
                not: user_id,
                },
                followers: {
                none: {
                    follower_id: user_id,
                },
                },
            },
            select: {
                id:true,
                username:true,
                full_name:true,
                photo_profile:true,
                followers:{
                    select:{
                        follower:{
                            select: {
                                id:true
                            }
                        }
                    }
                }
            },
            take: 4, 
            orderBy: {
                id: 'asc', 
            },
        });

        const isFollowing = users.map((user) => {
        const is_following = user.followers.some(f => f.follower.id === user_id); // 🔥 cek apakah user sedang follow
            
        return {
            id: user.id,
            username: user.username,
            name: user.full_name,
            avatar: user.photo_profile,
            is_following: is_following
        };
            })   
    
    return isFollowing

    } catch (err:any) {throw new Error(err.message || "Terjadi kesalahan")}
    
}