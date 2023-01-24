const {
  apiClient,
  apiConnection,
  apiDatabase,
  submissionCollection,
  guardCollection,
  sweepCollection,
  passCollection,
  standingCollection,
  techniquesCollection,
} = require("../db/connect");

require("dotenv").config();

const submissions = require("../data/submissions.json");
const guards = require("../data/guards.json");
const sweeps = require("../data/sweeps.json");
const passes = require("../data/passes.json");
const standing = require("../data/standing.json");
const techniques = require("../data/techniques.json");

const run = async () => {
  try {
    //connect apiClient to server
    await apiConnection();

    //verify connection
    await apiDatabase.command({ ping: 1 });
    console.log("Connected to BJJ API server...");

    //remove existing documents
    // await submissionCollection.deleteMany({});
    // await guardCollection.deleteMany({});
    // await sweepCollection.deleteMany({});
    // await passCollection.deleteMany({});
    // await standingCollection.deleteMany({});
    await techniquesCollection.deleteMany({});

    console.log("Documents removed from the db");

    //update db with new documents
    // await submissionCollection.insertMany(submissions);
    // await guardCollection.insertMany(guards);
    // await sweepCollection.insertMany(sweeps);
    // await passCollection.insertMany(passes);
    // await standingCollection.insertMany(standing);
    await techniquesCollection.insertMany(techniques);

    console.log("Updated the db with current documents");
  } catch (err) {
    console.log(err);
  } finally {
    //close connection
    apiClient.close();
    console.log("DB connection closed successfully");
    process.exit(0);
  }
};

run();
