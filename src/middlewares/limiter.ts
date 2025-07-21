import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
    windowMs: 60*1000, //1 menit
    max: 1000, // maximal 5 requens per ip
    message: "request terlalu bnayak silahkan coba lagi nanti"
})