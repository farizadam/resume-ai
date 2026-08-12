const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

async function check() {
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        let key = match[1].trim();
        let value = match[2].trim();
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        else if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
        process.env[key] = value;
      }
    });
  }

  const uri = process.env.MONGODB_URI;
  try {
    await mongoose.connect(uri);
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    const users = await usersCollection.find({}).toArray();
    console.log("Users in DB:", JSON.stringify(users, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}
check();
