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

router.get('/contacts', ctrlWrapper(getContactsController));

router.get(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(getContactByIdController)
);

router.delete(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(deleteContactByIdController)
);

router.post(
  '/contacts',
  validateBody(createContactSchema),
  ctrlWrapper(createContactController)
);

router.patch(
  '/contacts/:contactId',
  isValidId,
  validateBody(replaceContactSchema),
  ctrlWrapper(updateContactController)
);

export default router;
