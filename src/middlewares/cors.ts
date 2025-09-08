import cors from "cors";

const corsMiddleware = cors({
  origin: ["http://localhost:5173", "https://mycircle-media.vercel.app"],
  credentials: true,
});

export default corsMiddleware