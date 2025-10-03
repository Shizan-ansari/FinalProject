

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}


const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

//basic connection code
const dbUrl = process.env.ATLASDB_URL;

main()
.then(() =>{
    console.log("connected to db");

})
.catch((err) =>{ 
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}


const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) =>({...obj, owner: "68c97908e85496dc655ea9e5" }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};
``
initDB();

//updating only owner
// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config({ path: "../.env" }); // force load from root
// }

// const mongoose = require("mongoose");
// const initData = require("./data.js");
// const Listing = require("../models/listing.js");

// const dbUrl = process.env.ATLASDB_URL;

// async function main() {
//   await mongoose.connect(dbUrl);
//   console.log("✅ Connected to DB");
// }

// const WANDER_ADMIN_ID = "68c97908e85496dc655ea9e5"; // replace with actual WanderAdmin _id

// const initDB = async () => {
//   try {
//     for (let listing of initData.data) {
//       const updated = await Listing.updateOne(
//         { title: listing.title }, // match by title
//         { $set: { owner: WANDER_ADMIN_ID } }
//       );

//       if (updated.matchedCount > 0) {
//         console.log(`✅ Updated owner for: ${listing.title}`);
//       } else {
//         console.log(`⚠️ Skipped (not found): ${listing.title}`);
//       }
//     }

//     console.log("🎉 All matching listings updated.");
//     process.exit();
//   } catch (err) {
//     console.error("❌ Error updating listings:", err);
//     process.exit(1);
//   }
// };

// main().then(initDB);
