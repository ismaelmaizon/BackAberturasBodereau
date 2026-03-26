import { pool } from "../db.js";
import { encriptarPass, validarPass } from "../utils.js";
import jwt from "jsonwebtoken";
import util from "util";

const jwtVerify = util.promisify(jwt.verify);

const JWT_SECRET = process.env.JWT_SECRET;
const NODE_ENV = process.env.NODE_ENV || "development";
const IS_PROD = NODE_ENV === "production";

if (!JWT_SECRET) {
  throw new Error("Falta la variable de entorno JWT_SECRET");
}

const cookieOptions = {
  httpOnly: true,
  secure: IS_PROD,       // true en producción con https
  sameSite: "lax",
  maxAge: 6 * 60 * 60 * 1000, // 6h
  path: "/",
};

export const reg = async (req, res) => {
    try {
    const { email, password, rol } = req.body;

    if (!email || !password || !rol) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    if (typeof email !== "string" || typeof password !== "string" || typeof rol !== "string") {
      return res.status(400).json({ message: "Formato inválido" });
    }

    const emailNormalizado = email.trim().toLowerCase();

    if (!["admin", "user"].includes(rol)) {
      return res.status(400).json({ message: "Rol inválido" });
    }

    // IMPORTANTE:
    // idealmente esta ruta no debería quedar pública.
    // Debería estar protegida y permitir solo admins.
    const [existingUsers] = await pool.query(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [emailNormalizado]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ message: "El usuario ya existe" });
    }

    const pass = await encriptarPass(password);

    await pool.query(
      "INSERT INTO users (email, clave, rol) VALUES (?, ?, ?)",
      [emailNormalizado, pass, rol]
    );

    return res.status(201).json({ message: "Usuario registrado" });
  } catch (err) {
    console.error("Error en reg:", err);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};


export const login = async (req, res) => {
    try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Faltan credenciales" });
    }

    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ message: "Formato inválido" });
    }

    const emailNormalizado = email.trim().toLowerCase();

    const [rows] = await pool.query(
      "SELECT id, email, clave, rol FROM users WHERE email = ? LIMIT 1",
      [emailNormalizado]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const user = rows[0];

    const passwordValida = await validarPass(password, user.clave);

    if (!passwordValida) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        rol: user.rol,
      },
      JWT_SECRET,
      {
        expiresIn: "6h",
      }
    );

    res.cookie("jwt", token, cookieOptions);

    let tockenRol = 'notView'
    if (user.rol == 'admin') {
        tockenRol = 'view' 
    }

    return res.status(200).json({
      message: "Bienvenido",
      user: {
        id: user.id,
        email: user.email,
        rol: user.rol,
      },
      response: tockenRol
    });
  } catch (err) {
    console.error("Error en login:", err);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: "lax",
    path: "/",
  });

  return res.status(200).json({ message: "Logout successful" });
};


export const autenticacion = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;

    if (!token) {
      return res.status(401).json({ message: "Sesión no válida o expirada" });
    }

    const decodificar = await jwtVerify(token, JWT_SECRET);

    if (!decodificar?.id) {
      return res.status(401).json({ message: "Token inválido" });
    }

    const [rows] = await pool.query(
      "SELECT id, email, rol FROM users WHERE id = ? LIMIT 1",
      [decodificar.id]
    );

    if (!rows.length) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    req.user = {
      id: rows[0].id,
      email: rows[0].email,
      rol: rows[0].rol,
    };

    return next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o vencido" });
  }
};

export const soloAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "No autenticado" });
  }

  if (req.user.rol !== "admin") {
    return res.status(403).json({ message: "No autorizado" });
  }

  return next();
};