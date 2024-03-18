import express from "express";
import booksControllers from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();

contactsRouter.get("/", booksControllers.getAllContacts);

contactsRouter.get("/:id", booksControllers.getOneContact);

contactsRouter.delete("/:id", booksControllers.deleteContact);

contactsRouter.post(
  "/",
  validateBody(createContactSchema),
  booksControllers.createContact
);

contactsRouter.put(
  "/:id",
  validateBody(updateContactSchema),
  booksControllers.updateContact
);

export default contactsRouter;
