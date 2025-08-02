import { Request, Response } from "express";
import { loginUser } from "../services/auth-login";
import { registerUser } from "../services/auth-login";

export const handlerLoginUser = async (req:Request, res:Response) =>{
    
    try{
        const {identifier, password} = req.body;
        if(!identifier || !password) throw new Error("user atau password salah");
        const useractive = (req as any).session.user
        if(useractive) throw new Error("logout akun anda dahulu untuk melanjutkan")

        const match = await loginUser(identifier, password);

        (req as any).session.user = {
            user_id: match.user_id,
            username: match.username,
            name: match.name,
            email: match.email,
            avatar: match.avatar,
        };


        res.cookie("token", match.token, {
            httpOnly: true,
            secure: true,        
            sameSite: "none",    
            maxAge: 1000 * 60 * 60 * 2,
        });
    
        return res.status(200).json({
            code: 200,
            status: "success",
            message: "Login successful.",
            data: match,
        });
        } catch (err: any) {
        return res.status(500).json({
            code: 500,
            status: "error",
            message: err.message || "Invalid Login",
        });
    }
}




export const handlerRegisterUser = async (req:Request, res:Response) =>{
    
    try{
    const {username, name, email, password}= req.body;
    if(!email || !password) throw new Error ("email atau password kosong")
    if(!name) throw new Error ("nama user kosong")
    if(!username) throw new Error ("nama user name kosong")
    if (username.length > 10) throw new Error("Username maksimal 10 karakter");

    const user = await registerUser(username, name, email, password);
        return res.status(200).json({
            code: 200,
            status: "success",
            message: "Registrasi berhasil. Akun berhasil dibuat.",
            data: user,
            });

    } catch (err: any) {
        return res.status(500).json({
            code: 500,
            status: "error",
            message: err.message || "Invalid register",
            });
  }

}

export const logout = (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.clearCookie("token");
    res.json({ message: "Logout berhasil" });
  });
};