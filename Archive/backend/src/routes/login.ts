
import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "../db/database.ts";
import { upload } from "../middleware/upload.ts";

const router = Router();

interface User {
  id: number;
  name: string;
  role: string;
  classID?: string | null;
  password: string;
  photo?: string | null;
}

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

router.post("/", upload.single("photo"), (req: Request, res: Response) => {
  const r = req as MulterRequest;
  const { role, name, classID, password } = r.body;
  const photoFilename = r.file ? r.file.filename : null;

  if (!role || !name || !password) {
    return res.status(400).json({ success: false, message: "Role, name, and password are required" });
  }
  if (role === "teacher" && !classID) {
    return res.status(400).json({ success: false, message: "ClassID is required for teachers" });
  }

  const sql =
    role === "teacher"
      ? "SELECT * FROM users WHERE role='teacher' AND name=? AND classID=? AND password=?"
      : "SELECT * FROM users WHERE role='student' AND name=? AND password=?";
  const params = role === "teacher" ? [name.trim(), classID?.trim(), password.trim()] : [name.trim(), password.trim()];

  db.get(sql, params, (err: Error | null, user: User | undefined) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    if (photoFilename) {
      db.run("UPDATE users SET photo=? WHERE id=?", [photoFilename, user.id], (err: Error | null) => {
        if (err) console.error("Failed to update photo:", err.message);
      });
    }

    res.json({
      success: true,
      message: `Welcome ${user.role === "teacher" ? "Teacher" : "Student"} ${user.name}`,
      photo: photoFilename
        ? `/uploads/${photoFilename}`
        : user.photo
          ? `/uploads/${user.photo}`
          : null,
    });
  });

});

export default router;
