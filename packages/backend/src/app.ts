import cors from "cors";
import express, { Application, json } from "express";
import dotenv from "dotenv";
import todosController from "./controllers/todos-controller";
import { setupMongoDb } from "./models/common";
import { authenticateToken, loginUser } from "./services/auth";
import cookieParser from "cookie-parser";

dotenv.config();

const app: Application = express();
app.use(cookieParser());
app.use(cors());
app.use(json());

const port: number = parseInt(process.env.SERVER_PORT || "3001");
const mongoUrl: string =
  process.env.MONGODB_URL || "mongodb://localhost:27017/mytodos";

app.post("/login", loginUser);
app.use("/todos", authenticateToken);
app.use("/todos", todosController);

app.listen(port, async function () {
  await setupMongoDb(mongoUrl);
  console.log(`App is listening on port ${port}!`);
});
