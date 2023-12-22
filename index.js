const express = require('express');
const cors = require('cors');
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(express.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jlioc3w.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const database = client.db("TaskHub");
    const taskCollection = database.collection("tasks");

    app.get("/tasks", async (req, res) => {
      const userMail = req.query.email;
      const query = {email: userMail}
      const result = await taskCollection.find(query).toArray();
      res.send(result);
    })

    app.post("/tasks", async (req, res) => {
      const newTask = req.body;
      const result = await taskCollection.insertOne(newTask);
      res.send(result);
    });

    app.patch("/tasks/:taskId", async (req, res) => {
      const id = req.params.taskId;
      const query = {_id: new ObjectId(id)};
      const updateDoc = {
        $set: req.body
      }
      const result = await taskCollection.updateOne(query, updateDoc);
      res.send(result);
    })

    app.delete("/tasks/:taskId", async (req, res) => {
      const taskId = req.params.taskId;
      const query = {_id: new ObjectId(taskId)};
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    })
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("task management server is running");
})

app.listen(port, (req, res) => {
    console.log(`listening on ${port}`);
})