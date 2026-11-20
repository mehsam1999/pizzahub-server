import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
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
  // get menus
  app.get("/menus", async (req, res) => {
    const query = {}

    console.log("query", req.query)

    // Sorting price by asc and desc
    let sortOption = { _id: -1 }

    if (req.query.sort === "asc") {
      sortOption = { price: 1, _id: -1 }
    }

    if (req.query.sort === "desc") {
      sortOption = { price: -1, _id: -1 }
    }

    // Search by name and description
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } }
      ]
    }

    // Individual filters
    if (req.query.name) {
      query.name = { $regex: req.query.name, $options: "i" }
    }

    if (req.query.category) {
      query.category = req.query.category
    }

    if (req.query.price) {
      query.price = Number(req.query.price)
    }

    if (req.query.description) {
      query.description = {
        $regex: req.query.description,
        $options: "i"
      }
    }

    if (req.query.location) {
      query.location = {
        $regex: req.query.location,
        $options: "i"
      }
    }

    if (req.query.imageUrl) {
      query.imageUrl = req.query.imageUrl
    }

    if (req.query.status) {
      query.status = req.query.status
    }

    // Get menus
    const result = await menuCollection
      .find(query)
      .sort(sortOption)
      .toArray()

    res.send(result)
  })
  //post new menu
  app.post("/menus", async (req, res) => {
    const menu = {
    ...req.body,
    status: "Pending",
  };
    const result = await menuCollection.insertOne(menu);
    res.send(result);
  });
  //delete menu
  app.delete("/menus/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await menuCollection.deleteOne(query);
    res.send(result);
  });

app.get("/", (req, res) => {
  res.send("Pizzahub Server is running!");
});

app.listen(port, () => {
  console.log(`Pizzahub Server is running on port ${port}`);
});
