
import {prisma} from "../prisma/client"
import bcrypt, { hash } from "bcrypt"
import { registerScema } from "../validations/user-account"
import { signEncToken } from "../utils/jwt-utils";


export async function loginUser(identifier:string, password:string){
    
    try{
    const isUser = await prisma.users.findFirst({
        where: {
            OR: [
            { email: identifier },
            { username: identifier },
            ]
        }
        });

    if(!isUser) throw new Error("user tidak ditemukan");

    const isMatch = await bcrypt.compare(password, isUser.password)
    if(!isMatch) throw new Error("password salah");

     const payload = {
      id: isUser.id,
      username: isUser.username,
      name: isUser.full_name,
      email: isUser.email,
    };

    const token = signEncToken(payload);


    return {
        user_id: isUser.id,
        username: isUser.username,
        name: isUser.full_name,
        email: isUser.email,
        avatar: isUser.photo_profile,
        token
    }
    } catch (err:any) {throw new Error(err.message || "Terjadi kesalahan")}
}





export async function  registerUser(username: string, name: string, email: string, password: string){
    try{
    const{error} = registerScema.validate({email, password});
    if(error) throw new Error(error.message);

    const hashed= await bcrypt.hash(password, 10)

    const user = await prisma.users.create({
        data:{
            username,
            full_name: name,
            email,
            password:hashed
        }
    })
    const userPayLoad ={
        id:user.id,
        username: user.username,
        name: user.full_name,
        email:user.email,

    }
    const token = signEncToken(userPayLoad)
    return{id:user.id, username: user.username, full_name:user.full_name, email:user.email, token}
    } catch (err:any)  { if (err?.code === 'P2002') {
            throw new Error("Email atau username sudah terdaftar.");
        } throw new Error(err.message || "Terjadi kesalahan");
    }
}