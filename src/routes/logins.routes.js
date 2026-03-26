import { Router } from "express";
import { login, logout, reg, soloAdmin } from "../controllers/login.controller.js";

const router = Router();

// registrar usuario
router.post("/reg", soloAdmin, reg);

// login
router.post("/log", login);

// logout
router.post("/logout", logout);

export default router;