const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3001;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { User } = require("./models/User");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

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
app.post("/login", (req, res) => {
    // 요청한 이메일을 db에서 유무 체크
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "이메일이 올바르지 않습니다.",
            });
        }
        // 요청한 이메일에 맞는 비밀번호 체크
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) {
                return res.json({
                    loginSuccess: false,
                    message: "비밀번호가 올바르지 않습니다.",
                });
            }
            // 비밀번호 일치 시 토큰 생성
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);

                res.cookie("x_auth", user.token).status(200).json({
                    loginSuccess: true,
                    userId: user._id,
                });
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
