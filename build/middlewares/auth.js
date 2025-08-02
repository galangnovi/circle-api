"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const jwt_utils_1 = require("../utils/jwt-utils");
function authenticate(req, res, next) {
    const token = req.cookies.token;
    console.log(req.cookies.token);
    console.log(req.session);
    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const userToken = (0, jwt_utils_1.verifyToken)(token);
        const userSession = req.session.user;
        if (!userSession)
            throw new Error("Kamu belum login atau sudah logout");
        if (userSession.user_id !== userToken.id)
            throw new Error("user token tidak cocok");
        req.user = userSession;
        next();
    }
    catch (err) {
        res.status(401).json({ message: err.message || "authentifikasi gagal" });
    }
}
