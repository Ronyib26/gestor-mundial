import { Router } from 'express';
import { teamsController } from '../controllers/teams.controller';

export const teamsRouter: Router = Router();

teamsRouter.get('/', teamsController.list);
teamsRouter.get('/:id', teamsController.get);
teamsRouter.post('/', teamsController.create);
teamsRouter.put('/:id', teamsController.update);
teamsRouter.delete('/:id', teamsController.remove);
