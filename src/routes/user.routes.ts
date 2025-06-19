import { Router } from 'express';

import {
  getAllUsersValidator,
  getSingleUserValidator,
  updateUserValidator,
} from '@/middlewares/validators/user-validator';
import { authenticate } from '@/middlewares/authenticate';
import { validateRequest } from '@/middlewares/validate-request';
import authorize from '@/middlewares/authorize';
import deleteCurrentUser from '@/controllers/user/delete-current-user.controller';
import deleteUser from '@/controllers/user/delete-user.controller';
import getAllUsers from '@/controllers/user/get-all-users.controller';
import getCurrentUser from '@/controllers/user/get-current-user.controller';
import getSingleUser from '@/controllers/user/get-user.controller';
import updateCurrentUser from '@/controllers/user/update-current-user.controller';

const router = Router();

router.get(
  '/current',
  authenticate,
  authorize(['admin', 'user']),
  getCurrentUser,
);
router.put(
  '/current',
  authenticate,
  authorize(['admin', 'user']),
  updateUserValidator,
  validateRequest,
  updateCurrentUser,
);
router.delete(
  '/current',
  authenticate,
  authorize(['admin', 'user']),
  deleteCurrentUser,
);
router.get(
  '/',
  authenticate,
  authorize(['admin']),
  getAllUsersValidator,
  validateRequest,
  getAllUsers,
);
router.get(
  '/:userId',
  authenticate,
  authorize(['admin']),
  getSingleUserValidator,
  validateRequest,
  getSingleUser,
);
router.delete(
  '/:userId',
  authenticate,
  authorize(['admin']),
  getSingleUserValidator,
  validateRequest,
  deleteUser,
);

export default router;
