import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import 'dotenv/config'

const app = express();
const port = process.env.PORT || 8000

//middleware
app.use(express.json())
app.use(cors())

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
const mongoClient = await connectToMongoDB()

app.get('/', (req, res) => {
  res.send('Pizzahub Server is running!');
});

app.listen(port, () => {
  console.log(`Pizzahub Server is running on port ${port}`);
});