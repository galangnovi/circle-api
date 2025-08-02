import cors from "cors";

const corsMiddleware = cors({
  origin: ["http://localhost:5174", "https://circle-ui-railway-url.app"], // ganti sesuai frontend kamu
  credentials: true,
});

export default corsMiddleware