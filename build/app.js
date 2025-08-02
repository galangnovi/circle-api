"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyNewReply = exports.notifyNewThread = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("./middlewares/cors"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_login_1 = __importDefault(require("./routes/auth-login"));
const profile_1 = __importDefault(require("./routes/profile"));
const threads_1 = __importDefault(require("./routes/threads"));
const replies_1 = __importDefault(require("./routes/replies"));
const likes_1 = __importDefault(require("./routes/likes"));
const follows_1 = __importDefault(require("./routes/follows"));
const user_1 = __importDefault(require("./routes/user"));
const path_1 = __importDefault(require("path"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const swagger_1 = require("./swagger/swagger");
require("./workers/imageWorkers");
const app = (0, express_1.default)();
app.set('trust proxy', 1);
const PORT = 3000;
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: 'http://localhost:5174',
        methods: ['GET', 'POST'],
    },
});
(0, swagger_1.setupSwagger)(app);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(cors_1.default);
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || "rahasia_sesi",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 2,
    },
}));
app.use("/api/v1", auth_login_1.default);
app.use("/api/v1", threads_1.default);
app.use("/api/v1", profile_1.default);
app.use("/api/v1", replies_1.default);
app.use("/api/v1", likes_1.default);
app.use("/api/v1", follows_1.default);
app.use("/api/v1", user_1.default);
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
const notifyNewThread = (thread) => {
    io.emit('new-thread', thread);
};
exports.notifyNewThread = notifyNewThread;
const notifyNewReply = (reply) => {
    io.emit('new-reply', reply);
};
exports.notifyNewReply = notifyNewReply;
httpServer.listen(process.env.PORT || PORT, () => {
    console.log(`🍄 server berjalan di http://localhost:${PORT}`);
});
exports.default = app;
