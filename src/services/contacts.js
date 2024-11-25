import { Contact } from '../db/models/contact.js';

export function getContacts() {
  return Contact.find();
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
