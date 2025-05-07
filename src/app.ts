import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes";

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", routes);

// Root route
app.get("/", (req: Request, res: Response) => {
  res.send("Express TypeScript API is running!");
});

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Not found" });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  res.status(500).json({ message: "Internal server error" });
});

export default app;
