const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const scoreRouter = require("./routers/score.router");
const gameRouter = require("./routers/game.router");

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

app.use("/api/scores", scoreRouter);
app.use("/api/game", gameRouter);

mongoose.connect(process.env.DATABASE)
    .then(() => {
        console.log("MongoDB is successfully running!");
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Holy Server is running on port ${process.env.PORT || 5000}`);
        });
    })
    .catch(err => console.log(`The Holy Server encountered an error: ${err}`));