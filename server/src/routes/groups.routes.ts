import { Router } from 'express';
import { groupsController } from '../controllers/groups.controller';

export const groupsRouter: Router = Router();

groupsRouter.get('/', groupsController.list);
groupsRouter.get('/:id', groupsController.get);
groupsRouter.post('/', groupsController.create);
groupsRouter.put('/:id', groupsController.update);
groupsRouter.delete('/:id', groupsController.remove);
