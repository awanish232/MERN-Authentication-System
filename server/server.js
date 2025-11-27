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

connectDB();

// Safari / secure cookies ke liye
app.set("trust proxy", 1);

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mern-authentication-system-4.onrender.com",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/", (req, res) => res.send("API Working"));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

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

app.listen(port, () => console.log(`Server started on PORT:${port}`));
