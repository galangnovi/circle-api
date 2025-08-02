import  express from "express";
import corsMiddleware from "./middlewares/cors"
import session from "express-session"
import cookieParser from "cookie-parser";
import auth from "./routes/auth-login"
import profile from "./routes/profile"
import threads from "./routes/threads"
import reply from "./routes/replies"
import like from "./routes/likes"
import follows from "./routes/follows"
import search from "./routes/user"
import path from "path"
import { createServer } from 'http'
import { Server } from 'socket.io'
import { setupSwagger } from "./swagger/swagger";
import "./workers/imageWorkers"


const app = express()
const PORT =3000

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
})



setupSwagger(app);

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
    secure: false, 
    maxAge: 1000 * 60 * 60 * 2, 
  },
}));

app.use("/api/v1", auth)
app.use("/api/v1", threads)
app.use("/api/v1", profile)
app.use("/api/v1", reply)
app.use("/api/v1", like)
app.use("/api/v1", follows)
app.use("/api/v1", search)


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


export const notifyNewThread = (thread: any) => {
  io.emit('new-thread', thread)
}

export const notifyNewReply = (reply: any) => {
  io.emit('new-reply', reply)
}

httpServer.listen(process.env.PORT || PORT, () => {
    console.log(`🍄 server berjalan di http://localhost:${PORT}`)
})

export default app