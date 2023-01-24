const jwt = require("jsonwebtoken");
const mongodb = require("mongodb");

const contentType = require("../index");
const { appConnection, userCollection } = require("../db/connect");

const authorizeUser = async (req, res) => {
  try {
    let verification;
    let cookies;
    let token;

    if (req.headers.cookie) {
      if (req.headers.cookie.includes(";")) {
        //retrieve cookies
        cookies = req.headers.cookie.split(";");
        //set token value
        token = cookies
          .find((element) => element.includes("authToken"))
          .split("=")[1];
      } else {
        cookies = req.headers.cookie;
        //set token value
        token = cookies.split("=")[1];
      }

      //verify token value against env
      verification = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
          if (err) {
            return {
              success: false,
            };
          } else {
            return { ...decoded, success: true };
          }
        }
      );

      if (verification.success) {
        //db access check
        appConnection();

        const dbAccess = await userCollection.findOne({
          _id: new mongodb.ObjectId(verification.user_id),
        });

        verification = Object.assign(verification, dbAccess);
        delete verification.user_id;
        delete verification.password;

        if (!dbAccess.readAccess) {
          verification = { success: false };
        }
      }
    }

    res.writeHead(200, contentType);
    res.end(JSON.stringify(verification));
  } catch (error) {
    console.log(error);
  }
};

module.exports = authorizeUser;
