const Results = require("../models/ApiModel");
const contentType = require("../index");

//Get all
//GET to /api

const getAll = async (req, res, collection, category) => {
  Results.selectCollection(collection);

  try {
    const results = await Results.findAll();
    res.writeHead(200, contentType);
    res.end(JSON.stringify(results));
  } catch (err) {
    console.log(err);
  }
};

//Get by Category
//GET to /api/category

const getByCategory = async (req, res, collection, category) => {
  Results.selectCollection(collection);

  try {
    const results = await Results.findAll();
    res.writeHead(200, contentType);
    res.end(JSON.stringify(results));
  } catch (err) {
    console.log(err);
  }
};

//Get one
//GET to /api/*collection*/:id

// const getOne = async (req, res, id, collection) => {
//   Results.selectCollection(collection);
//   try {
//     const result = await Results.findById(id);
//     if (!result) {
//       res.writeHead(400, contentType);
//       res.end(
//         JSON.stringify({
//           message: `Id ${id} does not correspond to any available results`,
//         })
//       );
//     } else {
//       res.writeHead(200, contentType);
//       res.end(JSON.stringify(result));
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

//Get results by Query
//GET to /api/*collection*?:querykey=queryvalue,queryvalue2&querykey2=queryvalue

const getByQuery = async (req, res, query, collection) => {
  Results.selectCollection(collection);
  try {
    const results = await Results.findByQuery(query);
    if (!results) {
      res.writeHead(400, contentType);
      res.end(JSON.stringify({ message: `Category ${query} does not exist` }));
    } else {
      res.writeHead(200, contentType);
      res.end(JSON.stringify(results));
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getAll,
  getByCategory,
  // getOne,
  getByQuery,
};
