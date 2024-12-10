import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  createContactController,
  deleteContactByIdController,
  getContactByIdController,
  getContactsController,
  updateContactController
} from '../controllers/contact.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactSchema,
  replaceContactSchema
} from '../validation/contact.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = Router();

router.get('/', ctrlWrapper(getContactsController));

router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));

router.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(deleteContactByIdController)
);

router.post(
  '/',
  validateBody(createContactSchema),
  ctrlWrapper(createContactController)
);

router.patch(
  '/:contactId',
  isValidId,
  validateBody(replaceContactSchema),
  ctrlWrapper(updateContactController)
);

export default router;
