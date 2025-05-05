import express, { Request, Response, NextFunction, Application } from "express";

import { PORT } from "./config";
import cors from "cors";

import authRoutes from './routers/auth.route';

const app: Application = express();
const port = PORT;

app.use(cors({
  // ngasih tau frontend nya pake port berapa
  // origin:
  // credentials:
}));
app.use(express.json());

app.get(
  "/api",
  (req: Request, res: Response, next: NextFunction) => {
    console.log("Tes masuk");
    next();
  },
  (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send("oke api");
  }
);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

// Register router
app.use('/api/auth', authRoutes);
