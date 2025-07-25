const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

//basic connection code
const MONGO_URL = "mongodb://127.0.0.1:27017/WanderStay";

main()
.then(() =>{
    console.log("connected to db");

})
.catch((err) =>{ 
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}


const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) =>({...obj, owner: "687f8b5e0dc4dc805388a9db" }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();
