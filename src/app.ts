import  express from "express";
import corsMiddleware from "./middlewares/cors"
import session from "express-session"
import cookieParser from "cookie-parser";
import auth from "./routes/auth-login"


const app = express()
const PORT =3000
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(corsMiddleware)
app.use(cookieParser())

app.use(session({
  secret: process.env.SESSION_SECRET || "rahasia_sesi",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // set true kalau pakai HTTPS
    maxAge: 1000 * 60 * 60 * 2, // 2 jam
  },
}));

app.use("/api/v1", auth)


app.listen(PORT, () => {
    console.log(`🍄 server berjalan di http://localhost:${PORT}`)
})