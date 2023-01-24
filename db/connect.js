const { MongoClient } = require("mongodb");
require("dotenv").config();

const apiClient = new MongoClient(process.env.MONGO_API_URI);

const appClient = new MongoClient(process.env.MONGO_APP_URI);

const apiDatabase = apiClient.db("BJJ-API");
const appDatabase = appClient.db("BJJ-TRAINING-APP");
const submissionCollection = apiDatabase.collection("submissions");
const guardCollection = apiDatabase.collection("guards");
const sweepCollection = apiDatabase.collection("sweeps");
const passCollection = apiDatabase.collection("passes");
const standingCollection = apiDatabase.collection("standing");
const techniquesCollection = apiDatabase.collection("techniques");
const eventCollection = appDatabase.collection("events");
const userCollection = appDatabase.collection("users");
const clubCollection = appDatabase.collection("organizations");
const affiliationCollection = appDatabase.collection("affiliations");

const apiConnection = async () => {
  try {
    await apiClient.connect();
  } catch (error) {
    console.log("Problem connecting to the db");
    apiClient.close();
  }
};

const appConnection = async () => {
  try {
    await apiClient.connect();
  } catch (error) {
    console.log("Problem connecting to the db");
    apiClient.close();
  }
};

// connection();

module.exports = {
  apiClient,
  appClient,
  apiConnection,
  appConnection,
  apiDatabase,
  appDatabase,
  submissionCollection,
  guardCollection,
  sweepCollection,
  passCollection,
  standingCollection,
  techniquesCollection,
  eventCollection,
  userCollection,
  clubCollection,
  affiliationCollection,
};
