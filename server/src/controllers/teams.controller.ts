import type { Request, Response, NextFunction } from 'express';
import { teamsService } from '../services/teams.service';
import { teamSchema, uuidParamSchema } from '../validators/schemas';

export const teamsController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const teams = await teamsService.list();
      res.json(teams);
    } catch (err) {
      next(err);
    }
  },

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = uuidParamSchema.parse(req.params);
      const team = await teamsService.get(id);
      res.json(team);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = teamSchema.parse(req.body);
      const team = await teamsService.create(data);
      res.status(201).json(team);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = uuidParamSchema.parse(req.params);
      const data = teamSchema.parse(req.body);
      const team = await teamsService.update(id, data);
      res.json(team);
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = uuidParamSchema.parse(req.params);
      await teamsService.remove(id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },
};
