/*Entry point — arranca el servidor en local y exporta el handler para Vercel*/
/**  * PITUTI API Server — Entry point  */

import app from './app.js';

// Vercel llama directamente al handler exportado; no necesita listen()
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`\n🐾  Servidor PITUTI corriendo en http://localhost:${PORT}`);
    console.log(`📄  Salud de la API:  http://localhost:${PORT}/api/health`);
    console.log(`🐕  Mascotas demo:    http://localhost:${PORT}/api/pets\n`);
  });
}

// Exportación default requerida por @vercel/node
export default app;
