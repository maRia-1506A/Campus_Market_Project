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
    const database = client.db("CampusMarket");
    const productCollection = database.collection("products");
    const userCollection = database.collection("users");
    const chatCollection = database.collection("chats");

    // JWT middleware
    const verifyToken = (req, res, next) => {
      if (!req.headers.authorization) {
        return res.status(401).send({ message: "unauthorized access" });
      }
      const token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).send({ message: "unauthorized access" });
        }
        req.decoded = decoded;
        next();
      });
    };

    // AWT related api
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });
      res.send({ token });
    });

    // user related api
    // create new user
    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "user already exists", insertedID: null });
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    //get user by email(protected)
    app.get("/users/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      if (email !== req.decoded.email) {
        return res.status(403).send({ message: "forbidden access" });
      }
      const query = { email: email };
      const user = await userCollection.findOne(query);
      res.send(user);
    });

    // update user profile (protected)
    app.put("/users/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      if (email !== req.decoded.email) {
        return res.status(403).send({ message: "forbidden access" });
      }
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: req.body.name,
          phone: req.body.phone,
          university: req.body.university,
          avatar: req.body.avatar,
          status: req.body.status || "offline",
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    //delete user account (protected)
    app.delete("/users/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      if (email !== req.decoded.email) {
        return res.status(403).send({ message: "forbidden access" });
      }
      const query = { email: email };
      const user = await userCollection.deleteOne(query);
      res.send(user);
    });

    // for chat display (get user info by email)
    app.get("/user-by-email/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollection.findOne(query, {
        projection: { name: 1, email: 1, avatar: 1, status: 1 },
      });
      res.send(user || {});
    });

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
