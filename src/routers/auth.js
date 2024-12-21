import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import {
  loginUserSchema,
  registerUserSchema,
  sendResetEmailSchema,
  resetPasswordSchema,
  confirmOAuthSchema
} from '../validation/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginUserController,
  logoutUserController,
  registerUserController,
  refreshUserController,
  sendResetEmailController,
  resetPasswordController,
  getOAuthURLController,
  confirmOAuthController
} from '../controllers/auth.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController)
);

router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController)
);

router.post('/logout', ctrlWrapper(logoutUserController));

router.post('/refresh', ctrlWrapper(refreshUserController));

router.post(
  '/send-reset-email',
  validateBody(sendResetEmailSchema),
  ctrlWrapper(sendResetEmailController)
);

router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController)
);

router.get('/get-oauth-url', ctrlWrapper(getOAuthURLController));

router.post(
  '/confirm-oauth',
  validateBody(confirmOAuthSchema),
  ctrlWrapper(confirmOAuthController)
);

export default router;
