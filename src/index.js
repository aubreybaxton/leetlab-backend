import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"
import authRoutes from "./routes/auth.routes.js";
import problemRoutes from "./routes/problem.routes.js";
import executionRoutes from "./routes/execution.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";
import { corsOptions } from "./constants/cors.config.js";

dotenv.config();

const app = express();

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser())
//app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send("Hello Coders, welcome to the LeetLAB")
})

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/problems', problemRoutes)
app.use('/api/v1/execute-code', executionRoutes)
app.use('/api/v1/submission', submissionRoutes)
app.use('/api/v1/playlist', playlistRoutes)


app.listen(process.env.PORT, () => {
  console.log(`SERVER IS UP ON PORT: ${process.env.PORT} AND RUNNING`)
})