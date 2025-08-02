import {prisma} from "../prisma/client"

export async function myProfile(user_id:number) {
    try{
        const profile = await prisma.users.findFirst({
            where:{id: user_id},
            select:{
                username:true,
                full_name:true,
                photo_profile:true,
                cover_photo:true,
                bio:true,
                email:true,
                following: {select: {
                    following:true,
                    follower:true
                }}

            }
        })

        if(!profile) throw new Error ("terjadi kesalahan memuat data profile")
       
        const followingCount = await prisma.following.count({
        where: { follower_id: user_id },
        });

        
        const followerCount = await prisma.following.count({
        where: { following_id: user_id },
        });

        
        return {
        ...profile,
        followingCount,
        followerCount,
        };
    } catch (err:any) {throw new Error(err.message || "Terjadi kesalahan")}
}

export async function editProfile(user_id:number, email:string, username:string, full_name:string,  bio:string,photo_profile:string|null, cover_Photo:string|null) {
    try {
        const profileData = await prisma.users.findFirst({
            where: {id:user_id}
        })
        if (!profileData) throw new Error ("profile tidak ditemukan")
        let Photo
        if(!photo_profile) {
            Photo = profileData.photo_profile
        } else {Photo = photo_profile} 

        let coverPhoto
        if(!cover_Photo) {
            coverPhoto = profileData.cover_photo
        } else {coverPhoto = cover_Photo} 

        
        
        const editProfile = await prisma.users.update({
            where: {id:user_id},
            data : {
                email,
                username,
                full_name,
                bio,
                photo_profile: Photo,
                cover_photo: coverPhoto
            }
        })
        return editProfile
    }   catch (err:any) {throw new Error(err.message || "Gagal Edit profile")}
}