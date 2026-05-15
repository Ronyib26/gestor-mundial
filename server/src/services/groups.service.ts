import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { HttpError } from '../middleware/errorHandler';
import type { GroupInput } from '../validators/schemas';

function handleUniqueError(err: unknown, data: GroupInput): never {
  if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === 'P2002'
  ) {
    const target = err.meta?.target as string[] | undefined;
    if (target?.includes('name')) {
      throw new HttpError(
        409,
        `Ya existe un grupo con el nombre "${data.name}"`,
        { name: ['Ya existe un grupo con ese nombre'] }
      );
    }
  }
  throw err;
}

export const groupsService = {
  list() {
    return prisma.group.findMany({
      orderBy: { name: 'asc' },
    });
  },

  get(id: string) {
    return prisma.group.findUniqueOrThrow({ where: { id } });
  },

  async create(data: GroupInput) {
    try {
      return await prisma.group.create({
        data: {
          name: data.name,
          description: data.description ?? null,
        },
      });
    } catch (err) {
      handleUniqueError(err, data);
    }
  },

  async update(id: string, data: GroupInput) {
    try {
      return await prisma.group.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description ?? null,
        },
      });
    } catch (err) {
      handleUniqueError(err, data);
    }
  },

  async remove(id: string) {
    const usedInDistribution = await prisma.assignment.findFirst({
      where: { groupId: id },
      select: { distribution: { select: { name: true } } },
    });
    if (usedInDistribution) {
      throw new HttpError(
        409,
        `No se puede eliminar este grupo porque está siendo usado en la distribución "${usedInDistribution.distribution.name}". Elimina primero la distribución.`
      );
    }
    return prisma.group.delete({ where: { id } });
  },
};
