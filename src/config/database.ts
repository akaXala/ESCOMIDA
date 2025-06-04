// Crea una instancia del pool de conexiones
import { Pool } from 'pg';

// Para certificados SSL
// import fs from 'fs';
import path from 'path';

// Ruta al archivo .pem
// const sslCertPath = path.join(process.cwd(), 'certificates', 'us-east-2-bundle.pem');

// Pool de conexiones
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // ssl: {
  //   rejectUnauthorized: true, // Rechaza conexiones no autorizadas
  //   ca: fs.readFileSync(sslCertPath).toString(), // Lee el archivo .pem
  // },
});

export default pool;

// Lo que esta comentado será necesario cuando se haga la DB en RDS de AWS