const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;

async function reset() {
  if (!uri) {
    console.error("MONGODB_URI not found");
    return;
  }
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  
  const result = await db.collection("users").updateMany(
    {},
    {
      $set: {
        interviewCreditsLimit: 1000,
        atsCreditsLimit: 1000,
        resumeCreditsLimit: 1000,
      }
    }
  );
  console.log(`Updated ${result.modifiedCount} users`);
  await mongoose.disconnect();
}

reset().catch(console.error);
