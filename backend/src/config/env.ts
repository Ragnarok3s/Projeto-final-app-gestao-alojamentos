import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const DATABASE_URL = process.env.DATABASE_URL || '';
const JWT_SECRET = process.env.JWT_SECRET || 'development-secret';

// Certifica-te que existe um ficheiro .env na raiz do backend com as variáveis corretas
export const env = {
  port: PORT,
  databaseUrl: DATABASE_URL,
  jwtSecret: JWT_SECRET,
};
