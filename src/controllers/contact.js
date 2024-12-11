import createHttpError from 'http-errors';
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
  const contact = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    isFavourite: req.body.isFavourite,
    contactType: req.body.contactType,
    userId: req.user.id
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

  const contact = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    isFavourite: req.body.isFavourite,
    contactType: req.body.contactType
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
