import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";
import RequestError from "../helpers/RequestError.js";
import contactsService from "../services/contactsServices.js";

const getAllContacts = async (req, res) => {
  const result = await contactsService.getAll();
  res.json(result);
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await contactsService.getById(id);
    res.json(result);
  } catch (error) {
    throw RequestError(404, "Contact not found");
  }
};

const createContact = async (req, res) => {
  const result = await contactsService.add(req.body);
  res.status(201).json(result);
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await contactsService.updateById(id, req.body);
    res.json(result);
  } catch (error) {
    throw RequestError(404, "Contact not found");
  }
};

const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await contactsService.updateById(id, req.body);
    res.json(result);
  } catch (error) {
    throw RequestError(404, "Not Found");
  }
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await contactsService.deleteContact(id);
    res.status(204).json();
  } catch (error) {
    throw RequestError(404, "Contact not found");
  }
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
  deleteContact: ctrlWrapper(deleteContact),
};
