import type { Request, Response, NextFunction } from 'express';
import { distributionsService } from '../services/distributions.service';
import {
  distributionPreviewSchema,
  distributionSaveSchema,
  uuidParamSchema,
} from '../validators/schemas';

export const distributionsController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const distributions = await distributionsService.list();
      res.json(distributions);
    } catch (err) {
      next(err);
    }
  },

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = uuidParamSchema.parse(req.params);
      const distribution = await distributionsService.get(id);
      res.json(distribution);
    } catch (err) {
      next(err);
    }
  },

  async preview(req: Request, res: Response, next: NextFunction) {
    try {
      const data = distributionPreviewSchema.parse(req.body);
      const preview = await distributionsService.preview(data);
      res.json(preview);
    } catch (err) {
      next(err);
    }
  },

  async save(req: Request, res: Response, next: NextFunction) {
    try {
      const data = distributionSaveSchema.parse(req.body);
      const distribution = await distributionsService.save(data);
      res.status(201).json(distribution);
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = uuidParamSchema.parse(req.params);
      await distributionsService.remove(id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },
};
