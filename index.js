const http = require("http");

const {
  getAll,

  // getOne,
  getByCategory,

  getByQuery,
} = require("./controllers/ApiController");

const {
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
} = require("./controllers/AppController");

const authorizeUser = require("./middleware/auth");

const contentType = "'Content-Type' : 'application/json'";

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, X-PINGOTHER,Content-Type, Accept"
  );

  const category = req.url.split("/")[1];
  const collection = "techniques";

  //get all techniques
  if (req.url === "/api" && req.method === "GET") {
    getAll(req, res, collection);
  }

  //get results by category
  else if (
    (req.url === "/api/submissions" ||
      req.url === "/api/submissions/" ||
      req.url === "/api/guards" ||
      req.url === "/api/guards/" ||
      req.url === "/api/sweeps" ||
      req.url === "/api/sweeps/" ||
      req.url === "/api/passes" ||
      req.url === "/api/passes/" ||
      req.url === "/api/standing" ||
      req.url === "/api/standing/") &&
    req.method === "GET"
  ) {
    getByCategory(req, res, collection, category);
  }

  //get by id
  // else if (
  //   (req.url.match(/\/api\/submissions\/([0-9]+)/) ||
  //     req.url.match(/\/api\/guards\/([0-9]+)/) ||
  //     req.url.match(/\/api\/sweeps\/([0-9]+)/) ||
  //     req.url.match(/\/api\/passes\/([0-9]+)/) ||
  //     req.url.match(/\/api\/standing\/([0-9]+)/)) &&
  //   req.method === "GET"
  // ) {
  //   const id = parseInt(req.url.split("/")[3]);
  //   getOne(req, res, id, collection);
  // }

  //get by query
  else if (
    (req.url.match(/\/api\/submissions?(.*)/) ||
      req.url.match(/\/api\/guards?(.*)/) ||
      req.url.match(/\/api\/sweeps?(.*)/) ||
      req.url.match(/\/api\/passes?(.*)/) ||
      req.url.match(/\/api\/standing?(.*)/)) &&
    req.method === "GET" &&
    req.url.includes("=")
  ) {
    let category;
    const collection = req.url.split("/")[2].split("?")[0];

    let queries = req.url.split("?")[1];
    queries = queries.split("&");

    //validate query input

    if (queries.includes("")) {
      res.writeHead(404, contentType);
      res.end(
        JSON.stringify({
          message: "Please verify query was entered correctly",
        })
      );
    } else {
      const queryObject = generateQueryObject(queries);

      getByQuery(req, res, queryObject, collection);
    }
  }

  //get events from db
  else if (req.url.match(/\/api\/events?(.*)/) && req.method === "GET") {
    const id = req.url.split("=")[1];

    getEvents(req, res, "events", id);
  }

  //add new event to db
  else if (req.url === "/api/events" && req.method === "POST") {
    postEvent(req, res, "events");
  }
  //delete event from db
  else if (req.url === "/api/events" && req.method === "DELETE") {
    removeEvent(req, res, "events");
  }
  //update event
  else if (req.url === "/api/events" && req.method === "PUT") {
    putEvent(req, res, "events");
  }

  //register new user
  else if (req.url === "/register" && req.method === "POST") {
    registerUser(req, res, "users");
  }

  //sign in existing user
  else if (req.url === "/login" && req.method === "POST") {
    loginUser(req, res, "users");
  }

  //authorize user with JWT
  else if (req.url === "/authorize" && req.method === "GET") {
    authorizeUser(req, res);
  }

  //logout user, delete JWT
  else if (req.url === "/logout" && req.method === "GET") {
    logout(req, res);
  }

  //get club user list
  else if (req.url === "/users" && req.method === "POST") {
    retrieveUsers(req, res);
  }

  //get all users
  else if (req.url === "/users" && req.method === "GET") {
    retrieveAllUsers(req, res);
  }

  //update user permissions
  else if (req.url === "/users" && req.method === "PUT") {
    updatePermissions(req, res);
  }

  //add user to club
  else if (req.url === "/addusers" && req.method === "PUT") {
    addUsersToClub(req, res);
  }

  //get clubs
  else if (req.url === "/clubs" && req.method === "GET") {
    getClubs(req, res);
  }

  //post new club
  else if (req.url === "/clubs" && req.method === "POST") {
    postClub(req, res);
  }

  //get affiliations
  else if (req.url === "/affiliations" && req.method === "GET") {
    getAffiliations(req, res);
  }

  //preflight options
  else if (req.method === "OPTIONS") {
    res.writeHead(204, "'Content-Type' : 'text/html'");
    res.end();
  }

  //wrong address
  else {
    res.writeHead(404, contentType);
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});

const generateQueryObject = (queries) => {
  let result = {};

  //create query object
  queries.forEach((query, index) => {
    const queryKey = query.split("=")[0];
    let queryValues = query.split("=")[1].split(",");
    let queryValuesWSpaces = [];

    //replace - with spaces
    queryValues.forEach((item) => {
      queryValuesWSpaces.push(item.replace(/-/g, " "));
    });

    //convert any numbers from strings
    queryValues = queryValues.map((value) => {
      if (value.match(/([0-9]+)/)) {
        return Number(value);
      } else {
        return value;
      }
    });

    //final query object

    //numeric values
    if (queryKey == "difficulty") {
      result = {
        ...result,
        [queryKey]: { $in: queryValues },
      };
    }
    //string values
    else {
      //convert each value to regular expression for case insensitivity
      queryValuesWSpaces.forEach((item, index) => {
        queryValuesWSpaces[index] = new RegExp(item, "i");
      });

      result = {
        ...result,
        [queryKey]: { $in: queryValuesWSpaces },
      };
    }
  });
  return result;
};

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server is listening on port: ${PORT}`));

module.exports = contentType;
