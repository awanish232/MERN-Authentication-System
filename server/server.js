import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import sendMail from "./config/nodemailer.js";

const app = express();
const port = process.env.PORT || 4000;

// Connect Database
connectDB();

// Trust Proxy for cookies (Render / Vercel ke liye important)
app.set("trust proxy", 1);

// ⭐ ONLY THIS CORS — Nothing extra ⭐
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mern-authentication-system-4.onrender.com"
    ],
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Default Route
app.get("/", (req, res) => res.send("API Working"));

// Auth Routes
app.use("/api/auth", authRouter);

// User Routes
app.use("/api/user", userRouter);

// Test Mail
app.get("/test-mail", async (req, res) => {
  try {
    await sendMail(
      "awanishthakur64@gmail.com",
      "Render Mail Test",
      "<h2>Mail working perfectly 🚀</h2>"
    );
    res.send("Mail sent successfully");
  } catch (err) {
    console.error("Mail send failed:", err.response?.data || err.message);
    res.status(500).send("Mail failed");
  }
});

// Server Start
app.listen(port, () => console.log(`Server started on PORT:${port}`));
