var jwt = require("jsonwebtoken");
const JWT_SECRET = "Harryisagooodboy@#";
//A middleware is basically a function that will the receive the Request and Response objects,
//just like your route Handlers do. As a third argument you have another function which you should call once your middleware code completed.

const fetchuser = (req, res, next) => {
  // Get the user from jwt token and add id to req object
  const token = req.header("auth-token"); //requesting token from header
  //if token not presen then access denied
  if (!token) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }
};

module.exports = fetchuser;
