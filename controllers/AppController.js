const Results = require("../models/AppModel");
const contentType = require("../index");
const { getPostData } = require("../utils");

//GET events
//GET to /api/events
const getEvents = async (req, res, collection, id) => {
  Results.selectCollection(collection);

  try {
    const results = await Results.findEvents(id);
    res.writeHead(200, contentType);
    res.end(JSON.stringify(results));
  } catch (error) {
    console.log(error);
  }
};

const postEvent = async (req, res, collection) => {
  Results.selectCollection(collection);
  try {
    const body = await getPostData(req);

    const result = await Results.insertEvent(JSON.parse(body));

    res.writeHead(200, contentType);
    res.end(JSON.stringify(result));
  } catch (error) {
    console.log(error);
  }
};

const removeEvent = async (req, res, collection) => {
  Results.selectCollection(collection);
  try {
    const query = await getPostData(req);

    const result = await Results.deleteEvent(JSON.parse(query).id);

    res.writeHead(200, contentType);
    res.end(JSON.stringify(result));
  } catch (error) {
    console.log(error);
  }
};

const putEvent = async (req, res, collection) => {
  Results.selectCollection(collection);
  try {
    const query = await getPostData(req);

    const result = await Results.updateEvent(JSON.parse(query));

    res.writeHead(200, contentType);
    res.end(JSON.stringify(result));
  } catch (error) {
    console.log(error);
  }
};

const registerUser = async (req, res, collection) => {
  Results.selectCollection(collection);
  try {
    const credentials = await getPostData(req);

    const result = await Results.registerUser(JSON.parse(credentials));

    res.writeHead(200, contentType);
    res.end(JSON.stringify(result));
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async (req, res, collection) => {
  Results.selectCollection(collection);
  try {
    const credentials = await getPostData(req);

    const result = await Results.loginUser(JSON.parse(credentials));

    if (result.token) {
      res.setHeader(
        "Set-Cookie",
        `authToken=${result.token}; SameSite=None; Secure; httpOnly`
      );
    }

    res.writeHead(200, contentType);
    res.end(JSON.stringify(result));
  } catch (error) {
    console.log(error);
  }
};

const logout = async (req, res) => {
  try {
    res.setHeader(
      "Set-Cookie",
      "authToken=; Expires=Thu, 01 Jan 1970 00:00:01 GMT"
    );
    res.writeHead(200, contentType);
    res.end();
  } catch (error) {
    console.log(error);
  }
};

const retrieveUsers = async (req, res) => {
  const data = await getPostData(req);
  const id = JSON.parse(data).data;

  Results.selectCollection("users");
  try {
    const result = await Results.getUsers(id);

    res.writeHeader(200, contentType);
    res.end(JSON.stringify(result));
  } catch (error) {
    console.log(error);
  }
};

const retrieveAllUsers = async (req, res) => {
  Results.selectCollection("users");
  try {
    const result = await Results.getAllUsers();

    res.writeHeader(200, contentType);
    res.end(JSON.stringify(result));
  } catch (error) {
    console.log(error);
  }
};

const updatePermissions = async (req, res) => {
  Results.selectCollection("users");
  try {
    const data = await getPostData(req);

    const result = await Results.updateUserPermissions(JSON.parse(data));

    res.writeHead(200, contentType);
    res.end(JSON.stringify(result));
  } catch (error) {
    console.log(error);
  }
};

const addUsersToClub = async (req, res) => {
  Results.selectCollection("users");
  try {
    const data = await getPostData(req);

    const result = await Results.addUsersToClub(JSON.parse(data));

    res.writeHead(200, contentType);
    res.end(JSON.stringify(result));
  } catch (error) {
    console.log(error);
  }
};

const getClubs = async (req, res) => {
  Results.selectCollection("clubs");
  try {
    const result = await Results.getClubs();
    res.writeHead(200, contentType);
    res.end(JSON.stringify(result));
  } catch (error) {
    console.log(error);
  }
};

const postClub = async (req, res) => {
  const newClub = await getPostData(req);

  Results.selectCollection("clubs");
  try {
    const result = await Results.postClub(JSON.parse(newClub));
    res.writeHead(200, contentType);
    res.end(JSON.stringify(result));
  } catch (error) {
    console.log(error);
  }
};

const getAffiliations = async (req, res) => {
  Results.selectCollection("affiliations");
  try {
    const result = await Results.getAffiliations();
    res.writeHead(200, contentType);
    res.end(JSON.stringify(result));
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getEvents,
  postEvent,
  removeEvent,
  putEvent,
  registerUser,
  loginUser,
  logout,
  retrieveUsers,
  retrieveAllUsers,
  updatePermissions,
  addUsersToClub,
  getClubs,
  postClub,
  getAffiliations,
};
