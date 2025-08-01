import { Request, Response } from 'express'
import { actionFollow, actionUnfollow, getFollower, getFollowing } from '../services/follows'

    export const handlerGetFollowersOrFollowing = async (req: Request, res: Response) => {
    try {
    const user_id = (req as any).session.user.user_id;
    const { type } = req.query;

    if (!user_id) throw new Error("User tidak ditemukan");
    if (type !== "followers" && type !== "following") {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "Query 'type' harus terisi : 'followers' atau 'following'",
      });
    }

    const result = type === "followers"
      ? await getFollower(user_id)
      : await getFollowing(user_id);

      console.log(result)
    return res.status(200).json({
      code: 200,
      status: "success",
      message: `Sukses menampilkan ${type}`,
      data: result,
    });
   
       } catch (err: any) {
           return res.status(500).json({
               code: 500,
               status: "error",
               message: err.message || "operasi gagal",
               });
     }; 
    }

    export const handlerActionFollow = async (req:Request, res:Response) => {
   try{
       const user_id = (req as any).session.user.user_id
       const followed_id = req.body.followed_id
        if (!user_id) throw new Error ("user tidak ditemukan")
        if (!followed_id) throw new Error ("user follower tidak ditemukan")
        const result = await actionFollow(user_id, followed_id)
       
       return res.status(200).json({
               code: 200,
               status: "success",
               message: "You have successfully followed the user.",
               data: result,
               });
   
       } catch (err: any) {
           return res.status(500).json({
               code: 500,
               status: "error",
               message: err.message || "operasi gagal",
               });
     }; 
    }

    export const handlerActionUnFollow = async (req:Request, res:Response) => {
   try{
       const user_id = (req as any).session.user.user_id
       const followed_id = req.body.followed_id
        if (!user_id) throw new Error ("user tidak ditemukan")
        if (!followed_id) throw new Error ("Followed user tidak ditemukan")
        const result = await actionUnfollow(user_id, followed_id)
       
       return res.status(200).json({
               code: 200,
               status: "success",
               message: "You have successfully unfollowed the user.",
               data: result,
               });
   
       } catch (err: any) {
           return res.status(500).json({
               code: 500,
               status: "error",
               message: err.message || "operasi gagal",
               });
     }; 
    }
     