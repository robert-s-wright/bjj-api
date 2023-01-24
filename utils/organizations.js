const {
  appClient,
  appConnection,
  appDatabase,
  affiliationCollection,
} = require("../db/connect");

const affiliations = require("../data/affiliations.json");

require("dotenv").config();

const run = async () => {
  try {
    //connect apiClient to server
    await appConnection();

    //verify connection
    await appDatabase.command({ ping: 1 });
    console.log("Connected to BJJ APP server...");

    //remove existing documents
    await affiliationCollection.deleteMany({});

    console.log("Documents removed from the db");

    //update db with new documents
    const payload = affiliations.map((item) => ({ name: item }));

    await affiliationCollection.insertMany(payload);

    console.log("Updated the db with current documents");
  } catch (err) {
    console.log(err);
  } finally {
    //close connection
    appClient.close();
    console.log("DB connection closed successfully");
    process.exit(0);
  }
};

run();
