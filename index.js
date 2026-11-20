import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 8000;

//middleware
app.use(express.json());
app.use(cors());

//mongodb
const client = new MongoClient(process.env.MONGODB_URL);
export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}
const mongoClient = await connectToMongoDB();
//database
const db = mongoClient.db("pizzahubdb");
const userCollection = db.collection("user");
const menuCollection = db.collection("menus");

//users
app.get("/users", async (req, res) => {
  const cursor = userCollection.find({});
  const result = await cursor.toArray();
  res.send(result);
});

//menus related api
 //get menus
  app.get("/menus", async (req, res) => {
    const cursor = menuCollection.find();
    const result = await cursor.toArray();
    res.send(result);
  });
  //post new menu
  app.post("/menus", async (req, res) => {
    const menu = req.body;
    const result = await menuCollection.insertOne(menu);
    res.send(result);
  });

app.get("/", (req, res) => {
  res.send("Pizzahub Server is running!");
});

app.listen(port, () => {
  console.log(`Pizzahub Server is running on port ${port}`);
});
