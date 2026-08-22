const Groq = require("groq-sdk");
const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
async function main() {
  try {
    const models = await client.models.list();
    console.log(models.data.map(m => m.id).join(", "));
  } catch (err) {
    console.error(err);
  }
}
main();
