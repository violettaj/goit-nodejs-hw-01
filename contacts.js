const fs = require("fs/promises");
const path = require("path");

const contactsPath = path.resolve(__dirname, "./db/contacts.json");

async function listContacts() {
  const contacts = await getContacts();
  console.table(contacts);
}

async function getContactById(contactId) {
  const id = parseInt(contactId);
  if (isNaN(id)) {
    console.log("Not found");
    return;
  }

  const contacts = await getContacts();
  const contact = contacts.find((contact) => contact.id === id);
  if (contact) {
    console.table(contact);
  } else {
    console.log("Not found");
  }
}

async function removeContact(contactId) {
  const id = parseInt(contactId);
  if (isNaN(id)) {
    console.log("Not found");
    return;
  }

  const contacts = await getContacts();
  await saveContacts(contacts.filter((contact) => contact.id !== id));
  listContacts();
}

async function addContact(name, email, phone) {
  if (!name || !email || !phone) {
    console.log("Name, email and phone are required.");
    return;
  }

  const contacts = await getContacts();
  const newContact = { id: getNextId(contacts), name, email, phone };
  contacts.push(newContact);
  await saveContacts(contacts);
  listContacts();
}

async function getContacts() {
  try {
    const result = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(result);
  } catch (error) {
    console.error("Error occured: ", error);
  }
}

async function saveContacts(contacts) {
  try {
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), "utf8");
  } catch (error) {
    console.error("Error occured: ", error);
  }
}

function getNextId(contacts) {
  let id = 0;
  if (contacts) {
    contacts.forEach((contact) => (id = contact.id > id ? contact.id : id));
  }
  return id + 1;
}

module.exports = { listContacts, getContactById, removeContact, addContact };