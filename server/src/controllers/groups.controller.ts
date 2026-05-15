import type { Request, Response, NextFunction } from 'express';
import { groupsService } from '../services/groups.service';
import { groupSchema, uuidParamSchema } from '../validators/schemas';

export const groupsController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const groups = await groupsService.list();
      res.json(groups);
    } catch (err) {
      next(err);
    }
  },

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = uuidParamSchema.parse(req.params);
      const group = await groupsService.get(id);
      res.json(group);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = groupSchema.parse(req.body);
      const group = await groupsService.create(data);
      res.status(201).json(group);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = uuidParamSchema.parse(req.params);
      const data = groupSchema.parse(req.body);
      const group = await groupsService.update(id, data);
      res.json(group);
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = uuidParamSchema.parse(req.params);
      await groupsService.remove(id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },
};
