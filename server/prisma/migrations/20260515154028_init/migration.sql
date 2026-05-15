-- CREACION DE TABLAS
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "country_name" TEXT NOT NULL,
    "fifa_code" TEXT NOT NULL,
    "coach" TEXT NOT NULL,
    "players_count" INTEGER NOT NULL,
    "fifa_ranking" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "distributions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "distributions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "assignments" (
    "id" TEXT NOT NULL,
    "distribution_id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,

    CONSTRAINT "assignments_pkey" PRIMARY KEY ("id")
);

-- INDICES
CREATE UNIQUE INDEX "teams_country_name_key" ON "teams"("country_name");

CREATE UNIQUE INDEX "teams_fifa_code_key" ON "teams"("fifa_code");

CREATE UNIQUE INDEX "groups_name_key" ON "groups"("name");

CREATE INDEX "assignments_distribution_id_idx" ON "assignments"("distribution_id");

CREATE INDEX "assignments_group_id_idx" ON "assignments"("group_id");

CREATE INDEX "assignments_team_id_idx" ON "assignments"("team_id");

CREATE UNIQUE INDEX "assignments_distribution_id_team_id_key" ON "assignments"("distribution_id", "team_id");

-- FOREIGN KEYS
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_distribution_id_fkey" FOREIGN KEY ("distribution_id") REFERENCES "distributions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "assignments" ADD CONSTRAINT "assignments_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "assignments" ADD CONSTRAINT "assignments_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
