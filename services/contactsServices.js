import { Contact } from "../models/Contact.js";

const updateContacts = async (contacts) => {};

const getAll = async () => {
  const result = await Contact.find({});

  return result;
};

const getById = async (id) => {
  const result = await Contact.findById(id);

  return result;
};

const add = async (contact) => {
  const result = await Contact.create(contact);
  return result;
};

const updateById = async (id, body) => {
  const result = await Contact.findByIdAndUpdate(id, body, { new: true });
  return result;
};

const removeById = async (id) => {
  const result = await Contact.findByIdAndDelete(id);
  return result;
};

export default {
  getAll,
  getById,
  updateById,
  removeById,
  add,
};
