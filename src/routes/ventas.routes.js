import { Router } from "express";
import { registrarVenta, registrarProdVenta, getVentas, getVentaId, modVenta, deleteVenta } from "../controllers/ventas.controller.js";
import { soloAdmin } from "../controllers/login.controller.js";




const router = Router()


router.get("/getVentas", getVentas)
router.get("/getVentaId/:idg", getVentaId)

router.post("/registrarVenta", soloAdmin, registrarVenta)
router.post("/registrarProdVenta", soloAdmin, registrarProdVenta)

router.post("/updateVenta", soloAdmin, modVenta)
router.delete("/deleteVenta/:id", soloAdmin, deleteVenta)

export default router