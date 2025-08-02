
import {prisma} from "../prisma/client"


export async function getFollower (user_id:number) {
    try{
        const followers = await prisma.following.findMany({
            where: {following_id: user_id},
            include: {follower: 
                {select: {
                    id:true,
                    username: true,
                    full_name: true,
                    photo_profile:true,
                    followers: {
                        where: {
                            follower_id: user_id
                        }

                    }

                }}
                
            }
        })
        if (!followers) throw new Error ("Failed to fetch follower data. Please try again later.")
        const formattedFollowers = followers.map((follower) => ({
        id: follower.follower.id,
        username: follower.follower.username,
        name: follower.follower.full_name,
        avatar: follower.follower.photo_profile,
        is_following: follower.follower.followers.length > 0, 
        }));

        return formattedFollowers
    } catch (err:any) {throw new Error(err.message || "Terjadi kesalahan")}
}


export async function actionFollow (user_id:number, followed_id:number) {
    try{
        const isFollowed = await prisma.following.findMany({
            where: {
                follower_id: user_id,
                following_id:followed_id
            }
        })

        if (isFollowed.length > 0) throw new Error ("user sudah di follow")

        const follow = await prisma.following.create({
            data: {
                follower_id: user_id,
                following_id: followed_id
            }
        })

        if (!follow) throw new Error ("Failed to follow the user. Please try again later.")

        return {user_id: follow.following_id, isFollowing:true}
    } catch (err:any) {throw new Error(err.message || "Failed to follow the user. Please try again later.")}
}

export async function getFollowing (user_id:number) {
    try{
        const followings = await prisma.following.findMany({
            where: {follower_id: user_id},
            include: {following: 
                {select: {
                    id:true,
                    username: true,
                    full_name: true,
                    photo_profile:true,
                    }

                }}
        })
        if (!followings) throw new Error ("Failed to fetch following data. Please try again later.")
        const formattedFollowers = followings.map((following) => ({
        id: following.following.id,
        username: following.following.username,
        name: following.following.full_name,
        avatar: following.following.photo_profile,
        is_following: true
        }));

        return formattedFollowers
    } catch (err:any) {throw new Error(err.message || "Terjadi kesalahan")}
}

export async function actionUnfollow (user_id:number ,followed_id:number) {
    try {
        const isFollowed = await prisma.following.findMany({
            where: {
                follower_id:user_id,
                following_id: followed_id
            }
        })

        if (!isFollowed) throw new Error ("kamu belum follow akun tersebut")
        
        const unfollow = await prisma.following.deleteMany({
            where: {
                follower_id:user_id,
                following_id: followed_id
            }
        })

        if (!unfollow) throw new Error ("Failed to unfollow the user. Please try again later.")

            return {user_id: followed_id,isFollowing:false}
    } catch (err:any) {throw new Error(err.message || "Terjadi kesalahan")}
}