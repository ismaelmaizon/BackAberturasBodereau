import app from "./app.js";

import { PORT } from "./config.js";
import __dirname  from './utils.js'

app.listen(8080);
console.log(`Server on port http://localhost:${PORT}`);
console.log('dir: ' + __dirname );

