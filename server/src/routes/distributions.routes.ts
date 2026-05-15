import { Router } from 'express';
import { distributionsController } from '../controllers/distributions.controller';

export const distributionsRouter = Router();

distributionsRouter.get('/', distributionsController.list);
distributionsRouter.get('/:id', distributionsController.get);
distributionsRouter.post('/preview', distributionsController.preview);
distributionsRouter.post('/', distributionsController.save);
distributionsRouter.delete('/:id', distributionsController.remove);
