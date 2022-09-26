require("./db/connection");
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 9001
const userRouter = require("./components/users/userRouter")
const { tokenCheck } = require("./middleware");

app.use(cors());
app.use(express.json());
app.use(userRouter);

app.get('/getFruity', (req, res) => {
    const API = "https://www.fruityvice.com/api/fruit/all";
    axios(API)
      .then(response => {
        // console.log(response.data)
        res.json(response.data)
      }).catch(err => {
        res.send('errr!!!')
      })
  })


app.get("/", tokenCheck, (req, res) => {
    res.status(200).send({ message: "You should only see this if you are logged in" })
});

app.get("/test", (req, res) => {
    res.status(200).send({ message: "api is working" })
});

app.listen(port, () => {
    console.log(`listening on port ${port}`)
});