const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const cookieParser = require('cookie-parser');
const app = express();

const authenticate = require("../middleware/authenticate");

require("../db/conn");
const User = require("../model/UserSchema");

router.get("/", (req, res) => {
  res.send("Hello world from the server routerjs");
});

 

router.post("/register", async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;

  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(422).json({ error: "Please fill the field value" });
  }

  try {
    const userexist = await User.findOne({ email: email });
    if (userexist) {
      return res.status(422).json({ error: "User already exists" });
    } else if (password !== cpassword) {
      return res.status(422).json({ error: "enter the correct passwords" });
    } else {
      const user = new User({ name, email, phone, work, password, cpassword });

      const userRegistered = await user.save();

      if (userRegistered) {
        res.status(201).json({ message: "user registered successfully" });
      } else {
        res.status(500).json({ error: "Failed to register" });
      }
    }
  } catch (err) {
    console.log(err);
  }
});
app.use(cookieParser());

router.post("/signin", async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const userlogin = await User.findOne({ email: email });

    if (!userlogin) {
      res.status(400).json({ error: "Invalid credentials" });
    } else {
      const isMatch = await bcrypt.compare(password, userlogin.password);

      if (!isMatch) {
        res.status(400).json({ error: "Invalid credentials" });
      } else {
        token = await userlogin.generateAuthToken();
        console.log("login ho gAYA GUYS");
        res.cookie("jwtoken",token,{
            expires: new Date(Date.now()+ 25892000000),
            httpOnly: true
        })
        // console.log(req.cookies.jwtoken)
        console.log(userlogin);
        res.status(200).json({ message: "User signIn successful" });
      }
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/about",authenticate,(req,res)=>{
  console.log("welcome to about page")
  res.send(req.rootUser);
});

// get user data for contact us and home page 
router.get('/getdata', authenticate, (req, res) => {
  console.log(`Hello my About`);
  res.send(req.rootUser);
});

// contact us page 

router.post('/contact', authenticate, async (req, res) => {
  try {

      const { name, email, phone, message } = req.body;
      
      if (!name || !email || !phone || !message) {
          console.log("error in contact form");
          return res.json({ error: "plzz filled the contact form " });
      }

      const userContact = await User.findOne({ _id: req.userID });

      if (userContact) {
          
          const userMessage = await userContact.addMessage(name, email, phone, message);

          await userContact.save();

          res.status(201).json({ message: "user Contact successfully" });

      }
      
  } catch (error) {
      console.log(error);
  }

});


// Logout  ka page 
router.get('/logout', (req, res) => {
  console.log(`Hello my Logout Page`);
  res.clearCookie('jwtoken', { path: '/' });
  res.status(200).send('User logout');
});


module.exports = router;




