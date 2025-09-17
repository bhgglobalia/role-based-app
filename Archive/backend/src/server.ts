import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import type { Request, Response } from "express";

import imagesRouter from "./routes/images.ts";
import loginRouter from "./routes/login.ts";


const app = express();

app.use(cors());
app.use(express.json());

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
app.use("/uploads", express.static(uploadDir));

app.use("/api/login", loginRouter);
app.use("/api/images", imagesRouter);

const frontendBuildPath = path.join(process.cwd(), "../../frontend/dist");
if (fs.existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));
  app.get(/.*/, (req: Request, res: Response) =>
    res.sendFile(path.join(frontendBuildPath, "index.html"))
  );
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
