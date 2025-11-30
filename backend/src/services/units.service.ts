import { prisma } from '../config/prisma';
import { HttpError } from '../utils/httpError';

interface UnitInput {
  name?: string;
  isActive?: boolean;
  capacity?: number;
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

  if (data.capacity === undefined || Number.isNaN(Number(data.capacity))) {
    throw new HttpError(400, 'Capacidade da unidade é obrigatória');
  }

  if (data.capacity <= 0) {
    throw new HttpError(400, 'Capacidade da unidade deve ser maior que zero');
  }

  return prisma.unit.create({
    data: {
      name: data.name.trim(),
      capacity: Math.trunc(data.capacity),
      isActive: data.isActive ?? true,
    },
  });
}

export async function updateUnit(id: number, data: UnitInput) {
  if (data.name !== undefined && data.name.trim().length === 0) {
    throw new HttpError(400, 'Nome da unidade é obrigatório');
  }

  if (data.capacity !== undefined) {
    if (Number.isNaN(Number(data.capacity))) {
      throw new HttpError(400, 'Capacidade da unidade deve ser um número');
    }

    if (data.capacity <= 0) {
      throw new HttpError(400, 'Capacidade da unidade deve ser maior que zero');
    }
  }

  const existing = await prisma.unit.findUnique({ where: { id } });
  if (!existing) {
    throw new HttpError(404, 'Unidade não encontrada');
  }

  return prisma.unit.update({
    where: { id },
    data: {
      name: data.name?.trim() ?? existing.name,
      capacity: data.capacity ?? existing.capacity,
      isActive: data.isActive ?? existing.isActive,
    },
  });
}

export async function deleteUnit(id: number) {
  const existing = await prisma.unit.findUnique({ where: { id } });
  if (!existing) {
    throw new HttpError(404, 'Unidade não encontrada');
  }

  await prisma.unit.delete({ where: { id } });
}
