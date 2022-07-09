const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "Harryisagooodboy@#";
//jwt helps to make possible a very secure communication in between client and server

//ROUTE1 - Create a user using : POST "/api/auth/createuser". No login required

router.post(
  "/createuser",
  [

    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Length of password must be atleast 5 character").isLength(
      { min: 5 }
    ),
  ],
  async (req, res) => {
    let success = false;//this success variable is created so to indecate crealy that what had done with backend and will reflect as it is in front end with help of its export
    //if there are errors , return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    // check  user with same email exists allready

    try {
      let user = await User.findOne({ email: req.body.email });//to find the user that already exists or not
      if (user) {
        // if user exists than return this error 
        return res
          .status(400)
          .json({success , error: "Sorry a user with this email already exists" });
      }
      //creating salt for password protection
      const salt = await bcrypt.genSalt(10);//this salt add some additional terms in password so that it will not easily be hacked
      secPass = await bcrypt.hash(req.body.password, salt); //this hash will make a hash of password
      //here we are doing it await because it is returning promises
      //Create a new user
      user = await User.create({ 
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      //here we are provinding a token i.e authtoken to our user who is successfully created an account .
      const authtoken = jwt.sign(data, JWT_SECRET); //it is returning promises

      // res.json(user);
      success = true;
      res.json({success ,authtoken});
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some Error Occured");
    }
  }
);

//ROUTE2 - Authenticate a user using : POST "/api/auth/login". No login required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password can not be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
   
    //if there are errors , return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
       
        return res
          .status(400)
          .json({success, error: "Please try to login with correct credentials" });
      }
      // data sending in auth token
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken =  jwt.sign(data, JWT_SECRET); 
      success = true;
      res.json({success, authtoken});
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server errors");
    }
  }
);

//ROUTE3 - Get logged in user detail : POST "/api/auth/getuser".  login required
router.post( "/getuser",fetchuser,async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})



module.exports = router;



// Why do we async await?

// when we mark any function async than it will return promises and we  have to mark reponse to await

// which instructs to the code that this response is marked await if you have to do any work than you can 
// procced and when the responce is completly accessed than await say okay i am ready to pass on the response 
