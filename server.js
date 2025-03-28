require("dotenv").config();

// mongodb connection
const mongoose = require("mongoose");
const uri = process.env.DB_URI;

if (uri) {
    mongoose
        .connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000,
        })
        .then(() => {
            console.log("Connected to MongoDB");
        })
        .catch((err) => console.log(err));
} else {
    console.log("No MongoDB URI provided, skipping connection");
}

require("./app");
