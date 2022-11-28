const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3001;
const bodyParser = require("body-parser");
const { User } = require("./models/User");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose
    .connect("mongodb://localhost:27017/user", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("db cunnect!"))
    .catch((e) => console.error(e));

app.get("/", (req, res) => {
    res.send("Hello World~~");
});

app.post("/register", (req, res) => {
    //회원 가입시 필요한 정보를 client에서 가져오면 db에 추가
    const user = new User(req.body);
    user.save((err, userInfo) => {
        err === true
            ? res.json({ success: false, err })
            : res.status(200).json({ success: true });
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
