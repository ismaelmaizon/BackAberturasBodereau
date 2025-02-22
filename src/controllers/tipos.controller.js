import { pool } from "../db.js";

// Función para ordenar un array alfabéticamente
function ordenarAlfabeticamenteTipos(array) {
  if (!Array.isArray(array)) {
    throw new Error("El argumento debe ser un array.");
  }

  return array.sort((a, b) => {
      if (typeof a.Tipo !== 'string' || typeof b.Tipo !== 'string') {
          throw new Error("La propiedad 'Tipo' de cada objeto debe ser una cadena de texto.");
      }
      return a.Tipo.localeCompare(b.Tipo);
  });
}



export const getTipos = async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM tipos;");
      console.log('TIPOS: ');
      console.log(rows);
      let tipos = ordenarAlfabeticamenteTipos(rows)
      console.log(tipos);

      
      res.send( {status: 200, message: 'succes', response: tipos} );
    } catch (error) {
      return res.status(500).json({ message: "Something goes wrong" });
    }
  };


export const createTipos = async (req, res) => {
    const { Tipo, Descripcion } = req.body
    console.log(Tipo, Descripcion);
    
    try {
        const [rows] = await pool.query("INSERT INTO tipos (Tipo, Descripcion) VALUES (?,?);",
            [Tipo, Descripcion]
        );
        
        res.send( {status: 200, message: 'succes', response: rows} );
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something goes wrong" });
      }
}


export const deleteTipos = async (req, res) => {
  const { id } = req.params
  try {
      const [rows] = await pool.query("DELETE FROM tipos WHERE id = ?",
          [id]
      );
      
      res.send( {status: 200, message: 'tipo eliminado', response: rows} );
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something goes wrong" });
    }
}