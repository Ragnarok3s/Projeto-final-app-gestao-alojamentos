import { prisma } from '../config/prisma';
import { HttpError } from '../utils/httpError';

interface UnitInput {
  name?: string;
  isActive?: boolean;
}

export async function listUnits() {
  return prisma.unit.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function createUnit(data: UnitInput) {
  if (!data.name || data.name.trim().length === 0) {
    throw new HttpError(400, 'Nome da unidade é obrigatório');
  }

  return prisma.unit.create({
    data: {
      name: data.name.trim(),
      isActive: data.isActive ?? true,
    },
  });
}

export async function updateUnit(id: number, data: UnitInput) {
  if (data.name !== undefined && data.name.trim().length === 0) {
    throw new HttpError(400, 'Nome da unidade é obrigatório');
  }

  const existing = await prisma.unit.findUnique({ where: { id } });
  if (!existing) {
    throw new HttpError(404, 'Unidade não encontrada');
  }

  return prisma.unit.update({
    where: { id },
    data: {
      name: data.name?.trim() ?? existing.name,
      isActive: data.isActive ?? existing.isActive,
    },
  });
}
