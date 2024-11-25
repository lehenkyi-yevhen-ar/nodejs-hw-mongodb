import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  createContactController,
  deleteContactByIdController,
  getContactByIdController,
  getContactsController,
  updateContactController
} from '../controllers/contact.js';

const router = Router();

router.get('/contacts', ctrlWrapper(getContactsController));

router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));

router.delete('/contacts/:contactId', ctrlWrapper(deleteContactByIdController));

router.post('/contacts', ctrlWrapper(createContactController));

router.patch('/contacts/:contactId', ctrlWrapper(updateContactController));

export default router;
