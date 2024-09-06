const getFromDB = async (db, collName, keys) => new Promise((resolve, reject) => {
  const collection = db.collection(collName);

  collection.findOne(keys, (err, doc) => {
    if (doc) {
      resolve(doc);
    } else {
      reject(new Error(`Could not find item in: ${collName}`));
    }
  });
});

const addToDB = async (db, collName, keys) => new Promise((resolve, reject) => {
  const collection = db.collection(collName);

  collection.insertOne(keys, (err, r) => {
    if (r.result.ok) {
      resolve(r.insertedId);
    } else {
      reject(new Error(`Could not insert into: ${collName}`));
    }
  });
});

const getAllFromDB = async (db, collName) => new Promise((resolve, reject) => {
  const collection = db.collection(collName);

  collection.find({}).toArray((err, docs) => {
    if (docs) {
      resolve(docs);
    } else {
      reject(new Error(`Could not find items in: ${collName}`));
    }
  });
});

module.exports = { getFromDB, addToDB, getAllFromDB };
