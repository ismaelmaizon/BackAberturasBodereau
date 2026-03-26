import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import __dirname from "../utils.js";

const uploadDir = path.join(__dirname, "img");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const MIME_TYPES_PERMITIDOS = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const EXTENSIONES_PERMITIDAS = [".jpg", ".jpeg", ".png", ".webp"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeValido = MIME_TYPES_PERMITIDOS.includes(file.mimetype);
  const extValida = EXTENSIONES_PERMITIDAS.includes(ext);

  if (!mimeValido || !extValida) {
    return cb(new Error("Solo se permiten imágenes JPG, JPEG, PNG o WEBP"));
  }

  cb(null, true);
};

export const uploadProducto = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 3 * 1024 * 1024,
    files: 1,
  },
});