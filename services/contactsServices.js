import { nanoid } from "nanoid";

import fs from "fs/promises";
import path from "path";
import { log } from "console";

const contactsPath = path.resolve("db", "contacts.json");

const updateContacts = async (contacts) =>
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

const getAll = async () => {
  const contacts = await fs.readFile(contactsPath);

  return JSON.parse(contacts);
};

const getById = async (id) => {
  const contacts = await getAll();

  return contacts.find((contact) => contact.id === id) || null;
};

const add = async (contact) => {
  const contacts = await getAll();
  const newContact = { id: nanoid(), ...contact };
  contacts.push(newContact);

  await updateContacts(contacts);

  return newContact;
};

const updateById = async (id, body) => {
  const contacts = await getAll();
  let updatedContact = await getById(id);

  if (updatedContact) {
    updatedContact = { ...updatedContact, ...body };

    await updateContacts(
      contacts.map((contact) => (contact.id === id ? updatedContact : contact))
    );
  }

  return updatedContact;
};

const removeById = async (id) => {
  const contacts = await getAll();
  const removedContact = await getById(id);

  if (removedContact) {
    const newContacts = contacts.filter((contact) => contact.id !== id);
    await updateContacts(newContacts);
  }

  return removedContact;
};

export default {
  getAll,
  getById,
  updateById,
  removeById,
  add,
};
