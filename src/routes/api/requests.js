import { Router } from 'express';
import requestController from '../../controllers/requestController';
import commentController from '../../controllers/commentController';
import {
  validateTripRequest, checkRequest, validateTripData, validateTripInput
} from '../../middlewares/trips';
import { validateUpdateRequest, checkRequestManager } from '../../middlewares/request';
import { authorization } from '../../middlewares/auth/auth';
import { permit } from '../../middlewares/users';
import { roleIds } from '../../helpers/default';
import models from '../../models';

const router = Router();


router.post('/requests', [authorization, permit([roleIds.requester]),

  validateTripRequest, checkRequest], requestController.createRequest);

router.post('/requests/:requestId/trips', [authorization, permit([roleIds.requester]),

  validateTripInput, validateTripData], requestController.createRequestTrip);

router.patch('/requests/:requestId', [authorization, permit([roleIds.manager]),

  validateUpdateRequest, checkRequestManager], requestController.updateStatus);

router.post('/requests/:requestId/comments', [authorization, permit([roleIds.requester, roleIds.manager])
  ], commentController.create);

router.get('/requests/:requestId/comments/:commentId', async (req, res, next) => {
  const { commentId } = req.params;
  const comment = await models.comments.findOne({
    where: {
      id: commentId
    },
    include: [models.comments]
  });
  res.send(comment.dataValues);
});
export default router;
