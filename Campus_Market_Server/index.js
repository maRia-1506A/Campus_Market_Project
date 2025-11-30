const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

//server
const app = express();
const port = process.env.PORT || 5001;

//middleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://maria104:m0ng0db@cluster0.8ks1nbl.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    const database = client.db("campusMarketDB");
    const productCollection = database.collection("products");
    const userCollection = database.collection("users");
    const chatCollection = database.collection("chats");

    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error(error);
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Campus Market Server is running");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
