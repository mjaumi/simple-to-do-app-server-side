const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// mongoDB connection here
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ttk1i.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    await client.connect();

    const taskCollection = client.db('todo').collection('tasks');

    console.log('MongoDB Connected!');

    // POST API for adding a task to the database
    app.post('/task', async (req, res) => {
        const task = req.body;
        const addResult = await taskCollection.insertOne(task);
        res.send(addResult);
    });

    // GET API for getting all the task added by user
    app.get('/task', async (req, res) => {
        const user = req.query.email;
        const query = { user };
        const tasks = await taskCollection.find(query).toArray();
        res.send(tasks);
    });
}

run().catch(console.dir);

// base API
app.get('/', (req, res) => {
    res.send('TO-DO Server Running!!!');
});

// running port
app.listen(port, () => {
    console.log('TO-DO server running on port', port);
})