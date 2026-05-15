import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const teams = [
  { countryName: 'Argentina',     fifaCode: 'ARG', coach: 'Lionel Scaloni',    playersCount: 26, fifaRanking: 1  },
  { countryName: 'Francia',       fifaCode: 'FRA', coach: 'Didier Deschamps',  playersCount: 26, fifaRanking: 2  },
  { countryName: 'Brasil',        fifaCode: 'BRA', coach: 'Dorival Júnior',    playersCount: 26, fifaRanking: 5  },
  { countryName: 'Inglaterra',    fifaCode: 'ENG', coach: 'Thomas Tuchel',     playersCount: 26, fifaRanking: 4  },
  { countryName: 'España',        fifaCode: 'ESP', coach: 'Luis de la Fuente', playersCount: 26, fifaRanking: 3  },
  { countryName: 'Portugal',      fifaCode: 'POR', coach: 'Roberto Martínez',  playersCount: 26, fifaRanking: 6  },
  { countryName: 'Países Bajos',  fifaCode: 'NED', coach: 'Ronald Koeman',     playersCount: 26, fifaRanking: 7  },
  { countryName: 'Bélgica',       fifaCode: 'BEL', coach: 'Domenico Tedesco',  playersCount: 26, fifaRanking: 8  },
  { countryName: 'Italia',        fifaCode: 'ITA', coach: 'Luciano Spalletti', playersCount: 26, fifaRanking: 9  },
  { countryName: 'Alemania',      fifaCode: 'GER', coach: 'Julian Nagelsmann', playersCount: 26, fifaRanking: 10 },
  { countryName: 'Croacia',       fifaCode: 'CRO', coach: 'Zlatko Dalić',      playersCount: 26, fifaRanking: 11 },
  { countryName: 'México',        fifaCode: 'MEX', coach: 'Javier Aguirre',    playersCount: 26, fifaRanking: 18 },
];

const groups = [
  { name: 'Grupo A', description: 'Primer grupo del torneo' },
  { name: 'Grupo B', description: 'Segundo grupo del torneo' },
  { name: 'Grupo C', description: 'Tercer grupo del torneo' },
  { name: 'Grupo D', description: 'Cuarto grupo del torneo' },
  { name: 'Grupo E', description: 'Quinto grupo del torneo' },
  { name: 'Grupo F', description: 'Sexto grupo del torneo' },
];

async function main() {
  console.log('Seeding teams...');
  for (const team of teams) {
    await prisma.team.upsert({
      where: { fifaCode: team.fifaCode },
      update: team,
      create: team,
    });
  }

  console.log('Seeding groups...');
  for (const group of groups) {
    await prisma.group.upsert({
      where: { name: group.name },
      update: group,
      create: group,
    });
  }

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
