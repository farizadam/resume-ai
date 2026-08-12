const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

async function migrate() {
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        let key = match[1].trim();
        let value = match[2].trim();
        // Remove quotes if present
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.slice(1, -1);
        }
        process.env[key] = value;
      }
    });
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI not found");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB.");

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Update all users who don't have atsCreditsLimit or other fields
    const result = await usersCollection.updateMany(
      { atsCreditsLimit: { $exists: false } },
      {
        $set: {
          atsCreditsUsed: 0,
          atsCreditsLimit: 5,
          resumeCreditsUsed: 0,
          resumeCreditsLimit: 5,
          interviewCreditsUsed: 0,
          interviewCreditsLimit: 5
        }
      }
    );

    console.log(`Migration completed. Modified ${result.modifiedCount} user documents.`);
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

migrate();
