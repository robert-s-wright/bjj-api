const {
  apiConnection,
  submissionCollection,
  guardCollection,
  sweepCollection,
  passCollection,
  standingCollection,
  techniquesCollection,
} = require("../db/connect");

//connect to the db.
apiConnection();

let activeCollection;

//find all results
async function findAll() {
  //select collection based on query

  //get data from db
  const results = await activeCollection
    .find({})
    .project({ _id: 0, description: 0 })
    .toArray();

  // resolve to controller
  return new Promise((resolve, reject) => {
    resolve(results);
  });
}

//find by category
async function findByCategory(category) {
  //select collection based on query

  //get data from db
  const results = await activeCollection
    .find({ category: category })
    .project({ _id: 0, description: 0 })
    .toArray();

  // resolve to controller
  return new Promise((resolve, reject) => {
    resolve(results);
  });
}

// //find result by id
// async function findById(id) {
//   //get data from db
//   const result = await activeCollection.findOne(
//     { id: id },
//     { projection: { _id: 0 } }
//   );

//   // resolve to controller
//   return new Promise((resolve, reject) => {
//     resolve(result);
//   });
// }

//find results by query
async function findByQuery(query) {
  const results = await activeCollection
    .find(query)
    .project({ _id: 0, description: 0 })
    .toArray();

  //handle invalid query, return error message

  return new Promise((resolve, reject) => {
    if (results.length === 0) {
      resolve({
        message:
          "There are no results that match your query, please check values and try again",
      });
    } else {
      resolve(results);
    }
  });
}

const selectCollection = (collection) => {
  switch (collection) {
    case "submissions":
      activeCollection = submissionCollection;
      break;
    case "guards":
      activeCollection = guardCollection;
      break;
    case "sweeps":
      activeCollection = sweepCollection;
      break;
    case "passes":
      activeCollection = passCollection;
      break;
    case "standing":
      activeCollection = standingCollection;
      break;
    case "techniques":
      activeCollection = techniquesCollection;
      break;
  }
};

module.exports = {
  findAll,
  findByCategory,
  // findById,
  findByQuery,
  selectCollection,
};
