import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes";

const app = express();

// 中间件
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use("/api", routes);

// 根路由
app.get("/", (req: Request, res: Response) => {
  res.send("Express TypeScript API is running!");
});

// 404 处理
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Not found" });
});

// 错误处理
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  res.status(500).json({ message: "Internal server error" });
});

export default app;
