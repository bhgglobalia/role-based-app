
import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const uploadDir = path.join(process.cwd(), "uploads");

router.get("/", (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.status(500).json({ success: false, message: "Cannot read uploads" });
    const urls = files.map(f => `/uploads/${f}`);
    res.json({ success: true, images: urls });
  });
});

export default router;
