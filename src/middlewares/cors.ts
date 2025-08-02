import cors from "cors";

const corsMiddleware = cors({
  origin: ["http://localhost:5174", "https://mycircle.railway.internal"], // ganti sesuai frontend kamu
  credentials: true,
});

export default corsMiddleware