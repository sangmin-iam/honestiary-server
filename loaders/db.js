const mongoose = require("mongoose");

async function connectMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL, () => {
      console.log("Successfully connect to mongoDB");
    });
  } catch (err) {
    console.error("initial connection error: ", err);
  }

  const db = mongoose.connection;

  db.once("open", () => {
    console.log("Connected to MongoDB");
  });

  db.on("error", (err) => {
    console.error("Connection error: ", err);
  });
}

module.exports = connectMongoDB;
