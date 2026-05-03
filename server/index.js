/*Entry point, arranca o servidor*/
/**  * PITUTI API Server — Entry point  */

import app from './app.js';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`
🐾  Servidor PITUTI corriendo en http://localhost:${PORT}`);
  console.log(`📄  Salud de la API:  http://localhost:${PORT}/api/health`);
  console.log(`🐕  Mascotas demo:    http://localhost:${PORT}/api/pets\n`);
});
