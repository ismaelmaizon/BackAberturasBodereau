import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import productosRoutes from "./routes/productos.routes.js";
import lugaresRoutes from "./routes/lugares.routes.js";
import lugaresRoutesProd from "./routes/lugaresProd.routes.js";
import ventasRoutes from "./routes/ventas.routes.js";
import tiposRoutes from "./routes/tipos.routes.js";
import logins from "./routes/logins.routes.js";
import estados from "./routes/estados.routes.js";

import multer from "multer";

import { autenticacion } from "./controllers/login.controller.js";
import __dirname from "./utils.js";


const app = express();

const allowedOrigins = [
  //"http://localhost:5173",
  //"http://167.88.32.78",
  // si después usás dominio o subdominio, agregarlo acá
  // "https://stock.tudominio.com"
  "https://appstock.aberturasbodereau.com"
];

const corsOptions = {
  origin: function (origin, callback) {
    // permitir requests sin origin (postman, curl, apps server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Origen no permitido por CORS"));
  },
  credentials: true,
};

app.disable("x-powered-by");
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// logs
app.use(morgan("dev"));

// parsers
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// cors
app.use(cors(corsOptions));
// archivos estáticos
app.use("/static", express.static(__dirname + "/img", {
  index: false,
  maxAge: "30d",
}));

// routes públicas
app.use("/api/logins", logins);

// routes protegidas
app.use("/api/estados", autenticacion, estados);
app.use("/api/tipos", autenticacion, tiposRoutes);
app.use("/api/productos", autenticacion, productosRoutes);
app.use("/api/lugares", autenticacion, lugaresRoutes);
app.use("/api/lugaresProd", autenticacion, lugaresRoutesProd);
app.use("/api/ventas", autenticacion, ventasRoutes);

// middleware de errores
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "La imagen supera el tamaño máximo permitido",
      });
    }

    return res.status(400).json({ message: err.message });
  }

  if (err) {
    return res.status(400).json({
      message: err.message || "Error al subir archivo",
    });
  }

  next();
});

// 404
app.use((req, res) => {
  return res.status(404).json({ message: "Not found" });
});

export default app;