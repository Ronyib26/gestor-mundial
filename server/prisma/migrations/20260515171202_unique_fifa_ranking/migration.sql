-- Agregar restriccion UNIQUE al ranking FIFA: cada equipo debe tener un ranking distinto
CREATE UNIQUE INDEX "teams_fifa_ranking_key" ON "teams"("fifa_ranking");
