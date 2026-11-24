
const { db } = require("./firebase");

function collection(name) {
  return db.collection(name);
}

// Get all documents from a collection
async function getAll(name) {
  const snapshot = await collection(name).get();

  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id
  }));
}

// Get one document by ID
async function getById(name, id) {
  const snapshot = await collection(name)
    .doc(String(id))
    .get();

  if (!snapshot.exists) {
    return null;
  }

  return {
    ...snapshot.data(),
    id: snapshot.id
  };
}

// Create or replace a document using its existing ID
async function create(name, record) {
  if (!record || !record.id) {
    throw new Error("A record ID is required.");
  }

  await collection(name)
    .doc(String(record.id))
    .set(record);

  return record;
}

// Update an existing document
async function update(name, id, changes) {
  const docRef = collection(name).doc(String(id));
  const snapshot = await docRef.get();

  if (!snapshot.exists) {
    return null;
  }

  const updatedRecord = {
    ...snapshot.data(),
    ...changes,
    id: String(id)
  };

  await docRef.set(updatedRecord);

  return updatedRecord;
}

// Delete a document
async function remove(name, id) {
  const docRef = collection(name).doc(String(id));
  const snapshot = await docRef.get();

  if (!snapshot.exists) {
    return false;
  }

  await docRef.delete();

  return true;
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
