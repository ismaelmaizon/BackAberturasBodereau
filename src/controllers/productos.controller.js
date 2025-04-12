import { pool } from "../db.js";
import {DataTime, generarIDAleatorio} from "../utils.js";
import fs from 'fs';
import path from "path";
import __dirname from "../utils.js";


//ver todos los productos
export const getProductos = async (req, res) => {
  console.log('ingreso a productos');
  console.log(req.cookies);
  try {
    const [productos] = await pool.query("SELECT * FROM productos");
    
    res.send( {status: 200, message: 'succes', response: productos} );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something goes wrong" });
  }
};
//ver un producto
export const getProducto = async (req, res) => {
  try {
    const { idg } = req.params;
    console.log(idg);
    const [rows] = await pool.query("SELECT * FROM productos WHERE IdGenerate = ?", [
      idg,
    ]);

    if (rows.length <= 0) {
      return res.status(404).json({ message: "producto not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};
//ver producto mas vendido
export const getProductMostSold = async (req, res) =>{
  try {
    const [rows] = await pool.query(`SELECT id_producto, COUNT(*) as frecuencia
       FROM ventasProduct
       GROUP BY id_producto
       ORDER BY frecuencia DESC
       LIMIT 1;`,[]);
  
    if (rows.length <= 0) {
      return res.status(404).json({ message: "producto not found" });
    }

    console.log(rows);
    console.log(rows[0]);
    
    res.send( {status: 200, message: 'succes', response: rows} );

  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
}
}


//crear producto
export const createProducto = async (req, res) => {
  // Accede al archivo subido
  const file = req.file;
  // Accede a los otros datos del producto enviados en el formulario
  const {Tipo, Ancho, Alto, Izq, Derc, Precio_U } = JSON.parse(req.body.prod)
  const stock = 0
  const idGenerate = generarIDAleatorio(10)
  console.log(file);
  console.log(idGenerate,Tipo, Ancho, Alto, Izq, Derc, Precio_U, stock);
  let valid = false
  try {
    const [productos] = await pool.query("SELECT * FROM productos");
    productos.map((pac) =>{
      if (pac.Tipo == Tipo && pac.Ancho == Ancho && pac.Alto == Alto && pac.Derc == Derc && pac.Izq == Izq) {
        console.log('ya existe');
        valid = true
      }
    })
    if (valid) {
      res.status(201).json({ message: 'ya existe el producto'  });
    } else {
      if (file == undefined) {
        try{
          const [rows] = await pool.query(
            "INSERT INTO productos (IdGenerate, Tipo, Ancho, Alto, Izq, Derc, Precio_U, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?);",
            [idGenerate, Tipo, Ancho, Alto, Izq, Derc, Precio_U, stock]
          );
          res.status(200).json({ message: 'producto creado con exito', product: idGenerate });
        }catch(err){
          console.log(err);
          res.status(400).json({ message: 'problemas al crear el producto', error: err });
        }
      }else{
        try{
          const [rows] = await pool.query(
            "INSERT INTO productos (IdGenerate, Tipo, Ancho, Alto, Izq, Derc, Precio_U, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?);",
            [idGenerate, Tipo, Ancho, Alto, Izq, Derc, Precio_U, stock]
          );
          try{
            const [rows2] = await pool.query(
              "INSERT INTO imagenes (IdProduct, url) VALUES (?, ?);",
              [idGenerate, file.filename]
            );
            res.status(200).json({ message: 'producto creado con exito', product: idGenerate });
          }catch(err){
            console.log(err);
            res.status(400).json({ message: 'problemas al agregar imagen del producto', error: err });
          }
        }catch(err){
          console.log(err);
          res.status(400).json({ message: 'problemas al crear el producto', error: err });
        }
        
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something goes wrong" });
  }
};
//Update producto
export const updateProducto = async (req, res) => {
  const {IdGenerate, Tipo, Ancho, Alto, Izq, Derc, Precio_U } = req.body
  console.log(IdGenerate, Tipo, Ancho, Alto, Izq, Derc, Precio_U);
  const query = `
  UPDATE productos
  SET Tipo = ?, Ancho = ?, Alto = ?, Izq = ?, Derc = ?, Precio_U = ?
  WHERE IdGenerate = ?
  `;  
  
  try {
    const [rows] = await pool.query("SELECT * FROM productos WHERE IdGenerate = ?", [
      IdGenerate,
    ]);

    if(rows.length != 0){
      try{
        const [update] = await pool.query(query,[
          Tipo, Ancho, Alto, Izq, Derc, Precio_U, IdGenerate]
        );
        if (update) { 
          return res.status(200).json({ message: "producto actualizado" });
        }
      }catch(err){
        return res.status(400).json({ message: "problemas al actualizar producto" });
      }

    }else{
      return res.status(400).json({ message: "producto no existe" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "problemas para encontrar producto" });
  }
};

//ver imagenes del producto
export const getProductoIms = async (req, res) => {
  try {
    const { idg } = req.params;
    console.log(idg);
    const [rows] = await pool.query("SELECT * FROM imagenes WHERE IdProduct = ?", [
      idg,
    ]);

    if (rows.length <= 0) {
      return res.status(404).json({ message: "producto not found" });
    }
    res.json(rows);
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({ message: "Something goes wrong" });
  }
};
//agregar imagen a producto
export const addImgProducto = async (req, res) => {
  const file = req.file;
  // Accede a los otros datos del producto enviados en el formulario
  const id = req.body.id
  const originId =  id.slice(1, -1);
  console.log(originId);
  try {
    const [rows] = await pool.query(
      "INSERT INTO imagenes (IdProduct, url) VALUES (?, ?);",
      [originId, file.filename]
    );
    res.json(rows);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const deleteProducto = async (req, res) => {
  //delete FROM lugaresProducto where id_producto = 1;
  let boolLugProd = false
  let boolImgProd = false
  
  try {
    const { id } = req.params;
    const [product] = await pool.query("SELECT * FROM productos WHERE id = ?", [
      id,
    ]);
    console.log(product);
    //verificar existencia
    if (product.length == 0) {
      return res.status(404).json({ message: "product not found" });
    }
    //verificar existencia en lugares
    try{
      const [lugProd] = await pool.query("delete FROM lugaresProducto where id_producto = ?", [
        id,
      ]);
      if (lugProd.affectedRows >= 0) {
        boolLugProd = true
      }
    }catch(err){
      console.log(err);
      return res.status(500).json({ message: "problemas al eliminar producto de lugares" });
    }

    try{
      //verificar existencia de imagenes
      const [imgProdExist] = await pool.query("select * FROM imagenes where IdProduct = ?", [
        product[0].IdGenerate,
      ]);
      console.log('Info: ');
      console.log(imgProdExist);

      imgProdExist.map( async (el)=>{
        // Construye la ruta absoluta de la imagen
        const imagePath = path.join(__dirname,'img', el.url);

        console.log('Info: ');
        console.log(el.url);
        console.log(imagePath);
        
        // Verifica si el archivo existe antes de intentar eliminarlo
        if (fs.existsSync(imagePath)) {
          // Elimina el archivo usando unlink
          await fs.promises.unlink(imagePath);
        } else {
          res.status(404).json({ error: 'Archivo no encontrado.' });
        }

      })

      const [imgProdDelete] = await pool.query("delete FROM imagenes where IdProduct = ?", [
        product[0].IdGenerate,
      ]);

      if (imgProdDelete.affectedRows >= 0) {
        boolImgProd = true
      }
      
    }catch(err){
      console.log(err);
      return res.status(500).json({ message: "problemas al eliminar imagenes del producto" });
    }
    
    if (boolImgProd && boolLugProd) {
      
      try{
        const [rows] = await pool.query("delete FROM productos where id = ?", [
          id,
        ])
        if (rows){
          return res.status(200).json({ message: "producto eliminado completamente" });
        }
      }catch(err){
        console.log(err);
        return res.status(500).json({ message: "problemas al eliminar producto" });
      }
    }else{
      console.log(boolImgProd);
      console.log(boolLugProd);
      
      return res.status(500).json({ message: "problemas al eliminar alguna informacion del producto" });
    }

  } catch (error) {
    console.log(error);
    
    return res.status(500).json({ message: "Something goes wrong" });
  }
};


export const deleteImgProducto = async (req, res) => {
  
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM imagenes WHERE id = ?", [
      id,
    ]);
    console.log(rows);
    console.log(rows[0].url);
    if (rows) {
      try{
        const [row] = await pool.query("delete FROM imagenes WHERE id = ?", [
          id,
        ]);
        // Construye la ruta absoluta de la imagen
        const imagePath = path.join(__dirname,'img', rows[0].url);

        // Verifica si el archivo existe antes de intentar eliminarlo
        if (fs.existsSync(imagePath)) {
          // Elimina el archivo usando unlink
          await fs.promises.unlink(imagePath);
          res.status(200).json({ message: 'Imagen eliminada exitosamente.' });
        } else {
          res.status(404).json({ error: 'Archivo no encontrado.' });
        }
        
      }catch(err){
        console.log(err);
        return res.status(500).json({ message: "Something goes wrong" });
      }
    }else{
      return res.status(404).json({ message: "imagen not found" });
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something goes wrong" });
  }
};


