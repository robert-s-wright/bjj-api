const mongodb = require("mongodb");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//generate salt
const salt = bcrypt.genSaltSync();

const {
  appConnection,
  eventCollection,
  userCollection,
  clubCollection,
  affiliationCollection,
} = require("../db/connect");

//connect to the db.
appConnection();

let activeCollection;

//find events
async function findEvents(id) {
  const results = await activeCollection.find({ clubId: id }).toArray();

  return new Promise((resolve, reject) => {
    resolve(results);
  });
}

//post event
async function insertEvent(body) {
  const results = await activeCollection.insertOne(body);

  return new Promise((resolve, reject) => {
    resolve(results);
  });
}

//delete event
async function deleteEvent(query) {
  const result = await activeCollection.deleteOne({
    _id: new mongodb.ObjectId(query),
  });

  return new Promise((resolve, reject) => {
    resolve(result);
  });
}

//update Event
async function updateEvent(query) {
  const filter = { _id: new mongodb.ObjectId(query._id) };

  function removeId(object) {
    let { _id, ...result } = object;
    return result;
  }

  const updates = { $set: { ...removeId(query) } };

  const result = await activeCollection.updateOne(filter, updates, {
    upsert: true,
  });

  return new Promise((resolve, reject) => {
    resolve(result);
  });
}

//register new user
async function registerUser(credentials) {
  const creds = {
    ...credentials,
    writeAccess: [],
    readAccess: true,
    admin: [],
    coach: [],
    password: await bcrypt.hash(credentials.password, salt),
  };

  //check db for existing user
  const existingUser = await activeCollection.findOne({
    email: creds.email,
  });

  let result;

  if (!existingUser) {
    result = await activeCollection.insertOne(creds);
  } else {
    result = null;
  }

  return new Promise((resolve, reject) => {
    resolve(result);
  });
}

//login user
async function loginUser(credentials) {
  //check db for existing user
  const existingUser = await activeCollection.findOne({
    email: credentials.email,
  });

  const result = {
    success: undefined,
    readAccess: existingUser ? existingUser.readAccess : false,
    token: null,
  };

  if (existingUser === null) {
    result.success = null;
  } else {
    result.success = await bcrypt.compare(
      credentials.password,
      existingUser.password
    );
  }

  if (result.success === true && result.readAccess === true) {
    const token = jwt.sign(
      { user_id: existingUser._id, email: existingUser.email },
      process.env.ACCESS_TOKEN_SECRET
    );
    result.token = token;
  }

  return new Promise((resolve, reject) => {
    resolve(result);
  });
}

//get users

async function getUsers(id) {
  const result = await activeCollection
    .find({ clubId: id })
    .project({ password: 0 })
    .toArray();

  return new Promise((resolve, reject) => {
    resolve(result);
  });
}

//get all users

async function getAllUsers() {
  const result = await activeCollection
    .find()
    .project({ password: 0 })
    .toArray();

  return new Promise((resolve, reject) => {
    resolve(result);
  });
}

//update user permissions

async function updateUserPermissions(data) {
  const users = await activeCollection
    .find({
      _id: { $in: data.map((item) => new mongodb.ObjectId(item._id)) },
    })
    .project({ writeAccess: 1, readAccess: 1, coach: 1, admin: 1 })
    .toArray();

  const result = await Promise.all(
    users.map(async (user) => {
      const filter = { _id: user._id };
      const options = { upsert: false };
      let updateDoc = {};
      data.map((item) => {
        if (item._id === JSON.stringify(user._id).replace(/['"]+/g, "")) {
          for (const key in item) {
            if (key !== "_id") {
              let query = { [key]: user[key] };

              item[key].map((i) => {
                if (query[key].includes(i)) {
                  query[key] = query[key].filter((entry) => {
                    entry !== i;
                  });
                } else {
                  query[key].push(i);
                }
              });
              updateDoc = {
                ...updateDoc,
                $set: { ...updateDoc.$set, ...query },
              };
            }
          }
        }
      });

      const output = await activeCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      return output;
    })
  );

  return new Promise((resolve) => {
    resolve(result);
  });
}

//add users to clubs
async function addUsersToClub(data) {
  console.log(data);
  // const filter = {_id: data.id}
  // const updateDoc = {$set: {clubId: []}}
}

//get clubs
async function getClubs() {
  const result = await activeCollection.find({}).toArray();

  return new Promise((resolve, reject) => {
    resolve(result);
  });
}

//postClub
async function postClub(data) {
  const result = await activeCollection.insertOne(data);

  return new Promise((resolve, reject) => {
    resolve(result);
  });
}

//get affiliations
async function getAffiliations() {
  const result = await activeCollection.find({}).toArray();

  return new Promise((resolve, reject) => {
    resolve(result);
  });
}

const selectCollection = (collection) => {
  switch (collection) {
    case "events":
      activeCollection = eventCollection;
      break;
    case "users":
      activeCollection = userCollection;
      break;
    case "clubs":
      activeCollection = clubCollection;
      break;
    case "affiliations":
      activeCollection = affiliationCollection;
      break;
  }
};

module.exports = {
  selectCollection,
  findEvents,
  insertEvent,
  deleteEvent,
  updateEvent,
  registerUser,
  loginUser,
  getUsers,
  getAllUsers,
  updateUserPermissions,
  addUsersToClub,
  getClubs,
  postClub,
  getAffiliations,
};
