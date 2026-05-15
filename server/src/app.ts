import 'dotenv/config';
import express, { type Express } from 'express';
import cors from 'cors';
import { teamsRouter } from './routes/teams.routes';
import { groupsRouter } from './routes/groups.routes';
import { distributionsRouter } from './routes/distributions.routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

export function createApp(): Express {
  const app = express();

  const corsOrigin = process.env.CORS_ORIGIN;
  app.use(
    cors({
      origin: corsOrigin
        ? corsOrigin.split(',').map((s) => s.trim())
        : true,
      credentials: true,
    })
  );
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api/teams', teamsRouter);
  app.use('/api/groups', groupsRouter);
  app.use('/api/distributions', distributionsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
