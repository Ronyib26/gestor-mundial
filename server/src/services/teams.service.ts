import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { HttpError } from '../middleware/errorHandler';
import type { TeamInput } from '../validators/schemas';

function handleUniqueError(err: unknown, data: TeamInput): never {
  if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === 'P2002'
  ) {
    const target = err.meta?.target as string[] | undefined;
    if (target?.includes('country_name')) {
      throw new HttpError(
        409,
        `Ya existe un equipo registrado para ${data.countryName}`,
        { countryName: ['Ya existe un equipo con ese país'] }
      );
    }
    if (target?.includes('fifa_code')) {
      throw new HttpError(
        409,
        `Ya existe un equipo con el código FIFA "${data.fifaCode}"`,
        { fifaCode: ['Ya existe un equipo con ese código FIFA'] }
      );
    }
    if (target?.includes('fifa_ranking')) {
      throw new HttpError(
        409,
        `Ya existe un equipo con el ranking FIFA #${data.fifaRanking}`,
        { fifaRanking: ['Ya existe un equipo con ese ranking'] }
      );
    }
  }
  throw err;
}

export const teamsService = {
  list() {
    return prisma.team.findMany({
      orderBy: { countryName: 'asc' },
    });
  },

  get(id: string) {
    return prisma.team.findUniqueOrThrow({ where: { id } });
  },

  async create(data: TeamInput) {
    try {
      return await prisma.team.create({ data });
    } catch (err) {
      handleUniqueError(err, data);
    }
  },

  async update(id: string, data: TeamInput) {
    try {
      return await prisma.team.update({ where: { id }, data });
    } catch (err) {
      handleUniqueError(err, data);
    }
  },

  async remove(id: string) {
    const usedInDistribution = await prisma.assignment.findFirst({
      where: { teamId: id },
      select: { distribution: { select: { name: true } } },
    });
    if (usedInDistribution) {
      throw new HttpError(
        409,
        `No se puede eliminar este equipo porque está asignado a la distribución "${usedInDistribution.distribution.name}". Elimina primero la distribución.`
      );
    }
    return prisma.team.delete({ where: { id } });
  },
};
