import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

const createContact = async (req, res) => {
  const contact = await contactsService.add(req.body);

  return res.status(201).json(contact);
};

const getAllContacts = async (req, res) => {
  const contacts = await contactsService.getAll();
  res.json(contacts);
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  const contact = await contactsService.getById(id);

  if (!contact) {
    throw HttpError(404);
  }

  return res.json(contact);
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const contact = await contactsService.updateById(id, req.body);

  if (!contact) {
    throw HttpError(404);
  }

  return res.json(contact);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const contact = await contactsService.removeById(id);

  if (!contact) {
    throw HttpError(404);
  }

  return res.json(contact);
};

export default {
  createContact: ctrlWrapper(createContact),
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  updateContact: ctrlWrapper(updateContact),
  deleteContact: ctrlWrapper(deleteContact),
};
