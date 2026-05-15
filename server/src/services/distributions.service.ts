import { prisma } from '../lib/prisma';
import { HttpError } from '../middleware/errorHandler';
import type {
  DistributionPreviewInput,
  DistributionSaveInput,
} from '../validators/schemas';
import type { Team, Group } from '@prisma/client';

function shuffle<T>(items: readonly T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

/** Aplica todas las reglas de negocio para formar grupos. Lanza HttpError si alguna falla. */
async function validateDistributionRules(groupsCount: number): Promise<{
  teams: Team[];
  groups: Group[];
  teamsPerGroup: number;
}> {
  if (groupsCount <= 1) {
    throw new HttpError(400, 'La cantidad de grupos debe ser mayor a 1');
  }

  const [teams, groups] = await Promise.all([
    prisma.team.findMany({ orderBy: { countryName: 'asc' } }),
    prisma.group.findMany({ orderBy: { name: 'asc' } }),
  ]);

  if (groups.length === 0) {
    throw new HttpError(400, 'No hay grupos registrados en base de datos');
  }

  if (groupsCount > groups.length) {
    throw new HttpError(
      400,
      `No existen suficientes grupos registrados (${groups.length}) para realizar la asignación de ${groupsCount} grupos`
    );
  }

  if (teams.length === 0) {
    throw new HttpError(400, 'No hay equipos registrados en base de datos');
  }

  if (teams.length % groupsCount !== 0) {
    throw new HttpError(
      400,
      `Los ${teams.length} equipos no se dividen exactamente entre ${groupsCount} grupos. Cada grupo debe tener la misma cantidad de equipos.`
    );
  }

  return {
    teams,
    groups,
    teamsPerGroup: teams.length / groupsCount,
  };
}

export const distributionsService = {
  async list() {
    const distributions = await prisma.distribution.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        assignments: {
          include: {
            group: true,
            team: true,
          },
        },
      },
    });

    return distributions.map((d) => formatDistribution(d));
  },

  async get(id: string) {
    const distribution = await prisma.distribution.findUniqueOrThrow({
      where: { id },
      include: {
        assignments: {
          include: {
            group: true,
            team: true,
          },
        },
      },
    });

    return formatDistribution(distribution);
  },

  async preview(input: DistributionPreviewInput) {
    const { teams, groups, teamsPerGroup } = await validateDistributionRules(
      input.groupsCount
    );

    const shuffledTeams = shuffle(teams);
    const teamChunks = chunk(shuffledTeams, teamsPerGroup);

    const targetGroups = groups.slice(0, input.groupsCount);

    return {
      totalTeams: teams.length,
      teamsPerGroup,
      groups: targetGroups.map((group, idx) => ({
        groupId: group.id,
        groupName: group.name,
        teamIds: teamChunks[idx].map((t) => t.id),
        teams: teamChunks[idx],
      })),
    };
  },

  async save(input: DistributionSaveInput) {
    // Revalidar todas las reglas al guardar
    const { groups: payloadGroups } = input;
    const groupsCount = payloadGroups.length;

    const { teams: allTeams, groups: allGroups } =
      await validateDistributionRules(groupsCount);

    const allGroupIds = new Set(allGroups.map((g) => g.id));
    const payloadGroupIds = payloadGroups.map((g) => g.groupId);
    for (const groupId of payloadGroupIds) {
      if (!allGroupIds.has(groupId)) {
        throw new HttpError(400, `El grupo ${groupId} no existe`);
      }
    }

    if (new Set(payloadGroupIds).size !== payloadGroupIds.length) {
      throw new HttpError(400, 'No se puede repetir el mismo grupo');
    }

    const allTeamIds = new Set(allTeams.map((t) => t.id));
    const seenTeamIds = new Set<string>();
    const flattenedTeamIds: string[] = [];

    for (const g of payloadGroups) {
      for (const teamId of g.teamIds) {
        if (!allTeamIds.has(teamId)) {
          throw new HttpError(400, `El equipo ${teamId} no existe`);
        }
        if (seenTeamIds.has(teamId)) {
          throw new HttpError(
            400,
            'No se puede repetir un equipo en distintos grupos'
          );
        }
        seenTeamIds.add(teamId);
        flattenedTeamIds.push(teamId);
      }
    }

    if (flattenedTeamIds.length !== allTeams.length) {
      throw new HttpError(
        400,
        'Todos los equipos registrados deben estar asignados a un grupo'
      );
    }

    const expectedSize = allTeams.length / groupsCount;
    for (const g of payloadGroups) {
      if (g.teamIds.length !== expectedSize) {
        throw new HttpError(
          400,
          `Cada grupo debe tener ${expectedSize} equipos`
        );
      }
    }

    const created = await prisma.distribution.create({
      data: {
        name: input.name,
        assignments: {
          create: payloadGroups.flatMap((g) =>
            g.teamIds.map((teamId) => ({
              groupId: g.groupId,
              teamId,
            }))
          ),
        },
      },
      include: {
        assignments: {
          include: { group: true, team: true },
        },
      },
    });

    return formatDistribution(created);
  },

  remove(id: string) {
    return prisma.distribution.delete({ where: { id } });
  },
};

type DistributionWithAssignments = {
  id: string;
  name: string;
  createdAt: Date;
  assignments: {
    id: string;
    distributionId: string;
    groupId: string;
    teamId: string;
    group: Group;
    team: Team;
  }[];
};

function formatDistribution(distribution: DistributionWithAssignments) {
  const byGroup = new Map<
    string,
    { group: Group; teams: Team[] }
  >();

  for (const a of distribution.assignments) {
    const existing = byGroup.get(a.groupId);
    if (existing) {
      existing.teams.push(a.team);
    } else {
      byGroup.set(a.groupId, { group: a.group, teams: [a.team] });
    }
  }

  const groups = Array.from(byGroup.values())
    .sort((a, b) => a.group.name.localeCompare(b.group.name))
    .map(({ group, teams }) => ({
      group,
      teams: teams.sort((x, y) => x.countryName.localeCompare(y.countryName)),
    }));

  return {
    id: distribution.id,
    name: distribution.name,
    createdAt: distribution.createdAt,
    groups,
  };
}
