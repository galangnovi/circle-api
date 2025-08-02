import cors from "cors";

const corsMiddleware = cors({
  origin: ["http://localhost:5174", "https://mycircle-media.vercel.app"],
  credentials: true,
});

export default corsMiddleware