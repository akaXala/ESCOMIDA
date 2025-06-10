// Crea una instancia del pool de conexiones
import { Pool } from 'pg';

// Ruta al archivo .pem
// const sslCertPath = path.join(process.cwd(), 'certificates', 'us-east-2-bundle.pem');

// Pool de conexiones
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default pool;