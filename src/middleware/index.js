const bcrypt = require("bcryptjs");
const Users = require("../components/users/userModel");
const jwt = require("jsonwebtoken");

exports.hashPassword = async (req, res, next) => {
    try {
        if ("password" in req.body) {
            const hashedPassword = await bcrypt.hash(req.body.password, 8)
            req.body.password = hashedPassword
            next()
        } else {
            throw new Error("No password detected")
        }
    } catch (error) {
        res.status(500).send({error: error.message})
    }
}

// exports.tokenCheck = async (req, res, next) => {
//     try {
//         const token = req.header("Authorization").replace("Bearer ", "");
//         const decoded = jwt.verify(token, process.env.SECRET);
//         const user = await Users.findOne({ _id: decoded._id });
//         if (!user) {
//             throw new Error("User does not exist")
//         }
//         req.user = user
//         next()
//     } catch (error) {
//         res.status(500).send({ error: "Please log in" })
//     }
// }

exports.tokenCheck = async (req, res, next) => {
    if (req.header("Authorization")) {
      console.log('Token passed in headers')
      try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.SECRET);
        req.user = await Users.findById(decoded._id);
        next();
      } catch (error) {
        console.log(error);
        res.status(500).send({ error: error.message });
      }
    } else {
      console.log('No token passed in headers')
      res.status(500).send({ error: 'No token passed in headers' });
    }
  };