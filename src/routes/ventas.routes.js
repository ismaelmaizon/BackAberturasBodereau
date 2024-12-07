import { Router } from "express";
import { registrarVenta, registrarProdVenta, getVentas, getVentaId, modVenta, deleteVenta } from "../controllers/ventas.controller.js";




const router = Router()


router.get("/getVentas", getVentas)
router.get("/getVentaId/:idg", getVentaId)

router.post("/registrarVenta", registrarVenta)
router.post("/registrarProdVenta", registrarProdVenta)

router.post("/updateVenta", modVenta)
router.delete("/deleteVenta/:id", deleteVenta)

export default router