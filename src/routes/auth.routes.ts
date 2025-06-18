import { Router } from 'express';

import {
  loginValidator,
  refreshTokenValidator,
  registerValidator,
} from '@/middlewares/validators/auth-validator';
import { validateRequest } from '@/middlewares/validate-request';
import { authenticate } from '@/middlewares/authenticate';
import registerUser from '@/controllers/auth/register.controller';
import loginUser from '@/controllers/auth/login.controller';
import refreshUserToken from '@/controllers/auth/refresh-token.controller';
import logOut from '@/controllers/auth/logout.controller';

const router = Router();

router.post('/register', registerValidator, validateRequest, registerUser);
router.post('/login', loginValidator, validateRequest, loginUser);
router.post(
  '/refresh-token',
  refreshTokenValidator,
  validateRequest,
  refreshUserToken,
);
router.post('/logout', authenticate, logOut);

export default router;
