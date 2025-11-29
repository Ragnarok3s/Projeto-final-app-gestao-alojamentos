import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { env } from '../config/env';
import { HttpError } from '../utils/httpError';

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new HttpError(401, 'Credenciais inválidas');
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    throw new HttpError(401, 'Credenciais inválidas');
  }

  const token = jwt.sign({ userId: user.id }, env.jwtSecret, { expiresIn: '1d' });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
    },
  };
}

export async function registerUser(email: string, password: string) {
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new HttpError(400, 'Utilizador já existe');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
    },
  });

  const token = jwt.sign({ userId: user.id }, env.jwtSecret, { expiresIn: '1d' });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
    },
  };
}
