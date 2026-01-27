import app from "./app.js";

import { PORT } from "./config.js";
import __dirname  from './utils.js'

// Host: solo localhost por seguridad
const HOST = process.env.HOST || "127.0.0.1";

app.listen(PORT, HOST, () => {
  console.log(`Server on http://${HOST}:${PORT}`);
  console.log("dir: " + __dirname);
});