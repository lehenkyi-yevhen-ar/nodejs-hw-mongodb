import createHttpError from 'http-errors';
import * as fs from 'fs/promises';
import path from 'node:path';
import {
  createContact,
  deleteContactById,
  getContactById,
  getContacts,
  updateContact
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

export async function getContactsController(req, res) {
  const { page, perPage } = parsePaginationParams(req.query);
  const filters = parseFilterParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const contacts = await getContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filters,
    userId: req.user.id
  });

  res.json({
    status: 200,
    message: 'Contacts found successfully!',
    data: {
      data: contacts.contacts,
      page: contacts.page,
      perPage: contacts.perPage,
      totalItems: contacts.totalItems,
      totalPages: contacts.totalPages,
      hasNextPage: contacts.hasNextPage,
      hasPreviousPage: contacts.hasPreviousPage
    }
  });
}

export async function getContactByIdController(req, res) {
  const { contactId } = req.params;

  const contact = await getContactById(contactId, req.user.id);

  if (contact === null) {
    throw new createHttpError(404, 'Contact not found');
  }

  // if (contact.userId.toString() !== req.user.id.toString()) {
  //   throw new createHttpError(403, 'Access is forbidden');
  // }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}`,
    data: contact
  });
}

export async function deleteContactByIdController(req, res) {
  const { contactId } = req.params;

  const result = await deleteContactById(contactId, req.user.id);

  if (result === null) {
    throw new createHttpError(404, 'Contact not found');
  }

  res.sendStatus(204);
}

export async function createContactController(req, res) {
  let photo = null;

  // if (typeof req.file !== 'undefined') {
  if (req.file) {
    if (process.env.ENABLE_CLOUDINARY === 'true') {
      const result = await uploadToCloudinary(req.file.path);
      photo = result;
      fs.unlink(req.file.path);
    } else {
      fs.rename(
        req.file.path,
        path.resolve('src', 'public', 'photos', req.file.filename)
      );
      photo = `http://localhost:3010/photos/${req.file.filename}`;
    }
  }

  const contact = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    isFavourite: req.body.isFavourite,
    contactType: req.body.contactType,
    userId: req.user.id,
    photo
  };

  if (!contact.name || !contact.phoneNumber || !contact.contactType) {
    throw new createHttpError(
      400,
      'Name, Phone and Contact Type fields are required!'
    );
  }

  const result = await createContact(contact);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: result
  });
}

export async function updateContactController(req, res) {
  const { contactId } = req.params;
  const existContact = await getContactById(contactId, req.user.id);
  if (!existContact) {
    throw new createHttpError(404, 'Contact not found');
  }

  let photo = existContact.photo;

  if (typeof req.file !== 'undefined') {
    const uploadResult = await uploadToCloudinary(req.file.path);
    await fs.unlink(req.file.path);
    photo = uploadResult;
  }

  const contact = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    isFavourite: req.body.isFavourite,
    contactType: req.body.contactType,
    photo
  };

  const result = await updateContact(contactId, contact, req.user.id);

  if (result === null) {
    throw new createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result
  });
}
