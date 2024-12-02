import { Contact } from '../db/models/contact.js';

export async function getContacts({
  page,
  perPage,
  sortBy,
  sortOrder,
  filters
}) {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const contactQuery = Contact.find();

  if (filters.contactType) {
    contactQuery.where('contactType').in(filters.contactType);
  }

  if (filters.isFavourite) {
    contactQuery.where('isFavourite').equals(filters.isFavourite);
  }

  const [total, contacts] = await Promise.all([
    Contact.countDocuments(contactQuery),
    contactQuery
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder })
  ]);

  const totalPages = Math.ceil(total / perPage);
  return {
    contacts,
    page,
    perPage,
    totalItems: total,
    totalPages,
    hasNextPage: totalPages - page > 0,
    hasPreviousPage: page > 1
  };
}

export function getContactById(contactId) {
  return Contact.findById(contactId);
}

export function deleteContactById(contactId) {
  return Contact.findByIdAndDelete(contactId);
}

export function createContact(contact) {
  return Contact.create(contact);
}

export function updateContact(contactId, contact) {
  return Contact.findByIdAndUpdate(contactId, contact, { new: true });
}
