const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://developementdiginamicit:YBEwuhqBdDWOacpX@cluster0.3jduj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function listDatabases(client) {
  const databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}

async function main() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    await listDatabases(client);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main().catch(console.error);