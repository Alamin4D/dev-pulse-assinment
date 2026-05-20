import express, { type Application, type Request, type Response } from "express";
import { AuthRoutes } from "./modules/auth/auth.route";


const app: Application = express();


app.use(express.json());
app.use("/api/auth", AuthRoutes);

app.get("/", (req: Request, res: Response) => {
    res.send("DevPulse Server Running");
});

export default app;