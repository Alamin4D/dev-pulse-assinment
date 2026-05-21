import express, { type Application, type Request, type Response } from "express";
import { AuthRoutes } from "./modules/auth/auth.route";
import { IssueRoutes } from "./modules/issues/issues.route";
import globalErrorHandler from "./middleware/globalErrorHandler";


const app: Application = express();


app.use(express.json());
app.use("/api/auth", AuthRoutes);
app.use("/api/issues", IssueRoutes)

app.get("/", (req: Request, res: Response) => {
    res.send("DevPulse Server Running");
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(globalErrorHandler);

export default app;