const express = require("express")
const port = process.env.PORT || 5000
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()

// middleware for the project.
app.use(cors())
app.use(express.json())

// Connecting application.
const uri = `mongodb+srv://${process.env.DataBase_UName}:${process.env.DataBase_Pass}@cluster0.1n7br.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function runDataBase() {
    try {

        app.get('/books', async (req, res) => {
            await client.connect();
            const dName = client.db("MyBookyD_Base").collection("Books");

            const query = {};
            const cursor = dName.find(query);

            const allBooks = await cursor.toArray();
            res.send(allBooks);
        });

        app.get('/books/:id', async (req, res) => {
            await client.connect();
            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            const dName = client.db("MyBookyD_Base").collection("Books");
            const data = await dName.findOne(query);
            console.log(req.body);
            res.send(data);

        });

        // Update deliver api
        app.put('/books/:id', async (req, res) => {
            await client.connect();
            const dName = client.db("MyBookyD_Base").collection("Books");

            const id = req.params.id;
            const qValue = req.body.quantity;

            const filter = { _id: ObjectId(id) };

            const updateDoc = {
                $set: {
                    quantity: qValue - 1,
                },
            };

            const updateQ = await dName.updateOne(filter, updateDoc);
            res.send(updateQ);
        })

        // Update stock quantity api
        app.patch('/books/:id', async (req, res) => {
            await client.connect();
            const dName = client.db("MyBookyD_Base").collection("Books");

            const id = req.params.id;
            const sValue = parseInt(req.body.stock);
            const qValue = parseInt(req.body.qNum);

            const filter = { _id: ObjectId(id) };

            const updateDoc = {
                $set: {
                    quantity: qValue + sValue,
                },
            };

            const updateQ = await dName.updateOne(filter, updateDoc);
            res.send(updateQ);
        })

        // Delete api

        app.delete('/books/:id', async (req, res) => {
            await client.connect();
            const dName = client.db("MyBookyD_Base").collection("Books");

            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const data = await dName.deleteOne(query);
            res.send(data);
        })

        // Inset api

        app.post('/books', async (req, res) => {
            await client.connect();
            const dName = client.db("MyBookyD_Base").collection("Books");

            const newBook = req.body.data;
            const result = await dName.insertOne(newBook);
            res.send(result);

        })
    }
    finally {

    }
}

runDataBase().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Connecting...! Connected now..')
})

app.listen(port, () => {
    console.log('Updating port....');
})